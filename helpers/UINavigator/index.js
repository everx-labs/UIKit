// @flow

import type { ReactNavigation } from '../../components/UINavigationBar';

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
