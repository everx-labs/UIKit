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

export type SplitRouterOptions<ParamList extends ParamListBase = ParamListBase> =
    DefaultRouterOptions<Extract<keyof ParamList, string>> & {
        isSplitted: boolean;
        tabRouteNames: string[];
        stackRouteNames: string[];
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

// export type SplitNavigationState<ParamList extends ParamListBase = ParamListBase> = (
//     | StackLikeSplitNavigationState<ParamList>
//     | TabLikeSplitNavigationState<ParamList>
// ) & { isSplitted?: boolean };

type MainRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = Omit<
    Route<Extract<RouteName, string>, ParamList[RouteName]>,
    'name'
> & {
    name: typeof MAIN_SCREEN_NAME;
    state: StackNavigationState<ParamList>;
};
type NavigationRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = Route<
    Extract<RouteName, string>,
    ParamList[RouteName]
> & {
    state?: NavigationState | PartialState<NavigationState>;
};

type SplitNavigationState<ParamList extends ParamListBase = ParamListBase> = {
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

function splittedToShrinked<ParamList extends ParamListBase>(
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
        routes: state.tabRouteNames.map(name => {
            if (name === MAIN_SCREEN_NAME) {
                const mainStackRouteNames = [MAIN_SCREEN_NAME, ...state.stackRouteNames];
                const mainStackRoutes: {
                    name: string;
                    key: string;
                    params: ParamList;
                    state?: StackNavigationState<ParamList>;
                }[] = [
                    {
                        name: MAIN_SCREEN_NAME,
                        key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
                        params: mainRoute.params,
                    },
                ];
                const hasNestedActiveRoute =
                    state.index !== mainRouteIndex && currentRouteIsForStack;
                if (hasNestedActiveRoute) {
                    mainStackRoutes.push({
                        name: currentRouteName,
                        key: `${currentRouteName}-${nanoid()}`,
                        params: currentRoute.params,
                        state: currentRoute.state,
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

function shrinkedToSplitted<ParamList extends ParamListBase>(
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
            if (name === MAIN_SCREEN_NAME) {
                return {
                    name: MAIN_SCREEN_NAME,
                    key: `${name}-${nanoid()}`,
                    params: mainRoute.params,
                    state: {
                        stale: false,
                        type: 'stack',
                        key: `stack-${nanoid()}`,
                        index: 0,
                        routeNames: [MAIN_SCREEN_NAME],
                        routes: mainRoute.state.routes.slice(0, 1),
                    },
                };
            }
            let routeForNameIndex = state.tabRouteNames.indexOf(name);
            let routeForName: typeof state.routes[0] | null = null;
            if (routeForNameIndex > -1) {
                routeForName = state.routes[routeForNameIndex];
            } else {
                routeForNameIndex = mainRoute.state.routeNames.indexOf(name);
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

export function SplitRouter(routerOptions: SplitRouterOptions) {
    // eslint-disable-next-line prefer-const
    let { isSplitted, initialRouteName, tabRouteNames, stackRouteNames, ...tabOptions } =
        routerOptions;
    const { ...stackOptions } = tabOptions;
    const tabRouter = TabRouter({
        ...tabOptions,
        initialRouteName,
    });
    const stackRouter = StackRouter({
        // TODO: what options?
        ...stackOptions,
        // TODO: I'm not sure that it should be main, better to check if initialRouteName
        // is in stack related routes and get it
        initialRouteName: MAIN_SCREEN_NAME,
    });
    let isInitialized = false;
    const router: Router<SplitNavigationState, CommonNavigationAction | SplitActionType> = {
        ...BaseRouter,

        // Every router in react-navigation should have a type
        // and it should be consistent between re-renders
        // or library will try to re-initialize the state
        // every time
        type: 'split',

        getInitialState({
            routeNames,
            routeParamList,
            routeGetIdList,
        }: RouterConfigOptions): SplitNavigationState {
            /**
             * When we in splitted state all routes except `main`
             * are treated as tabs (They're rendered on the right side).
             * `main` is kind of special, as it renders on the left column.
             */
            if (isSplitted) {
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
                    history: initialRouteName != null ? [initialRouteName] : [routeNames[0]],
                    routes: routeNames.map(name => {
                        if (name === MAIN_SCREEN_NAME) {
                            return {
                                name: MAIN_SCREEN_NAME,
                                key: `${MAIN_SCREEN_NAME}-${nanoid()}`,
                                params: routeParamList[MAIN_SCREEN_NAME],
                                /**
                                 * We have to create a stack navigation for main screen
                                 * to be able to use large header there with regular `navigationOptions`
                                 */
                                state: stackRouter.getInitialState({
                                    routeNames: [MAIN_SCREEN_NAME],
                                    routeParamList,
                                    routeGetIdList,
                                }),
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

            /**
             * Things got more interesting here, because we have two types of routes:
             * - Routes that have to be on tabs section,
             *   they have icon in the tab bar,
             *   and are toggled with fade in/out animation;
             * - Routes that have to be in stack navigation.
             *   It's the ones that haven't found a place
             *   in tab bar, therefore have to be animated
             *   from main screen with stack navigation.
             */

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
                routes: tabRouteNames
                    // TODO: it's seems to be a more stable solution
                    // But on the other hand for performance reason better to avoid it.
                    // For now I can't imagine a case when it might break sth.
                    // routeNames.filter(route => tabRouteNames.includes(route))
                    .map(name => {
                        if (name === MAIN_SCREEN_NAME) {
                            /**
                             * Second challenge is to create a correct state
                             * for nested stack navigation here
                             */
                            // TODO: it's seems to be a more stable solution
                            // But on the other hand for performance reason better to avoid it.
                            // For now I can't imagine a case when it might break sth.
                            // routeNames.filter(route => stackRouteNames.includes(route))
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
        },

        // TODO: I forgot what it's for :thinking:
        // probably to handle initial state from linking
        getRehydratedState(state): SplitNavigationState {
            const isStale = state.stale;

            if (isStale === false) {
                return state as SplitNavigationState;
            }

            return state as any;
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
                    return shrinkedToSplitted(state);
                }
                return splittedToShrinked(state);
            }
            if (action.type === 'RESET_TO_INITIAL') {
                // TODO
                return state;
            }
            if (action.type === 'GO_BACK') {
                // TODO
                return state;
            }
            if (action.type === 'NAVIGATE') {
                const { name, params } = action.payload;
                // TODO: should we handle a key?
                if (name == null) {
                    return null;
                }
                if (state.isSplitted) {
                    // In splitted mode we always should apply tab navigation
                    const index = state.routeNames.indexOf(name);
                    return applyNavigateActionToState(state, action, options, index);
                }
                if (state.tabRouteNames.includes(name)) {
                    // In shrinked mode need to apply simple tab navigation
                    // only for routes that are in the bar
                    const index = state.tabRouteNames.indexOf(name);
                    return applyNavigateActionToState(state, action, options, index);
                }
                // For stack routes in shrinked mode we have to call
                // stack router method on nested navigation in the main route

                // TODO: check that it should applied first!
                return {
                    ...state,
                    routes: state.routes.map(route => {
                        if (route.name !== MAIN_SCREEN_NAME) {
                            return route;
                        }
                        if (route.state == null) {
                            return route;
                        }
                        return {
                            ...route,
                            state: stackRouter.getStateForAction(route.state, action, options),
                        };
                    }),
                };
            }
            // TODO: left here!!!!!!!!

            // TODO: there was sth about history, need to check it
            return null;
        },

        shouldActionChangeFocus(action) {
            return tabRouter.shouldActionChangeFocus(action);
        },
    };

    return router;
}

function applyNavigateActionToState(
    state: SplitNavigationState,
    action: CommonNavigationAction,
    options: RouterConfigOptions,
    index: number,
) {
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
