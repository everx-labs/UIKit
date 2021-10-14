/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid/non-secure';
import { BaseRouter, StackRouter, TabRouter, StackActions } from '@react-navigation/native';
import type { DefaultRouterOptions } from '@react-navigation/native';
import type {
    CommonNavigationAction,
    NavigationState,
    ParamListBase,
    PartialState,
    Route,
    Router,
    StackNavigationState,
    TabNavigationState,
} from '@react-navigation/core';

type SplitActionType =
    | {
          type: 'SET_SPLITTED';
          payload: {
              isSplitted: boolean;
              initialRouteName: string;
          };
      }
    | {
          type: 'RESET_TO_INITIAL';
      };

export const SplitActions = {
    setSplitted(isSplitted: boolean, initialRouteName: string): SplitActionType {
        return {
            type: 'SET_SPLITTED',
            payload: {
                isSplitted,
                initialRouteName,
            },
        };
    },
    resetToInitial(): SplitActionType {
        return {
            type: 'RESET_TO_INITIAL',
        };
    },
};

export type SplitActionHelpers = {
    setSplitted(isSplitted?: boolean, initialRouteName?: string): void;
    resetToInitial(): void;
};

export const MAIN_SCREEN_NAME = 'main';

type NavigationRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = Route<
    Extract<RouteName, string>,
    ParamList[RouteName]
> & {
    state?: NavigationState | PartialState<NavigationState>;
    order: number;
};

export type SplitRouterOptions<ParamList extends ParamListBase = ParamListBase> =
    DefaultRouterOptions<Extract<keyof ParamList, string>> & {
        isSplitted: boolean;
    };

const stackStateToTab = <ParamList extends ParamListBase>(
    state: StackLikeSplitNavigationState<ParamList>,
    options: SplitRouterOptions<ParamList>,
): TabLikeSplitNavigationState<ParamList> => {
    let { index } = state;

    const currentRoute = state.routes[index] as NavigationRoute<ParamList, keyof ParamList>;
    if (currentRoute.name !== MAIN_SCREEN_NAME) {
        index = state.routeNames.indexOf(currentRoute.name);
    } else if (options.initialRouteName != null) {
        index = state.routeNames.indexOf(options.initialRouteName);
    }

    const routes = state.routeNames.map(name => {
        const route = state.routes.find(({ name: routeName }) => routeName === name);

        if (route) {
            return {
                ...route,
                // change a route key, to force re-render of the screen
                // to avoid race-conditions in nested navigation
                key: `${route.name}-${nanoid()}`,
            };
        }
        return {
            name,
            key: `${name}-${nanoid()}`,
        };
    }) as TabLikeSplitNavigationState<ParamList>['routes'];

    return {
        ...state,
        index,
        routes,
        history: [currentRoute],
    };
};

