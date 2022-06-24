import * as React from 'react';
import { Keyboard } from 'react-native';
import type { NavigationProp, RouteProp } from '@react-navigation/core';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
} from '@react-navigation/native';
import type { Descriptor, ParamListBase, EventMapBase } from '@react-navigation/native';

import { PortalManager } from '@tonlabs/uikit.layout';
import { UIModalSheet } from '@tonlabs/uikit.popups';

import { ModalRouter, ModalActions, ModalActionHelpers } from './ModalRouter';
import type { ModalNavigationState, ModalNavigationRoute } from './ModalRouter';

function ModalScreen<ParamList extends ParamListBase = ParamListBase>({
    route,
    descriptor,
    maxMobileWidth,
    fixedMobileContainerHeight,
}: {
    route: ModalNavigationRoute<ParamList, keyof ParamList>;
    descriptor: Descriptor<ParamListBase>;
    maxMobileWidth: number;
    fixedMobileContainerHeight?: number;
}) {
    const { name } = route;

    const hide = React.useCallback(() => {
        Keyboard.dismiss();
        descriptor.navigation.dispatch(ModalActions.hide(name));
    }, [name, descriptor.navigation]);

    return (
        <UIModalSheet
            forId="modal"
            visible={route.visible}
            onClose={hide}
            maxMobileWidth={maxMobileWidth}
            fixedMobileContainerHeight={fixedMobileContainerHeight}
        >
            {descriptor.render()}
        </UIModalSheet>
    );
}

const ModalNavigator = ({
    children,
    maxMobileWidth,
    fixedMobileContainerHeight,
}: {
    children: React.ReactNode;
    maxMobileWidth: number;
    fixedMobileContainerHeight?: number;
}) => {
    const { state, navigation, descriptors } = useNavigationBuilder(ModalRouter, {
        children,
        childrenForConfigs: children,
    });

    return (
        <PortalManager id="modal">
            <NavigationHelpersContext.Provider value={navigation}>
                {state.routes.map<React.ReactNode>(route => {
                    const descriptor = descriptors[route.key];

                    if (descriptor == null) {
                        return null;
                    }

                    return (
                        <ModalScreen
                            key={route.key}
                            route={route}
                            descriptor={descriptor}
                            maxMobileWidth={maxMobileWidth}
                            fixedMobileContainerHeight={fixedMobileContainerHeight}
                        />
                    );
                })}
            </NavigationHelpersContext.Provider>
        </PortalManager>
    );
};

type ModalScreenOptions = {
    defaultProps: Record<string, unknown>;
};

export type ModalNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = NavigationProp<ParamList, RouteName, ModalNavigationState<ParamList>, /* TODO */ any> &
    ModalActionHelpers;
export type ModalScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = {
    navigation: ModalNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
};

export const createModalNavigator = createNavigatorFactory<
    ModalNavigationState,
    ModalScreenOptions,
    EventMapBase,
    React.ComponentType<any>
>(ModalNavigator);
