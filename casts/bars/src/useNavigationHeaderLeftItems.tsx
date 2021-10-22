import * as React from 'react';
import { useNavigation } from '@react-navigation/core';

import { ColorVariants } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { NestedInModalContext } from '@tonlabs/uicast.modal-navigator';

import { HeaderItem, UIHeaderItems } from './UIHeaderItems';

function findIfCanGoBackForStack(navigation: ReturnType<typeof useNavigation>): boolean {
    const state = navigation.dangerouslyGetState();

    if (state == null) {
        return false;
    }

    if (state.type !== 'stack') {
        return false;
    }

    if (state.routes.length > 1) {
        return true;
    }

    // Check that it's nested in another stack
    // that means that we can go back
    const parent = navigation.dangerouslyGetParent();

    if (parent == null) {
        return false;
    }

    const parentState = parent.dangerouslyGetState();

    if (parentState == null) {
        return false;
    }

    return parentState.type === 'stack' || parentState.type === 'split';
}

export function useNavigationHeaderLeftItems(
    headerLeft: (() => React.ReactNode) | undefined,
    headerLeftItems: HeaderItem[] | undefined,
    headerBackButton: HeaderItem | undefined,
    shouldShowCloseButton: boolean = true,
) {
    let navigation: ReturnType<typeof useNavigation> | null = null;
    const closeModal = React.useContext(NestedInModalContext);

    // If it's used not in a navigation context
    // it might throw an error, to prevent a crash trying to catch it
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navigation = useNavigation();
    } catch (err) {
        // no-op
    }

    if (headerLeft != null) {
        return headerLeft();
    }

    if (headerLeftItems != null) {
        return <UIHeaderItems items={headerLeftItems} />;
    }

    if (navigation == null) {
        return;
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