const tabStateToStack = <ParamList extends ParamListBase>(
    state: TabLikeSplitNavigationState<ParamList>,
): StackLikeSplitNavigationState<ParamList> => {
    let { index } = state;
    const possibleMainRoute = state.routes.find(({ name }) => name === MAIN_SCREEN_NAME);
    let mainRoute: NavigationRoute<ParamList, keyof ParamList>;

    if (possibleMainRoute) {
        mainRoute = {
            ...possibleMainRoute,
            key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
        } as NavigationRoute<ParamList, keyof ParamList>;
    } else {
        mainRoute = {
            name: MAIN_SCREEN_NAME,
            key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
        } as NavigationRoute<ParamList, keyof ParamList>;
    }
    let routes;
    const currentRoute = {
        ...state.routes[index],
        // change a route key, to force re-render of the screen
        // to avoid race-conditions in nested navigation
        key: `${state.routes[index].name}-${nanoid()}`,
    };
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

type StackLikeSplitNavigationState<ParamList extends ParamListBase = ParamListBase> = Omit<
    StackNavigationState<ParamList>,
    'type' | 'history'
> & {
    type: 'split';
    history?: (
        | NavigationRoute<ParamList, keyof ParamList>
        | {
              type: string;
              key: string;
          }
    )[];
};

type TabLikeSplitNavigationState<ParamList extends ParamListBase = ParamListBase> = Omit<
    TabNavigationState<ParamList>,
    'type' | 'history'
> & {
    type: 'split';
    history?: (
        | NavigationRoute<ParamList, keyof ParamList>
        | {
              type: string;
              key: string;
          }
    )[];
};

export type SplitNavigationState<ParamList extends ParamListBase = ParamListBase> = (
    | StackLikeSplitNavigationState<ParamList>
    | TabLikeSplitNavigationState<ParamList>
) & { isSplitted?: boolean };

export function SplitRouter(routerOptions: SplitRouterOptions) {
    // eslint-disable-next-line prefer-const
    let { isSplitted, initialRouteName, ...tabOptions } = routerOptions;
    const { ...stackOptions } = tabOptions;
    const tabRouter = TabRouter({
        ...tabOptions,
        initialRouteName,
    });
    const stackRouter = StackRouter({
        ...stackOptions,
        initialRouteName: MAIN_SCREEN_NAME,
    });
    let isInitialized = false;
    const router: Router<SplitNavigationState, CommonNavigationAction | SplitActionType> & {
        ensureTabState(state: SplitNavigationState): SplitNavigationState;
        ensureStackState(state: SplitNavigationState): SplitNavigationState;
    } = {
        ...BaseRouter,

        // Every router in react-navigation should have a type
        // and it should be consistent between re-renders
        // or library will try to re-initialize the state
        // with every re-render
        type: 'split',

        ensureTabState(newState: SplitNavigationState) {
            // Move from "main" route in splitted version
            const currentRouteName = newState.routeNames[newState.index];
            if (currentRouteName === MAIN_SCREEN_NAME) {
                if (initialRouteName != null) {
                    // @ts-ignore index is read-only in type declaration
                    newState.index = newState.routeNames.indexOf(initialRouteName);
                } else {
                    // @ts-ignore index is read-only in type declaration
                    newState.index += 1;
                }
            }

            return newState;
        },

        ensureStackState(newState: SplitNavigationState) {
            const mainRoute = newState.routes.find(({ name }) => name === MAIN_SCREEN_NAME) || {
                name: MAIN_SCREEN_NAME,
                key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
            };
            const currentRoute = newState.routes[newState.index];
            if (currentRoute.name === MAIN_SCREEN_NAME) {
                // @ts-ignore index is read-only in type declaration
                newState.index = 0;
                // @ts-ignore routes is read-only in type declaration
                newState.routes = [mainRoute];
            } else {
                // @ts-ignore index is read-only in type declaration
                newState.index = 1;
                // @ts-ignore routes is read-only in type declaration
                newState.routes = [mainRoute, currentRoute];
            }

            return newState;
        },

        getInitialState(params) {
            let newState: SplitNavigationState;

            if (isSplitted) {
                newState = tabRouter.getInitialState(params) as any;
                newState = this.ensureTabState(newState);
            } else {
                newState = stackRouter.getInitialState(params) as any;
                newState = this.ensureStackState(newState);
            }

            Object.assign(newState, { type: router.type, isSplitted });
            return newState;
        },

        getRehydratedState(state, params): SplitNavigationState {
            const isStale = state.stale;
            let newState: SplitNavigationState;

            if (isStale === false) {
                return state as SplitNavigationState;
            }

            if (isSplitted) {
                newState = tabRouter.getRehydratedState(state as any, params) as any;
                newState = this.ensureTabState(newState);
            } else {
                newState = stackRouter.getRehydratedState(state as any, params) as any;
                newState = this.ensureStackState(newState);
            }

            Object.assign(newState, { type: router.type, isSplitted });
            return newState;
        },

        getStateForRouteNamesChange(state, options) {
            const newState: SplitNavigationState = isSplitted
                ? (tabRouter.getStateForRouteNamesChange(state as any, options) as any)
                : stackRouter.getStateForRouteNamesChange(state as any, options);

            Object.assign(newState, { type: router.type, isSplitted });
            return newState;
        },

        getStateForRouteFocus(state, key) {
            const newState: SplitNavigationState = isSplitted
                ? (tabRouter.getStateForRouteFocus(state as any, key) as any)
                : stackRouter.getStateForRouteFocus(state as any, key);

            Object.assign(newState, { type: router.type, isSplitted });
            return newState;
        },

        getStateForAction(state: SplitNavigationState<ParamListBase>, action, options) {
            let newState: SplitNavigationState<ParamListBase> = state;
            if (action.type === 'SET_SPLITTED') {
                ({ isSplitted } = action.payload);

                if (!isInitialized) {
                    isInitialized = true;
                    return state;
                }

                if (action.payload.initialRouteName) {
                    ({ initialRouteName } = action.payload);
                }

                if (isSplitted) {
                    newState = stackStateToTab(
                        state as StackLikeSplitNavigationState<ParamListBase>,
                        routerOptions,
                    );
                } else {
                    newState = tabStateToStack(state as TabLikeSplitNavigationState<ParamListBase>);
                }
            } else if (action.type === 'RESET_TO_INITIAL') {
                if (isSplitted) {
                    const initialRouteIndex = state.routes.findIndex(
                        ({ name }) => name === initialRouteName,
                    );

                    if (initialRouteIndex === -1) {
                        newState = state;
                    } else {
                        // Get the initial route
                        const initialRoute = state.routes[initialRouteIndex];

                        // Recreate the state in order to show the initial route of the navigator
                        const newRoutes = state.routes.map(route => {
                            if (route.key === initialRoute.key) {
                                // Make initial route show its initial sub-route as well!!!
                                const newRoute = route;
                                if (route.state) {
                                    // Change the initial route state to show its initial sub route
                                    const initialSubRouteName = route.state.routeNames
                                        ? route.state.routeNames[0]
                                        : undefined;
                                    if (initialSubRouteName) {
                                        // Filter the sub-routes to leave only an initial sub-route
                                        // @ts-ignore TODO: investigate why there is a TS issue
                                        const newSubRoutes = route.state.routes.filter(subRoute => {
                                            return subRoute.name === initialSubRouteName;
                                        });
                                        if (newSubRoutes.length > 0) {
                                            // Here we can safely re-create the route state
                                            // with an initial sub-route being shown
                                            newRoute.state = {
                                                ...route.state,
                                                routes: newSubRoutes,
                                                index: 0, // show the initial sub-route (with 0 index)
                                            };
                                        } else {
                                            // What if there is no initial sub-route found???
                                        }
                                    } else {
                                        // What if there is no initial sub-route name found???
                                    }
                                } else {
                                    // What if there is not `state` for the route???
                                }
                                return newRoute;
                            }
                            return route;
                        });

                        // Struct a new state to show the truly initial splitted navigator state
                        newState = {
                            ...state,
                            routes: newRoutes,
                            index: initialRouteIndex,
                            history: [{ type: 'route', key: initialRoute.key }],
                        };
                    }
                } else {
                    const tempState = stackRouter.getStateForAction(
                        state as any,
                        StackActions.popToTop(),
                        options,
                    );

                    if (tempState != null) {
                        newState = tempState as any;
                    }
                }
            } else {
                newState = isSplitted
                    ? (tabRouter.getStateForAction(state as any, action, options) as any)
                    : stackRouter.getStateForAction(state as any, action, options);

                if (newState == null) {
                    return null;
                }

                // Ensure the history always includes the initial route
                // N.B. This is mostly important for tab router as it might loose the initial route
                const { history } = newState;
                if (history) {
                    // Check if the history contains the initial route already
                    const initialRoute = state.routes.find(({ name }) => name === initialRouteName);
                    if (initialRoute && !history.find(({ key }) => key === initialRoute.key)) {
                        // Add the initial route to the beginning of the history if not
                        // @ts-ignore `history` is declared as read-only, but we have to overwrite it
                        newState.history = [{ type: 'route', key: initialRoute.key }, ...history];
                    }
                }
            }

            Object.assign(newState, { type: router.type, isSplitted });
            return newState;
        },

        shouldActionChangeFocus(action) {
            return tabRouter.shouldActionChangeFocus(action);
        },
    };

    return router;
}
