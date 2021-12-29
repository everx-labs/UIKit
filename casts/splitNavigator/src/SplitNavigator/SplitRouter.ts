/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid/non-secure';
import { BaseRouter, StackRouter } from '@react-navigation/native';
import type { DefaultRouterOptions } from '@react-navigation/native';
import type {
    CommonNavigationAction,
    NavigationState,
    ParamListBase,
    PartialState,
    Route,
    Router,
    RouterConfigOptions,
} from '@react-navigation/core';
import type { StackActionType } from '@react-navigation/routers';

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

type SplitRouterCustomOptions = {
    isSplitted: boolean;
    tabRouteNames: string[];
    stackRouteNames: string[];
};
export type SplitRouterOptions<ParamList extends ParamListBase = ParamListBase> =
    DefaultRouterOptions<Extract<keyof ParamList, string>> & SplitRouterCustomOptions;

export type NavigationRoute<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList,
> = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
    state?: NavigationState | PartialState<NavigationState>;
};

/**
 * Before digging into router let me tell you about the state.
 * Actually the structure if the state has some limitation
 * due to what `react-navigation` expects from router
 * in order to work correct.
 * Need to remember that out of the box `react-navigation`
 * works with three integrated routers:
 * - StackRouter
 * - TabRouter
 * - DrawerRouter
 *
 * All things in the lib are built around what that routers
 * can return.
 *
 * First thing to notice if a key. The key should be persistent across
 * state changes, unless you want to re-render the whole thing.
 * Keep that in mind.
 *
 *
 * Second is index and history.
 * Those two things are very important for proper linking.
 *
 * If you don't know what linking is please read the doc:
 * https://reactnavigation.org/docs/configuring-links
 * TLDR: it's needed to support web urls and deeplinks in mobile.
 *
 * Index shows to the linking system what route is currently active,
 * and the system set is as a route. i.e. if you have following state
 * {
 *   index: 0
 *   routes: [{ name: foo }]
 * }
 * an url will be `/foo`
 */
export type SplitNavigationState<ParamList extends ParamListBase = ParamListBase> = {
    /**
     * Unique key for the navigation state.
     */
    key: string;
    /**
     * Index of the currently focused route.
     *
     * We change this index even for nested stack,
     * to make linking work properly
     */
    index: number;
    /**
     * Index of the currently focused tab route.
     * Since we can't use `index` only for tabs
     */
    tabIndex: number;
    /**
     * List of valid route names as defined in the screen components.
     */
    routeNames: string[];
    /**
     * Whether the navigation state has been rehydrated.
     */
    stale: false;
    /**
     * Custom type for the state, whether it's for split, stack etc.
     * During rehydration, the state will be discarded if type doesn't match with router type.
     * It can also be used to detect the type of the navigator we're dealing with.
     */
    type: 'split';
    /**
     * List of previously visited route indexes.
     */
    history: number[];
    /**
     * Routes to use in stack
     */
    nestedStack?: number[];
    /**
     * List of rendered routes.
     */
    routes: NavigationRoute<ParamList, keyof ParamList>[];
    /**
     * Whether it's splitted now or not
     */
    isSplitted: boolean;
};

function fold<ParamList extends ParamListBase>(
    state: SplitNavigationState<ParamList>,
    stackRouteNames: string[],
): SplitNavigationState<ParamList> {
    const mainRouteIndex = state.routeNames.indexOf(MAIN_SCREEN_NAME);
    const nestedStack = [mainRouteIndex];
    let tabIndex = state.index;
    if (stackRouteNames.includes(state.routes[state.index].name)) {
        tabIndex = mainRouteIndex;
        nestedStack.push(state.index);
    }

    return {
        ...state,
        key: `split-${nanoid()}`,
        tabIndex,
        nestedStack,
        isSplitted: false,
    };
}

function unfold(state: SplitNavigationState, initialRouteName?: string): SplitNavigationState {
    let { index, tabIndex } = state;
    const { history } = state;
    if (state.routes[state.index].name === MAIN_SCREEN_NAME) {
        if (initialRouteName && state.routeNames.includes(initialRouteName)) {
            index = state.routeNames.indexOf(initialRouteName);
            tabIndex = index;
            history.push(index);
        }
    }
    return {
        ...state,
        key: `split-${nanoid()}`,
        index,
        tabIndex,
        history,
        isSplitted: true,
    };
}

