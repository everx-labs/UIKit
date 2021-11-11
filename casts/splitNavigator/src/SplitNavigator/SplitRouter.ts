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
    StackNavigationState,
    RouterConfigOptions,
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

type SplitRouterCustomOptions = {
    isSplitted: boolean;
    tabRouteNames: string[];
    stackRouteNames: string[];
};
export type SplitRouterOptions<ParamList extends ParamListBase = ParamListBase> =
    DefaultRouterOptions<Extract<keyof ParamList, string>> & SplitRouterCustomOptions;

type MainRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = Route<
    Extract<RouteName, string>,
    ParamList[RouteName]
> & {
    state: StackNavigationState<ParamList>;
};
type NavigationRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = Route<
    Extract<RouteName, string>,
    ParamList[RouteName]
> & {
    state?: NavigationState | PartialState<NavigationState>;
};

export type SplitNavigationState<ParamList extends ParamListBase = ParamListBase> = {
    /**
     * Unique key for the navigation state.
     */
    key: string;
    /**
     * Index of the currently focused route.
     */
    index: number;
    /**
     * List of valid route names as defined in the screen components.
     */
    routeNames: string[];
    /**
     * List of route names from `routeNames` that have to act as tabs.
     */
    tabRouteNames: string[];
    /**
     * List of route names from `routeNames`
     * that have to be places in a nested stack for the main screen.
     */
    stackRouteNames: string[];
    // TODO
    // stackRouteNames: Extract<keyof ParamList, string>[];
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
     * List of previously visited route keys.
     */
    history: string[];
    /**
     * List of rendered routes.
     */
    routes: (MainRoute<ParamList, keyof ParamList> | NavigationRoute<ParamList, keyof ParamList>)[];
    /**
     * Whether it's splitted now or not
     */
    isSplitted: boolean;
};

function fold<ParamList extends ParamListBase>(
    state: SplitNavigationState<ParamList>,
): SplitNavigationState<ParamList> {
    const mainRouteIndex = state.routeNames.indexOf(MAIN_SCREEN_NAME);
    const mainRoute = state.routes[mainRouteIndex];
    const currentRoute = state.routes[state.index];
    const currentRouteName = currentRoute.name;
    const currentRouteIsForStack = state.stackRouteNames.includes(currentRouteName);

    return {
        ...state,
        key: `split-${nanoid()}`,
        index: currentRouteIsForStack
            ? mainRouteIndex
            : state.tabRouteNames.indexOf(currentRouteName),
        // TODO
        history: [],
        // @ts-ignore
        routes: state.tabRouteNames.map(name => {
            if (name === MAIN_SCREEN_NAME) {
                const mainStackRouteNames = [MAIN_SCREEN_NAME, ...state.stackRouteNames];
                const mainStackRoutes: {
                    name: Extract<keyof ParamList, string>;
                    key: string;
                    params: ParamList;
                    state?: StackNavigationState<ParamList>;
                }[] = [
                    {
                        name: MAIN_SCREEN_NAME as Extract<keyof ParamList, string>,
                        key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
                        params: mainRoute.params as any,
                    },
                ];
                const hasNestedActiveRoute =
                    state.index !== mainRouteIndex && currentRouteIsForStack;
                if (hasNestedActiveRoute) {
                    mainStackRoutes.push({
                        name: currentRouteName,
                        key: `${currentRouteName}-${nanoid()}`,
                        params: currentRoute.params as any,
                        state: currentRoute.state as any,
                    });
                }
                return {
                    name: MAIN_SCREEN_NAME,
                    key: `${name}-${nanoid()}`,
                    params: state.routes[mainRouteIndex].params,
                    state: {
                        stale: false,
                        type: 'stack',
                        key: `stack-${nanoid()}`,
                        index: hasNestedActiveRoute ? 1 : 0,
                        routeNames: mainStackRouteNames,
                        routes: mainStackRoutes,
                    },
                };
            }
            const routeForName = state.routes[state.routeNames.indexOf(name)];
            return {
                name,
                key: `${name}-${nanoid()}`,
                params: routeForName == null ? undefined : routeForName.params,
                state: routeForName == null ? undefined : routeForName.state,
            };
        }),
    };
}

