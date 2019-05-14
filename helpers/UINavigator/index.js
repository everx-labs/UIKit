// @flow

import type { ReactNavigation } from '../../components/navigation/UINavigationBar';

export type UINavigationRoute = {
    name: string,
    screen: any,
    path?: string,
    section?: string,
    staticParameters?: {
        section?: string,
        [string]: string,
    },
    dynamicParameters?: {
        [string]: boolean,
    },
}

export type UINavigationPath = {
    name: string,
    staticParameters?: {
        section?: string,
        [string]: string,
    },
    dynamicParameters?: {
        [string]: boolean,
    },
}

export type UINavigationRouting = {
    paths: {
        [string]: UINavigationPath,
    },
    screens: {
        [string]: {
            screen: any,
        },
    },
}

export type NavigationProps = {
    navigation: ReactNavigation,
};

type CreateNavigator = (screens: Object, routeName: string, routeParams?: any) => Object;

/**
 * Reusable navigator instance. Condition of reusable is matching of initialRouteName.
 */
export default class UINavigator {
    /** Roles in master detail relation */
    static Role = {
        Master: 'master',
        Detail: 'detail',
    };

    static createRouting(routes: [UINavigationRoute]): UINavigationRouting {
        const routing: UINavigationRouting = {
            paths: {},
            screens: {},
        };
        routes.forEach((route) => {
            const path: UINavigationPath = {
                name: route.path || route.name,
            };
            if (route.staticParameters) {
                path.staticParameters = route.staticParameters;
            }
            if (route.dynamicParameters) {
                path.dynamicParameters = route.dynamicParameters;
            }
            routing.paths[route.name] = path;
            routing.screens[route.name] = {
                screen: route.screen,
            };
        });
        return routing;
    }

    static section(section: string) {
        return { section };
    }

    createNavigator: CreateNavigator;
    navigator: ?Object;
    initialRouteName: ?string;

    constructor(createNavigator: CreateNavigator) {
        this.createNavigator = createNavigator;
        this.navigator = null;
        this.initialRouteName = null;
    }

    /**
     * Reuse existing instance or create new one depends on matching initialRouteName.
     */
    get(screens: Object, initialRouteName: string, initialRouteParams?: any): Object {
        if (!this.navigator || this.initialRouteName !== initialRouteName) {
            this.initialRouteName = initialRouteName;
            this.navigator = this.createNavigator(screens, initialRouteName, initialRouteParams);
        }
        return this.navigator;
    }
}