function applyTabNavigateActionToRoutes<ParamList extends ParamListBase>(
    state: SplitNavigationState<ParamList>,
    action: CommonNavigationAction,
    options: RouterConfigOptions,
    index: number,
): SplitNavigationState<ParamList>['routes'] {
    if (action.type !== 'NAVIGATE') {
        return state.routes;
    }
    return action.payload.params == null
        ? state.routes
        : state.routes.map((route, i) => {
              if (i !== index) {
                  return route;
              }

              /**
               * Next code up to return is simply copy-pasted
               * from TabRouter to support a merge param
               * https://github.com/react-navigation/react-navigation/blob/%40react-navigation/core%405.16.1/packages/routers/src/TabRouter.tsx#L317-L341
               */
              let newParams: any;

              if (action.type === 'NAVIGATE' && action.payload.merge === false) {
                  newParams =
                      options.routeParamList[route.name] !== undefined
                          ? {
                                ...options.routeParamList[route.name],
                                ...action.payload.params,
                            }
                          : action.payload.params;
              } else {
                  newParams = action.payload.params
                      ? {
                            ...route.params,
                            ...action.payload.params,
                        }
                      : route.params;
              }

              return newParams !== route.params ? { ...route, params: newParams } : route;
          });
}

class SplitUnfoldedRouter<ParamList extends ParamListBase = ParamListBase> {
    options: SplitRouterOptions;

    constructor(options: SplitRouterOptions) {
        this.options = options;
    }

    /*
     * When we in splitted state all routes except `main`
     * are treated as tabs (They're rendered on the right side).
     * `main` is kind of special, as it renders on the left column.
     */
    getInitialState({ routeNames, routeParamList }: RouterConfigOptions): SplitNavigationState {
        const { initialRouteName, isSplitted } = this.options;
        const mainRouteIndex = routeNames.indexOf(MAIN_SCREEN_NAME);
        let index = mainRouteIndex;
        const history = [mainRouteIndex];
        if (initialRouteName != null && routeNames.includes(initialRouteName)) {
            index = routeNames.indexOf(initialRouteName);
            history[0] = index;
        }

        return {
            key: `split-${nanoid()}`,
            index,
            tabIndex: index,
            routeNames,
            stale: false,
            type: 'split',
            isSplitted,
            history,
            routes: routeNames.map(name => {
                if (name === MAIN_SCREEN_NAME) {
                    return {
                        name: MAIN_SCREEN_NAME,
                        key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
                        params: routeParamList[MAIN_SCREEN_NAME],
                    };
                }
                return {
                    name,
                    key: `${name}-${nanoid()}`,
                    params: routeParamList[name],
                };
            }),
        };
    }

    getRehydratedState(
        partialState: SplitNavigationState | PartialState<SplitNavigationState>,
        { routeNames, routeParamList }: RouterConfigOptions,
    ): SplitNavigationState {
        const { initialRouteName, isSplitted } = this.options;

        const routes = routeNames.map(name => {
            // @ts-ignore
            const route = partialState.routes?.find(r => r.name === name) ?? null;
            return {
                ...route,
                name,
                key: route && route.name === name && route.key ? route.key : `${name}-${nanoid()}`,
                params:
                    routeParamList[name] != null
                        ? { ...routeParamList[name], ...route?.params }
                        : route?.params,
            };
        });

        const mainRouteIndex = routeNames.indexOf(MAIN_SCREEN_NAME);
        let index = mainRouteIndex;
        const history = [mainRouteIndex];
        const activeRouteIndex = partialState?.index ?? 0;
        const activeRouteName = partialState.routes[activeRouteIndex]?.name;
        if (activeRouteName != null) {
            if (routeNames.includes(activeRouteName)) {
                // set an index for a regular tab route
                index = routeNames.indexOf(activeRouteName);
                history[0] = index;
            } else if (initialRouteName != null) {
                index = routeNames.indexOf(initialRouteName);
                history[0] = index;
            }
        }

        return {
            key: `split-${nanoid()}`,
            index,
            tabIndex: index,
            routeNames,
            stale: false,
            type: 'split',
            isSplitted,
            history,
            routes,
        };
    }

    getStateForRouteFocus(state: SplitNavigationState, key: string): SplitNavigationState {
        const index = state.routes.findIndex(r => r.key === key);

        if (index === -1 || index === state.index) {
            return state;
        }

        return {
            ...state,
            index,
            tabIndex: index,
            history: state.history.filter(r => r !== index).concat([index]),
        };
    }