function unfold<ParamList extends ParamListBase>(
    state: SplitNavigationState,
): SplitNavigationState {
    const mainRouteIndex = state.tabRouteNames.indexOf(MAIN_SCREEN_NAME);
    const mainRoute = state.routes[mainRouteIndex] as MainRoute<ParamList, keyof ParamList>;
    const currentRoute = state.routes[state.index];

    let index = 0;
    if (state.index === mainRouteIndex) {
        if (mainRoute.state.index > 0) {
            const currentNestedRoute = mainRoute.state.routes[mainRoute.state.index];
            index = state.routeNames.indexOf(currentNestedRoute.name);
        } else {
            index = state.routeNames.indexOf(MAIN_SCREEN_NAME);
        }
    } else {
        index = state.routeNames.indexOf(currentRoute.name);
    }

    return {
        ...state,
        key: `split-${nanoid()}`,
        index,
        // TODO
        history: [],
        routes: state.routeNames.map(name => {
            let routeForNameIndex = state.tabRouteNames.indexOf(name);
            let routeForName: typeof state.routes[0] | null = null;
            if (routeForNameIndex > -1) {
                routeForName = state.routes[routeForNameIndex];
            } else {
                routeForNameIndex = mainRoute.state.routeNames.indexOf(name as any);
                if (routeForNameIndex > -1) {
                    routeForName = mainRoute.state.routes[routeForNameIndex];
                }
            }
            return {
                name,
                key: `${name}-${nanoid()}`,
                params: routeForName == null ? undefined : routeForName.params,
                state: routeForName == null ? undefined : routeForName.state,
            };
        }),
    };
}

