import { nanoid } from 'nanoid/non-secure';
import {
    BaseRouter,
    StackRouter,
    TabRouter,
    StackActions,
} from '@react-navigation/native';
import type {
    RouterFactory,
    GenericNavigationAction,
    TabRouterOptions,
} from '@react-navigation/native';
import type {
    ParamListBase,
    StackNavigationState,
    TabNavigationState,
} from '@react-navigation/core';

const SPLIT_ACTION_TYPES = {
    RESET_TO_INITIAL: 'RESET_TO_INITIAL',
    SET_SPLITTED: 'SET_SPLITTED',
};

export const SplitActions = {
    setSplitted(isSplitted: boolean, initialRouteName: string) {
        return {
            type: SPLIT_ACTION_TYPES.SET_SPLITTED,
            payload: {
                isSplitted,
                initialRouteName,
            },
        };
    },
    resetToInitial() {
        return {
            type: SPLIT_ACTION_TYPES.RESET_TO_INITIAL,
        };
    },
};

export const MAIN_SCREEN_NAME = 'main';

export type SplitRouterOptions = TabRouterOptions & {
    isSplitted: boolean;
};

const stackStateToTab = <ParamList extends ParamListBase>(
    state: StackNavigationState<ParamList>,
    options: SplitRouterOptions,
): TabNavigationState<ParamList> => {
    let { index } = state;

    const currentRoute = state.routes[index];
    if (currentRoute.name !== MAIN_SCREEN_NAME) {
        index = state.routeNames.indexOf(currentRoute.name);
    } else if (options.initialRouteName != null) {
        index = state.routeNames.indexOf(options.initialRouteName);
    }

    const routes = state.routeNames.map((name) => {
        return (
            state.routes.find(({ name: routeName }) => routeName === name) || {
                name,
                key: `${name}-${nanoid()}`,
            }
        );
    });

    return {
        ...state,
        index,
        routes,
        history: [currentRoute],
    };
};

const tabStateToStack = <ParamList extends ParamListBase>(
    state: TabNavigationState<ParamList>,
): StackNavigationState<ParamList> => {
    let { index } = state;
    const mainRoute = state.routes.find(
        ({ name }) => name === MAIN_SCREEN_NAME,
    ) || {
        name: MAIN_SCREEN_NAME,
        key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
    };
    let routes;
    const currentRoute = state.routes[index];
    if (currentRoute.name === MAIN_SCREEN_NAME) {
        index = 0;
        routes = [mainRoute];
    } else {
        index = 1;
        routes = [mainRoute, currentRoute];
    }
    return {
        ...state,
        index,
        routes,
    };
};

export type SplitNavigationState<
    ParamList extends ParamListBase
> = StackNavigationState<ParamList> &
    TabNavigationState<ParamList> & {
        type: 'split';
    };

export const SplitRouter: RouterFactory<
    SplitNavigationState<any>, // TODO: replace any
    GenericNavigationAction,
    SplitRouterOptions
