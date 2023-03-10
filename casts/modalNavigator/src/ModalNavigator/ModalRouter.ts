import * as React from 'react';
import { nanoid } from 'nanoid/non-secure';
import {
    BaseRouter,
    CommonNavigationAction,
    NavigationState,
    ParamListBase,
    Router,
    Route,
    PartialState,
} from '@react-navigation/native';
import sortBy from 'lodash/sortBy';

type ModalScreenProps = {
    name: string;
    defaultProps: { [prop: string]: any };
};

const getModalConfigsFromChildren = (children: React.ReactNode): ModalScreenProps[] => {
    const configs = React.Children.toArray(children).reduce<ModalScreenProps[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (child.props.name != null) {
                acc.push({
                    name: child.props.name,
                    defaultProps: child.props.options?.defaultProps,
                });
                return acc;
            }

            if (child.type === React.Fragment) {
                acc.push(...getModalConfigsFromChildren(child.props.children));
                return acc;
            }

            throw new Error(
                `A modal navigator can only contain 'Screen' component as its direct children (found '${
                    // eslint-disable-next-line no-nested-ternary
                    React.isValidElement(child)
                        ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                        : typeof child === 'object'
                        ? JSON.stringify(child)
                        : `'${String(child)}'`
                }')`,
            );
        }
        return acc;
    }, []);

    return configs;
};

type ModalActionType =
    | {
          type: 'SHOW';
          payload: {
              name: string;
              params?: Record<string, unknown>;
          };
      }
    | {
          type: 'HIDE';
          payload: {
              name?: string;
          };
      }
    | {
          type: 'HIDE_ALL';
      };

export const ModalActions = {
    show(name: string, params?: Record<string, unknown>): ModalActionType {
        return {
            type: 'SHOW',
            payload: {
                name,
                params,
            },
        };
    },
    hide(name?: string): ModalActionType {
        return {
            type: 'HIDE',
            payload: {
                name,
            },
        };
    },
    hideAll(): ModalActionType {
        return {
            type: 'HIDE_ALL',
        };
    },
};

export type ModalActionHelpers = Record<string, () => void> & {
    show(name: string, params?: Record<string, unknown>): void;
    hide(name?: string): void;
    hideAll(): void;
};

type ModalRouterOptions = {
    initialRouteName?: string;
    childrenForConfigs: React.ReactNode;
};

export type ModalNavigationRoute<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList,
> = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
    state?: NavigationState | PartialState<NavigationState>;
    order: number;
    visible: boolean;
};

export type ModalNavigationState<ParamList extends ParamListBase = ParamListBase> = {
    stale: false;
    type: string;
    key: string;
    routeNames: string[];
    routes: ModalNavigationRoute<ParamList, keyof ParamList>[];
    index: number;
};

const getRouteWithHighestOrder = <ParamList extends ParamListBase = ParamListBase>(
    routes: ModalNavigationRoute<ParamList, keyof ParamList>[],
) =>
    routes.reduce((acc, route) => {
        if (route.order > acc.order) {
            return route;
        }
        return acc;
    });