function applyTabNavigateActionToState<ParamList extends ParamListBase>(
    state: SplitNavigationState<ParamList>,
    action: CommonNavigationAction,
    options: RouterConfigOptions,
    index: number,
): SplitNavigationState<ParamList> | null {
    if (action.type !== 'NAVIGATE') {
        return null;
    }
    return {
        ...state,
        index,
        routes:
            action.payload.params == null
                ? state.routes
                : state.routes.map((route, i) => {
                      if (i === index) {
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
                  }),
    };
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
        const { initialRouteName, tabRouteNames, stackRouteNames, isSplitted } = this.options;
        const index =
            // TODO: do we really need to check for includes, isn't it get -1 another way?
            initialRouteName != null && routeNames.includes(initialRouteName)
                ? routeNames.indexOf(initialRouteName)
                : 0;
        return {
            key: `split-${nanoid()}`,
            index,
            routeNames,
            tabRouteNames,
            stackRouteNames,
            stale: false,
            type: 'split',
            isSplitted,
            history: initialRouteName != null ? [initialRouteName] : [routeNames[0]],
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
        partialState: PartialState<SplitNavigationState<ParamList>>,
        { routeNames, routeParamList }: RouterConfigOptions,
    ): SplitNavigationState<ParamList> {
        const { initialRouteName, tabRouteNames, stackRouteNames, isSplitted } = this.options;

        const routes = routeNames.map(name => {
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

        let index = 0;
        const activeRouteName = partialState.routes[partialState?.index ?? 0]?.name;
        if (activeRouteName != null) {
            if (routeNames.includes(activeRouteName)) {
                // set provided route as initial
                index = routeNames.indexOf(activeRouteName);
            } else {
                /**
                 * Sth went wrong and provided route wasn't found
                 * TODO: Maybe it's a good place to redirect to 404
                 *
                 * TODO: not sure about main though
                 */
                index = routeNames.indexOf(initialRouteName || MAIN_SCREEN_NAME);
            }
        } else {
            // set initial otherwise
            // TODO: not sure about main though
            index = routeNames.indexOf(initialRouteName || MAIN_SCREEN_NAME);
        }

        return {
            key: `split-${nanoid()}`,
            index,
            routeNames,
            tabRouteNames,
            stackRouteNames,
            stale: false,
            type: 'split',
            isSplitted,
            history: initialRouteName != null ? [initialRouteName] : [routeNames[0]],
            // @ts-ignore
            routes,
        };
    }

    getStateForAction(
        state: SplitNavigationState<ParamList>,
        action: CommonNavigationAction | SplitActionType,
        options: RouterConfigOptions,
    ): SplitNavigationState<ParamList> | null {
        if (action.type === 'RESET_TO_INITIAL') {
            // TODO
            return state;
        }
        if (action.type === 'GO_BACK') {
            // TODO
            return null;
        }
        if (action.type === 'NAVIGATE') {
            const { name } = action.payload;
            // TODO: should we handle a key?
            if (name == null) {
                return null;
            }
            // In unfolded mode we always should apply tab navigation
            const index = state.routeNames.indexOf(name);
            return applyTabNavigateActionToState(state, action, options, index);
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
        const { initialRouteName, tabRouteNames, stackRouteNames, isSplitted } = this.options;
        /**
         * First challenge is to find index for initialRouteName -
         * it's actually can fall on different states:
         * - If the route is for tab, then we set `index` for root state;
         * - If the route is for stack, then in root state `index` is for main.
         *
         * TODO: discuss behaviour, as for now it might work weird, as a tab for `assets`
         * going to be initial, when in reality it should be `main`, however in splitted mode
         * it's a correct behaviour
         */
        let index = 0;
        let stackIndex = 0;
        let history = [MAIN_SCREEN_NAME];
        if (initialRouteName == null) {
            // TODO: no-op?
        } else if (tabRouteNames.includes(initialRouteName)) {
            index = tabRouteNames.indexOf(initialRouteName);
            history = [initialRouteName];
        } else {
            // it's a route for stack
            index = tabRouteNames.indexOf(MAIN_SCREEN_NAME);
            // It's 1 as nested state will consist of two items:
            // 0. main screen
            // 1. initial screen, that is going to be active
            stackIndex = 1;
            history = [MAIN_SCREEN_NAME];
        }

        return {
            key: `split-${nanoid()}`,
            index,
            routeNames,
            tabRouteNames,
            stackRouteNames,
            stale: false,
            type: 'split',
            history,
            routes: tabRouteNames.map(name => {
                if (name === MAIN_SCREEN_NAME) {
                    /**
                     * Second challenge is to create a correct state
                     * for nested stack navigation here
                     */
                    const mainStackRouteNames = [MAIN_SCREEN_NAME, ...stackRouteNames];
                    const mainStackRoutes = [
                        {
                            name: MAIN_SCREEN_NAME,
                            key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
                            params: routeParamList[MAIN_SCREEN_NAME],
                        },
                    ];
                    // It means that initial route have to be in nested stack
                    if (initialRouteName != null && stackIndex > 0) {
                        mainStackRoutes.push({
                            name: initialRouteName,
                            key: `${initialRouteName}-${nanoid()}`,
                            params: routeParamList[initialRouteName],
                        });
                    }
                    return {
                        name: MAIN_SCREEN_NAME,
                        key: `${name}-${nanoid()}`,
                        params: routeParamList[name],
                        state: {
                            stale: false,
                            type: 'stack',
                            key: `stack-${nanoid()}`,
                            index: stackIndex,
                            routeNames: mainStackRouteNames,
                            routes: mainStackRoutes,
                        },
                    };
                }
                return {
                    name,
                    key: `${name}-${nanoid()}`,
                    params: routeParamList[name],
                };
            }),
            isSplitted,
        };
    }

    getRehydratedState(
        partialState: PartialState<SplitNavigationState<ParamList>>,
        { routeNames, routeParamList }: RouterConfigOptions,
    ): SplitNavigationState<ParamList> {
        const { initialRouteName, tabRouteNames, stackRouteNames, isSplitted } = this.options;

        let rootIndex = 0;
        let stackIndex = 0;
        const activeRouteName = partialState.routes[partialState?.index ?? 0]?.name;
        let history = [MAIN_SCREEN_NAME];
        if (activeRouteName != null) {
            if (tabRouteNames.includes(activeRouteName)) {
                // set an index for a regular tab route
                rootIndex = tabRouteNames.indexOf(activeRouteName);
                history = [activeRouteName];
            } else if (stackRouteNames.includes(activeRouteName)) {
                // set it as a main and then set index for nested stack
                rootIndex = tabRouteNames.indexOf(MAIN_SCREEN_NAME);
                stackIndex = 1;
                // history is already set
            } else if (initialRouteName) {
                // nothing was found in known routes
                // TODO: Maybe it's a good place to redirect to 404
                // tring to find initial route
                if (tabRouteNames.includes(initialRouteName)) {
                    rootIndex = tabRouteNames.indexOf(initialRouteName);
                    history = [initialRouteName];
                } else {
                    // it's a route for stack
                    rootIndex = tabRouteNames.indexOf(MAIN_SCREEN_NAME);
                    stackIndex = 1;
                    // history is already set
                }
            } else {
                // at last if we found nothing at all, trying to set the main
                rootIndex = tabRouteNames.indexOf(MAIN_SCREEN_NAME);
                // history is already set
            }
        }

        const routes = tabRouteNames.map(name => {
            const route = partialState.routes?.find(r => r.name === name);
            if (name === MAIN_SCREEN_NAME) {
                const mainStackRouteNames = [MAIN_SCREEN_NAME, ...stackRouteNames];
                const mainStackRoutes = [
                    {
                        name: MAIN_SCREEN_NAME,
                        key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
                        params: routeParamList[MAIN_SCREEN_NAME],
                    },
                ];
                if (activeRouteName != null && stackIndex > 0) {
                    const activeRoute = partialState.routes?.find(r => r.name === activeRouteName);
                    mainStackRoutes.push({
                        ...activeRoute,
                        name: activeRouteName,
                        key: `${activeRouteName}-${nanoid()}`,
                        params:
                            routeParamList[activeRouteName] != null
                                ? { ...routeParamList[activeRouteName], ...route?.params }
                                : route?.params,
                    });
                }
                return {
                    name: MAIN_SCREEN_NAME,
                    key: `${name}-${nanoid()}`,
                    params: routeParamList[name],
                    state: {
                        stale: false,
                        type: 'stack',
                        key: `stack-${nanoid()}`,
                        index: stackIndex,
                        routeNames: mainStackRouteNames,
                        routes: mainStackRoutes,
                    },
                };
            }
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

        return {
            key: `split-${nanoid()}`,
            index: rootIndex,
            routeNames,
            tabRouteNames,
            stackRouteNames,
            stale: false,
            type: 'split',
            isSplitted,
            history,
            // @ts-ignore
            routes,
        };
    }

    getStateForAction(
        state: SplitNavigationState<ParamList>,
        action: CommonNavigationAction | SplitActionType,
        options: RouterConfigOptions,
    ): SplitNavigationState<ParamList> | null {
        if (action.type === 'RESET_TO_INITIAL') {
            // TODO
            return state;
        }
        if (action.type === 'GO_BACK') {
            // TODO
            return state;
        }
        if (action.type === 'NAVIGATE') {
            const { name } = action.payload;
            // TODO: should we handle a key?
            if (name == null) {
                return null;
            }
            if (state.tabRouteNames.includes(name)) {
                // In shrinked mode need to apply simple tab navigation
                // only for routes that are in the bar
                const index = state.tabRouteNames.indexOf(name);
                return applyTabNavigateActionToState(state, action, options, index);
            }
            // For stack routes in shrinked mode we have to call
            // stack router method on nested navigation in the main route
            return {
                ...state,
                // @ts-ignore
                routes: state.routes.map(route => {
                    if (route.name !== MAIN_SCREEN_NAME) {
                        return route;
                    }
                    if (route.state == null) {
                        return route;
                    }
                    return {
                        ...route,
                        state: this.stackRouter.getStateForAction(
                            route.state as any,
                            action,
                            options,
                        ),
                    };
                }),
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
        getRehydratedState(state, options): SplitNavigationState {
            const isStale = state.stale;

            if (isStale === false) {
                return state;
            }

            return (isSplitted ? unfoldedRouter : foldedRouter).getRehydratedState(state, options);
        },

        // TODO
        getStateForRouteNamesChange(state /* , options */) {
            // const newState: SplitNavigationState = isSplitted
            //     ? (tabRouter.getStateForRouteNamesChange(state as any, options) as any)
            //     : stackRouter.getStateForRouteNamesChange(state as any, options);

            // Object.assign(newState, { type: router.type, isSplitted });
            return state;
        },

        // TODO
        getStateForRouteFocus(state /* , key */) {
            // const newState: SplitNavigationState = isSplitted
            //     ? (tabRouter.getStateForRouteFocus(state as any, key) as any)
            //     : stackRouter.getStateForRouteFocus(state as any, key);

            // Object.assign(newState, { type: router.type, isSplitted });
            return state;
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
                    return fold(state);
                }
                return unfold(state);
            }
            return (state.isSplitted ? unfoldedRouter : foldedRouter).getStateForAction(
                state,
                action,
                options,
            );
        },

        shouldActionChangeFocus(/* action */) {
            // TODO
            // return tabRouter.shouldActionChangeFocus(action);
            return false;
        },
    };

    return router;
}

// splitted=true
// {
//     stale: false,
//     type: 'split',
//     key: `split-${nanoid()}`,
//     index: 0, // initial
//     routeNames: ['main', 'buttons', 'carousel'],
//     // history,
//     routes: [
//         {
//             key: `main-${nanoid()}`,
//             // name,
//             // params: routeParamList[name],
//         },
//         // for stack
//         {
//             key: `buttons-${nanoid()}`,
//             // name,
//             // params: routeParamList[name],
//         },
//         // for tab
//         {
//             key: `carousel-${nanoid()}`,
//             // name,
//             // params: routeParamList[name],
//         },
//     ],
// }

// splitted=false
// {
//     stale: false,
//     type: 'split',
//     key: `split-${nanoid()}`,
//     index: 0, // initial
//     routeNames: ['main', 'carousel'],
//     // history,
//     routes: [
//         // main
//         {
//             key: `main-${nanoid()}`,
//             // name,
//             // params: routeParamList[name],
//             state: {
//                 stale: false,
//                 type: 'stack',
//                 key: `stack-${nanoid()}`,
//                 index: 0,
//                 routeNames: ['main', 'buttons'],
//                 routes: [
//                     {
//                         key: `main-${nanoid()}`,
//                         // name,
//                         // params: routeParamList[name],
//                     },
//                     {
//                         key: `buttons-${nanoid()}`,
//                         // name,
//                         // params: routeParamList[name],
//                     },
//                 ],
//             }
//         },
//         // for tab
//         {
//             key: `carousel-${nanoid()}`,
//             // name,
//             // params: routeParamList[name],
//         },
//     ],
// }