> = <ParamList extends ParamListBase>(routerOptions: SplitRouterOptions) => {
    // eslint-disable-next-line prefer-const
    let { isSplitted, initialRouteName, ...tabOptions } = routerOptions;
    const { backBehavior, ...stackOptions } = tabOptions;
    const tabRouter = TabRouter({
        ...tabOptions,
        initialRouteName,
    });
    const stackRouter = StackRouter({
        ...stackOptions,
        initialRouteName: MAIN_SCREEN_NAME,
    });
    let isInitialized = false;
    const router = {
        // $FlowExpectedError
        ...BaseRouter,

        // Every router in react-navigation should have a type
        // And it should be consistent between re-renders
        // Or library will try to re-initialize the state
        // with every re-render
        type: 'split',

        ensureTabState(newState: TabNavigationState<ParamList>) {
            // Move from "main" route in splitted version
            const currentRouteName = newState.routeNames[newState.index];
            if (currentRouteName === MAIN_SCREEN_NAME) {
                if (initialRouteName != null) {
                    newState.index = newState.routeNames.indexOf(
                        initialRouteName,
                    );
                } else {
                    newState.index += 1;
                }
            }

            return newState;
        },

        ensureStackState(newState: StackNavigationState<ParamList>) {
            const mainRoute = newState.routes.find(
                ({ name }) => name === MAIN_SCREEN_NAME,
            ) || {
                name: MAIN_SCREEN_NAME,
                key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
            };
            const currentRoute = newState.routes[newState.index];
            if (currentRoute.name === MAIN_SCREEN_NAME) {
                newState.index = 0;
                newState.routes = [mainRoute];
            } else {
                newState.index = 1;
                newState.routes = [mainRoute, currentRoute];
            }

            return newState;
        },

        getInitialState(params) {
            let newState;

            if (isSplitted) {
                newState = tabRouter.getInitialState(params);
                newState = this.ensureTabState(newState, params);
            } else {
                newState = stackRouter.getInitialState(params);
                newState = this.ensureStackState(newState, params);
            }

            Object.assign(newState, { type: router.type });
            return newState;
        },

        getRehydratedState(state, params) {
            const isStale = state.stale;
            let newState;

            if (isStale === false) {
                return state;
            }

            if (isSplitted) {
                newState = tabRouter.getRehydratedState(state, params);
                newState = this.ensureTabState(newState, params);
            } else {
                newState = stackRouter.getRehydratedState(state, params);
                newState = this.ensureStackState(newState, params);
            }

            Object.assign(newState, { type: router.type });
            return newState;
        },

        getStateForRouteNamesChange(...args) {
            const newState = isSplitted
                ? tabRouter.getStateForRouteNamesChange(...args)
                : stackRouter.getStateForRouteNamesChange(...args);

            Object.assign(newState, { type: router.type });
            return newState;
        },

        getStateForRouteFocus(...args) {
            const newState = isSplitted
                ? tabRouter.getStateForRouteFocus(...args)
                : stackRouter.getStateForRouteFocus(...args);

            Object.assign(newState, { type: router.type });
            return newState;
        },

        getStateForAction(
            state: SplitNavigationState<ParamList>,
            action,
            options,
        ) {
            let newState;
            if (action.type === SPLIT_ACTION_TYPES.SET_SPLITTED) {
                const { isSplitted } = action.payload;

                if (!isInitialized) {
                    isInitialized = true;
                    return state;
                }

                if (action.payload.initialRouteName) {
                    initialRouteName = action.payload.initialRouteName;
                }

                if (isSplitted) {
                    newState = stackStateToTab(state, routerOptions);
                } else {
                    newState = tabStateToStack(state);
                }
            } else if (action.type === SPLIT_ACTION_TYPES.RESET_TO_INITIAL) {
                if (isSplitted) {
                    const initialRouteIndex = state.routes.findIndex(
                        ({ name }) => name === initialRouteName,
                    );

                    if (initialRouteIndex === -1) {
                        newState = state;
                    } else {
                        newState = {
                            ...state,
                            index: initialRouteIndex,
                            history: [state.routes[initialRouteIndex]],
                        };
                    }
                } else {
                    newState = stackRouter.getStateForAction(
                        state,
                        StackActions.popToTop(),
                        options,
                    );
                }
            } else {
                newState = isSplitted
                    ? tabRouter.getStateForAction(state, action, options)
                    : stackRouter.getStateForAction(state, action, options);

                if (newState == null) {
                    return null;
                }

                // Ensure the history always includes the initial route
                // N.B. This is mostly important for tab router as it might loose the initial route
                const { history } = newState;
                if (history) {
                    // Check if the history contains the initial route already
                    const initialRoute = state.routes.find(
                        ({ name }) => name === initialRouteName,
                    );
                    if (
                        initialRoute &&
                        !history.find(
                            // $FlowFixMe
                            ({ key }) => key === initialRoute.key,
                        )
                    ) {
                        // Add the initial route to the beginning of the history if not
                        // $FlowFixMe
                        newState.history = [
                            { type: 'route', key: initialRoute.key },
                            ...history,
                        ];
                    }
                }
            }

            // $FlowFixMe
            Object.assign(newState, { type: router.type });
            return newState;
        },

        shouldActionChangeFocus(action) {
            return tabRouter.shouldActionChangeFocus(action);
        },
    };

    return router;
};