    getStateForAction(
        state: SplitNavigationState<ParamList>,
        action: CommonNavigationAction | SplitActionType,
        options: RouterConfigOptions,
    ): SplitNavigationState<ParamList> | null {
        if (action.type === 'RESET_TO_INITIAL') {
            const initialState = this.getInitialState({
                routeNames: state.routeNames,
                routeParamList: {},
                routeGetIdList: {},
            });
            return {
                ...initialState,
                key: state.key,
                routes: state.routes,
            };
        }
        if (action.type === 'GO_BACK') {
            if (state.history.length < 2) {
                return null;
            }
            const prevRouteIndex = state.history[state.history.length - 2];
            return {
                ...state,
                index: prevRouteIndex,
                tabIndex: prevRouteIndex,
                history: state.history.filter(r => r !== prevRouteIndex).concat([prevRouteIndex]),
                routes: applyTabNavigateActionToRoutes(state, action, options, prevRouteIndex),
            };
        }
        if (action.type === 'NAVIGATE') {
            const { key } = action.payload;
            let { name } = action.payload;
            if (key != null) {
                const route = state.routes.find(r => r.key === key);
                name = route?.name;
            }
            if (name == null) {
                return null;
            }
            const index = state.routeNames.indexOf(name);
            return {
                ...state,
                index,
                tabIndex: index,
                history: state.history.filter(r => r !== index).concat([index]),
                routes: applyTabNavigateActionToRoutes(state, action, options, index),
            };
        }
        return null;
    }
}

class SplitFoldedRouter<ParamList extends ParamListBase = ParamListBase> {
    options: SplitRouterOptions<ParamList>;

    stackRouter: ReturnType<typeof StackRouter>;

    constructor(options: SplitRouterOptions<ParamList>) {
        this.options = options;
        this.stackRouter = StackRouter({});
    }

    /**
     * We have two types of routes in folded mode:
     * - Routes that have to be on tabs section,
     *   they have icon in the tab bar,
     *   and are toggled with fade in/out animation;
     * - Routes that have to be in stack navigation.
     *   It's the ones that haven't found a place
     *   in tab bar, therefore have to be animated
     *   from main screen with stack navigation.
     */
    getInitialState({ routeNames, routeParamList }: RouterConfigOptions): SplitNavigationState {
        const { initialRouteName, stackRouteNames, isSplitted } = this.options;
        /**
         * A challenge here is to find index for initialRouteName -
         * it's actually can fall on different states:
         * - If the route is for tab, then we set `index` for root state;
         * - If the route is for stack, then in root state `index` is for main.
         *
         * TODO: discuss behaviour, as for now it might work weird, as a tab for `assets`
         * going to be initial, when in reality it should be `main`, however in splitted mode
         * it's a correct behaviour
         */
        const mainRouteIndex = routeNames.indexOf(MAIN_SCREEN_NAME);
        let index = mainRouteIndex;
        let tabIndex = mainRouteIndex;
        const history = [mainRouteIndex];
        const nestedStack = [mainRouteIndex];
        if (initialRouteName != null && routeNames.includes(initialRouteName)) {
            if (stackRouteNames.includes(initialRouteName)) {
                // It's a route for nested stack
                const nestedStackRouteNameIndex = routeNames.indexOf(initialRouteName);
                index = nestedStackRouteNameIndex;
                // tab index is already points to the main
                nestedStack.push(nestedStackRouteNameIndex);
                history.push(nestedStackRouteNameIndex);
            } else {
                // It's a route for tab navigation
                index = routeNames.indexOf(initialRouteName);
                tabIndex = index;
                history[0] = index;
            }
        }

        return {
            key: `split-${nanoid()}`,
            index,
            tabIndex,
            routeNames,
            stale: false,
            type: 'split',
            isSplitted,
            history,
            nestedStack,
            routes: routeNames.map(name => {
                return {
                    name,
                    key: `${name}-${nanoid()}`,
                    params: routeParamList[name],
                };
            }),
        };
    }