export function ModalRouter(routerOptions: ModalRouterOptions) {
    const configs = getModalConfigsFromChildren(routerOptions.childrenForConfigs);
    let orderCounter = 0;
    const router: Router<ModalNavigationState, CommonNavigationAction | ModalActionType> = {
        ...BaseRouter,

        type: 'modals',

        getInitialState({ routeNames, routeParamList }) {
            const routes = routeNames.map(name => ({
                name,
                key: `${name}-${nanoid()}`,
                params: routeParamList[name],
                order: 0,
                visible: false,
            }));

            return {
                stale: false,
                type: router.type,
                key: `${router.type}-${nanoid()}`,
                routeNames,
                routes,
                index: 0,
            };
        },

        getRehydratedState(partialState, { routeNames, routeParamList }) {
            const state = partialState;

            if (state.stale === false) {
                return state;
            }

            const routes = routeNames.map(name => {
                const route = state.routes.find(r => r.name === name);

                let params;

                if (routeParamList[name] !== undefined) {
                    params = {
                        ...routeParamList[name],
                        ...(route ? route.params : undefined),
                    };
                } else if (route) {
                    ({ params } = route);
                }

                return {
                    ...route,
                    name,
                    key:
                        route && route.name === name && route.key
                            ? route.key
                            : `${name}-${nanoid()}`,
                    params,
                    order: 0,
                    visible: false,
                };
            });

            return {
                stale: false,
                type: router.type,
                key: `${router.type}-${nanoid()}`,
                routeNames,
                routes,
                index: 0,
            };
        },

        getStateForRouteNamesChange(state, { routeNames, routeParamList }) {
            const routes = routeNames.map(
                name =>
                    state.routes.find(r => r.name === name) || {
                        name,
                        key: `${name}-${nanoid()}`,
                        params: routeParamList[name],
                        order: 0,
                        visible: false,
                    },
            );

            const activeRoute = state.routes.reduce((acc, route) => {
                if (route.order > acc.order) {
                    return route;
                }
                return acc;
            });

            let index = 0;

            if (activeRoute) {
                index = routes.findIndex(route => route.name === activeRoute.name);
            }

            return {
                ...state,
                routeNames,
                routes,
                index: index === -1 ? 0 : index,
            };
        },

        getStateForRouteFocus(state, key) {
            const index = state.routes.findIndex(r => r.key === key);

            if (index === -1 || index === state.index) {
                return state;
            }

            return {
                ...state,
                index,
            };
        },

        getStateForAction(state, action) {
            switch (action.type) {
                case 'NAVIGATE':
                case 'SHOW': {
                    let modalRouteIndex: number;

                    if (action.type === 'NAVIGATE' && action.payload.key) {
                        modalRouteIndex = state.routes.findIndex(
                            route => route.key === action.payload.key,
                        );
                    } else {
                        modalRouteIndex = state.routes.findIndex(
                            route => route.name === action.payload.name,
                        );
                    }

                    if (modalRouteIndex === -1) {
                        return null;
                    }

                    const modalRoute = state.routes[modalRouteIndex];
                    const modalRouteConfig = configs.find(c => c.name === modalRoute.name);

                    const routes = sortBy(
                        state.routes.map((route, i) => {
                            let order = route.order ?? 0;
                            let { params } = route;

                            if (modalRouteIndex === i) {
                                orderCounter += 1;
                                order = orderCounter;
                                params = {
                                    ...modalRouteConfig?.defaultProps,
                                    ...action.payload.params,
                                };
                            }

                            return {
                                ...route,
                                params,
                                order,
                                visible: order > 0,
                            };
                        }),
                        'order',
                    );

                    return {
                        ...state,
                        routes,
                        index: routes.findIndex(route => route.key === modalRoute.key),
                    };
                }

                case 'HIDE': {
                    let activeRouteIndex = state.index;
                    if (action.payload.name != null) {
                        activeRouteIndex = state.routes.findIndex(
                            route => route.name === action.payload.name,
                        );
                    }

                    if (activeRouteIndex === -1) {
                        return null;
                    }

                    const activeRoute = state.routes[activeRouteIndex];
                    const routes = state.routes.map(route => {
                        if (route.key === activeRoute.key) {
                            return {
                                ...route,
                                order: 0,
                                visible: false,
                            };
                        }
                        return route;
                    });

                    const newActiveModalRoute = getRouteWithHighestOrder(routes);
                    const newIndex =
                        newActiveModalRoute != null
                            ? state.routes.findIndex(r => r.name === newActiveModalRoute.name)
                            : 0;

                    return {
                        ...state,
                        routes,
                        index: newIndex,
                    };
                }

                case 'HIDE_ALL': {
                    const routes = state.routes.map(route => ({
                        ...route,
                        order: 0,
                        visible: false,
                    }));

                    return {
                        ...state,
                        routes,
                        index: 0,
                    };
                }

                case 'GO_BACK': {
                    if (state.index === 0) {
                        // Cannot go back
                        return null;
                    }

                    const activeRoute = getRouteWithHighestOrder(state.routes);
                    if (activeRoute == null) {
                        return null;
                    }

                    const routes = state.routes.map(route => {
                        if (route.key === activeRoute.key) {
                            return {
                                ...route,
                                order: 0,
                                visible: false,
                            };
                        }
                        return route;
                    });

                    const newActiveModalRoute = getRouteWithHighestOrder(routes);
                    const newIndex =
                        newActiveModalRoute != null
                            ? state.routes.findIndex(r => r.name === newActiveModalRoute.name)
                            : 0;

                    return {
                        ...state,
                        routes,
                        index: newIndex,
                    };
                }

                default:
                    return BaseRouter.getStateForAction(state, action);
            }
        },

        shouldActionChangeFocus(action) {
            return action.type === 'NAVIGATE' || action.type === 'SHOW';
        },

        actionCreators: ModalActions,
    };
    return router;
}
