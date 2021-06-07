import * as React from 'react';
import { useNavigation } from '@react-navigation/core';

import { ColorVariants } from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';

import { HeaderItem, UIHeaderItems } from './UIHeaderItems';
import { NestedInModalContext } from './ModalNavigator/createModalNavigator';

function findIfCanGoBackForStack(
    navigation: ReturnType<typeof useNavigation>,
): boolean {
    const state = navigation.dangerouslyGetState();

    if (state == null) {
        return false;
    }

    const canGoBackIfStack =
        state.type === 'stack' ? state.routes.length > 1 : true;

    if (!canGoBackIfStack) {
        const parent = navigation.dangerouslyGetParent();

        if (parent == null) {
            return false;
        }

        return findIfCanGoBackForStack(parent);
    }

    return true;
}

export function useNavigationHeaderLeftItems(
    headerLeft: (() => React.ReactNode) | undefined,
    headerLeftItems: HeaderItem[] | undefined,
    headerBackButton: HeaderItem | undefined,
    shouldShowCloseButton: boolean = true,
) {
    const navigation = useNavigation();
    const closeModal = React.useContext(NestedInModalContext);

    if (headerLeft != null) {
        return headerLeft();
    }

    if (headerLeftItems != null) {
        return <UIHeaderItems items={headerLeftItems} />;
    }

    const canGoBackIfStack = findIfCanGoBackForStack(navigation);

    if (navigation.canGoBack() && canGoBackIfStack) {
        const defaultBackButton: HeaderItem = {
            testID: 'uinavigation-back-button',
            icon: {
                source: UIAssets.icons.ui.arrowLeftBlack,
            },
            iconTintColor: ColorVariants.IconAccent,
            onPress: navigation.goBack,
        };

        if (headerBackButton != null) {
            return (
                <UIHeaderItems
                    items={[
                        {
                            ...defaultBackButton,
                            ...headerBackButton,
                        },
                    ]}
                />
            );
        }

        return <UIHeaderItems items={[defaultBackButton]} />;
    }

    if (shouldShowCloseButton && closeModal != null) {
        const defaultCloseButton: HeaderItem = {
            testID: 'uinavigation-close-modal-button',
            icon: {
                source: UIAssets.icons.ui.closeBlack,
            },
            iconTintColor: ColorVariants.IconAccent,
            onPress: closeModal,
        };

        if (headerBackButton != null) {
            return (
                <UIHeaderItems
                    items={[
                        {
                            ...defaultCloseButton,
                            ...headerBackButton,
                        },
                    ]}
                />
            );
        }

        return <UIHeaderItems items={[defaultCloseButton]} />;
    }

    return null;
}