    getRehydratedState(
        partialState: SplitNavigationState | PartialState<SplitNavigationState>,
        { routeNames, routeParamList }: RouterConfigOptions,
    ): SplitNavigationState {
        const { initialRouteName, tabRouteNames, stackRouteNames, isSplitted } = this.options;

        const mainRouteIndex = routeNames.indexOf(MAIN_SCREEN_NAME);
        let index = mainRouteIndex;
        let tabIndex = mainRouteIndex;
        const history = [mainRouteIndex];
        const nestedStack = [mainRouteIndex];
        const activeRouteName = partialState.routes[partialState?.index ?? 0]?.name;
        if (activeRouteName != null) {
            if (tabRouteNames.includes(activeRouteName)) {
                // set an index for a regular tab route
                index = routeNames.indexOf(activeRouteName);
                tabIndex = index;
                history[0] = index;
            } else if (stackRouteNames.includes(activeRouteName)) {
                // leave it as a main and then set index for nested stack
                const nestedStackRouteNameIndex = routeNames.indexOf(activeRouteName);
                index = nestedStackRouteNameIndex;
                // tab index is already points to the main
                nestedStack.push(nestedStackRouteNameIndex);
                history.push(nestedStackRouteNameIndex);
            } else if (initialRouteName) {
                // nothing was found in known routes
                // tring to find initial route
                //
                // (savelichalex): Maybe it's a good place to redirect to 404
                if (stackRouteNames.includes(initialRouteName)) {
                    // It's a route for nested stack
                    const nestedStackRouteNameIndex = routeNames.indexOf(initialRouteName);
                    index = nestedStackRouteNameIndex;
                    // tab index is already points to the main
                    nestedStack.push(nestedStackRouteNameIndex);
                    history.push(nestedStackRouteNameIndex);
                } else {
                    // It's a route for tab navigation
                    index = routeNames.indexOf(initialRouteName);
                    tabIndex = index;
                    history[0] = index;
                }
            }
        }

        return {
            key: `split-${nanoid()}`,
            index,
            tabIndex,
            routeNames,
            stale: false,
            type: 'split',
            isSplitted,
            history,
            nestedStack,
            routes: routeNames.map(name => {
                // @ts-ignore
                const route = partialState.routes?.find(r => r.name === name);
                return {
                    ...route,
                    name,
                    key:
                        route && route.name === name && route.key
                            ? route.key
                            : `${name}-${nanoid()}`,
                    params:
                        routeParamList[name] != null
                            ? { ...routeParamList[name], ...route?.params }
                            : route?.params,
                };
            }),
        };
    }

    getStateForRouteFocus(state: SplitNavigationState, key: string): SplitNavigationState {
        const index = state.routes.findIndex(r => r.key === key);

        if (index === -1 || index === state.index) {
            return state;
        }

        const { stackRouteNames } = this.options;
        const mainRouteIndex = state.routeNames.indexOf(MAIN_SCREEN_NAME);
        const routeToFocusName = state.routes[index].name;
        if (stackRouteNames.includes(routeToFocusName)) {
            return {
                ...state,
                index,
                tabIndex: mainRouteIndex,
                nestedStack: [mainRouteIndex, index],
                history: state.history.filter(r => r !== index).concat([index]),
            };
        }

        return {
            ...state,
            index,
            tabIndex: index,
            history: state.history.filter(r => r !== index).concat([index]),
        };
    }

    getStateForAction(
        state: SplitNavigationState<ParamList>,
        action: CommonNavigationAction | SplitActionType | StackActionType,
        options: RouterConfigOptions,
    ): SplitNavigationState<ParamList> | null {
        const { tabRouteNames } = this.options;
        if (action.type === 'RESET_TO_INITIAL') {
            const initialState = this.getInitialState({
                routeNames: state.routeNames,
                routeParamList: {},
                routeGetIdList: {},
            });
            return {
                ...initialState,
                key: state.key,
                routes: state.routes,
            };
        }
        if (action.type === 'GO_BACK') {
            // In folded mode that shouldn't be a case
            // Suppress TS error
            if (state.nestedStack == null) {
                return null;
            }

            const currentTabRoute = state.routes[state.tabIndex];
            // If it's main, and it has items in stack, try to go_back there
            if (currentTabRoute.name === MAIN_SCREEN_NAME && state.nestedStack.length > 0) {
                const nestedStack = state.nestedStack.slice(0, state.nestedStack.length - 1);
                return {
                    ...state,
                    nestedStack,
                    history: state.history.slice(0, state.history.length - 2),
                    index: nestedStack[nestedStack.length - 1],
                };
            }
            // If it isn't main, then do the same thing as in unfolded router
            if (state.history.length < 2) {
                return null;
            }
            const prevRouteIndex = state.history[state.history.length - 2];
            return {
                ...state,
                index: prevRouteIndex,
                tabIndex: prevRouteIndex,
                history: state.history.filter(r => r !== prevRouteIndex).concat([prevRouteIndex]),
                routes: applyTabNavigateActionToRoutes(state, action, options, prevRouteIndex),
            };
        }
        if (action.type === 'NAVIGATE') {
            // In folded mode that shouldn't be a case
            // Suppress TS error
            if (state.nestedStack == null) {
                return null;
            }

            const { key } = action.payload;
            let { name } = action.payload;
            if (key != null) {
                const route = state.routes.find(r => r.key === key);
                name = route?.name;
            }
            if (name == null) {
                return null;
            }
            const index = state.routeNames.indexOf(name);
            if (tabRouteNames.includes(name)) {
                // In shrinked mode need to apply simple tab navigation
                // only for routes that are in the bar
                return {
                    ...state,
                    index,
                    tabIndex: index,
                    history: state.history.filter(r => r !== index).concat([index]),
                    routes: applyTabNavigateActionToRoutes(state, action, options, index),
                };
            }
            return {
                ...state,
                index,
                nestedStack: [state.tabIndex, index],
                history: state.history.filter(r => r !== index).concat([index]),
                routes: applyTabNavigateActionToRoutes(state, action, options, index),
            };
        }
        if (action.type === 'POP') {
            // In folded mode that shouldn't be a case
            // Suppress TS error
            if (state.nestedStack == null) {
                return null;
            }
            const indexInStack = Math.max(state.nestedStack.length - action.payload.count - 1, 0);

            return {
                ...state,
                index: state.nestedStack[indexInStack],
                nestedStack: state.nestedStack.slice(0, indexInStack + 1),
                history: state.history.slice(0, indexInStack + 1),
            };
        }
        return null;
    }
}

