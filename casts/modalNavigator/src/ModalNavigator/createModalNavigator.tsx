import * as React from 'react';
import { Keyboard } from 'react-native';
import type { NavigationProp } from '@react-navigation/core';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
} from '@react-navigation/native';
import type { ParamListBase, EventMapBase } from '@react-navigation/native';

import { PortalManager } from '@tonlabs/uikit.layout';
import { UIModalSheet } from '@tonlabs/uikit.popups';

import { ModalRouter, ModalActions, ModalActionHelpers } from './ModalRouter';
import type { ModalNavigationState } from './ModalRouter';
import type {
    ModalNavigatorScreenProps,
    ModalNavigatorProps,
    ModalRouterOptions,
    ModalScreenOptions,
} from './types';

function ModalScreen<ParamList extends ParamListBase = ParamListBase>({
    route,
    descriptor,
    maxMobileWidth,
}: ModalNavigatorScreenProps<ParamList>) {
    const { name } = route;
    const { onClose } = descriptor.options;

    const hide = React.useCallback(() => {
        Keyboard.dismiss();
        descriptor.navigation.dispatch(ModalActions.hide(name));
        onClose?.();
    }, [onClose, descriptor.navigation, name]);

    return (
        <UIModalSheet
            forId="modal"
            visible={route.visible}
            onClose={hide}
            maxMobileWidth={maxMobileWidth}
        >
            {descriptor.render()}
        </UIModalSheet>
    );
}

const ModalNavigator = ({ children, maxMobileWidth, screenOptions }: ModalNavigatorProps) => {
    const { state, navigation, descriptors } = useNavigationBuilder<
        ModalNavigationState,
        ModalRouterOptions,
        // @ts-ignore
        ModalActionHelpers,
        ModalScreenOptions,
        NavigationProp<ParamListBase>
    >(ModalRouter, {
        children,
        childrenForConfigs: children,
        screenOptions,
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
                        />
                    );
                })}
            </NavigationHelpersContext.Provider>
        </PortalManager>
    );
};

export const createModalNavigator = createNavigatorFactory<
    ModalNavigationState,
    ModalScreenOptions,
    EventMapBase,
    React.ComponentType<any>
>(ModalNavigator);
