import * as React from 'react';
import { Keyboard } from 'react-native';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
} from '@react-navigation/native';
import type { Descriptor, ParamListBase, EventMapBase } from '@react-navigation/native';

import { UIModalSheet } from '@tonlabs/uikit.popups';

import { ModalRouter, ModalActions } from './ModalRouter';
import type { ModalNavigationState, ModalNavigationRoute } from './ModalRouter';

export const NestedInModalContext = React.createContext<(() => void) | null>(null);

export const NestedInDismissibleModalContext = React.createContext<boolean>(false);

function ModalScreen<ParamList extends ParamListBase = ParamListBase>({
    route,
    descriptor,
    maxMobileWidth,
}: {
    route: ModalNavigationRoute<ParamList, keyof ParamList>;
    descriptor: Descriptor<ParamListBase>;
    maxMobileWidth: number;
}) {
    const { name } = route;

    const hide = React.useCallback(() => {
        Keyboard.dismiss();
        descriptor.navigation.dispatch(ModalActions.hide(name));
    }, [name, descriptor.navigation]);

    return (
        <UIModalSheet visible={route.visible} onClose={hide} maxMobileWidth={maxMobileWidth}>
            <NestedInModalContext.Provider value={hide}>
                {descriptor.render()}
            </NestedInModalContext.Provider>
        </UIModalSheet>
    );
}

const ModalNavigator = ({
    children,
    maxMobileWidth,
}: {
    children: React.ReactNode;
    maxMobileWidth: number;
}) => {
    const { state, navigation, descriptors } = useNavigationBuilder(ModalRouter, {
        children,
        childrenForConfigs: children,
    });

    return (
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
    );
};

type ModalScreenOptions = {
    defaultProps: Record<string, unknown>;
};

export const createModalNavigator = createNavigatorFactory<
    ModalNavigationState,
    ModalScreenOptions,
    EventMapBase,
    React.ComponentType<any>
>(ModalNavigator);