export function SplitRouter(routerOptions: SplitRouterOptions) {
    // eslint-disable-next-line prefer-const
    let { isSplitted } = routerOptions;
    let isInitialized = false;
    const foldedRouter = new SplitFoldedRouter(routerOptions);
    const unfoldedRouter = new SplitUnfoldedRouter(routerOptions);
    const router: Router<SplitNavigationState, CommonNavigationAction | SplitActionType> = {
        ...BaseRouter,

        // Every router in react-navigation should have a type
        // and it should be consistent between re-renders
        // or library will try to re-initialize the state
        // every time
        type: 'split',

        getInitialState(options: RouterConfigOptions) {
            return (isSplitted ? unfoldedRouter : foldedRouter).getInitialState(options);
        },

        /**
         * Usually it's called for linking, as the result of it is a partial state
         * i.e. for /foo/bar it's going to be sth like this
         * {
         *   stale: true,
         *   routes: [{
         *     name: 'foo',
         *     state: {
         *       stale: true,
         *       routes: [{
         *         name: 'bar'
         *       }]
         *     }
         *   }]
         * }
         */
        getRehydratedState(
            state: SplitNavigationState | PartialState<SplitNavigationState>,
            options,
        ): SplitNavigationState {
            const isStale = state.stale;

            if (isStale === false) {
                return state as SplitNavigationState;
            }

            return (isSplitted ? unfoldedRouter : foldedRouter).getRehydratedState(state, options);
        },

        getStateForRouteNamesChange(state /* , options */) {
            console.warn("Dynamic routes isn't supported yet in SplitRouter");
            return state;
        },

        getStateForRouteFocus(state, key) {
            return (isSplitted ? unfoldedRouter : foldedRouter).getStateForRouteFocus(state, key);
        },

        getStateForAction(state: SplitNavigationState<ParamListBase>, action, options) {
            if (action.type === 'SET_SPLITTED') {
                ({ isSplitted } = action.payload);

                if (!isInitialized) {
                    isInitialized = true;
                    return state;
                }

                if (action.payload.initialRouteName) {
                    foldedRouter.options.initialRouteName = action.payload.initialRouteName;
                    unfoldedRouter.options.initialRouteName = action.payload.initialRouteName;
                }

                if (isSplitted) {
                    return unfold(
                        state,
                        action.payload.initialRouteName || unfoldedRouter.options.initialRouteName,
                    );
                }
                return fold(state, routerOptions.stackRouteNames);
            }
            if (action.type === 'SET_PARAMS' || action.type === 'RESET') {
                return BaseRouter.getStateForAction(state, action);
            }
            return (state.isSplitted ? unfoldedRouter : foldedRouter).getStateForAction(
                state,
                action,
                options,
            );
        },

        shouldActionChangeFocus(action) {
            return action.type === 'NAVIGATE';
        },

        actionCreators: SplitActions,
    };

    return router;
}
