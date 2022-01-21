import * as React from 'react';
import { useNavigation } from '@react-navigation/core';

import { ColorVariants } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { NestedInModalContext } from '@tonlabs/uicast.modal-navigator';

import { HeaderItem, UIHeaderItems } from './UIHeaderItems';

type NavigationState = ReturnType<ReturnType<typeof useNavigation>['dangerouslyGetState']>;

function findIfCanGoBackForStack(state: NavigationState, parentState?: NavigationState) {
    if (state == null) {
        return false;
    }

    if (state.type === 'split') {
        const { nestedStack, isSplitted, history } = state as any as {
            nestedStack?: number[];
            isSplitted: boolean;
            history: number[];
        };

        if (isSplitted) {
            return history.length > 1;
        }

        return nestedStack != null && nestedStack.length > 1;
    }

    if (state.type !== 'stack') {
        return false;
    }

    if (state.routes.length > 1) {
        return true;
    }

    // Here is the thing:
    // So, imagine a situation when we have
    // split navigator and for a screen that should act
    // as a tab we have a nested stack navigation in it.
    // `react-navigation` provides very basic way to check
    // if it can goes back in the current screen: `navigation.canGoBack()`.
    // What it does, is calls `GO_BACK` action on a router
    // and if it returns a state, that it can go back.
    // So, in our case stack router on initial screen
    // return empty state. In that case `react-navigation`
    // calls parent router with the same action, until it reaches the end.
    // But split router will return state as it handles navigation
    // for tabs (for example for hardware buttons on Android or back button in web)
    // to switch between them.
    // At the same time it's weird to see a back button on a nav bar, that
    // will handle tab navigation.
    // So what we do here, is a check if parent navigation
    // is split one, and if it is, then check if current active
    // split route is a tab one.
    // Then by assumption that the only scenario when it might happen
    // is the one described above, just doesn't render the back button.
    if (parentState != null && parentState.type === 'split') {
        const { index, nestedStack } = parentState as any as {
            index: number;
            nestedStack?: number[];
        };
        if (
            // It's stack screen in stack context
            nestedStack &&
            nestedStack.indexOf(index) !== -1
        ) {
            return true;
        }
        // It's a stack in tab screen
        return false;
    }

    return false;
}

function useIfCanGoBackForStack(navigation: ReturnType<typeof useNavigation>): boolean {
    const currentStateRef = React.useRef(navigation.dangerouslyGetState());
    const parentStateRef = React.useRef(navigation.dangerouslyGetParent()?.dangerouslyGetState());
    const [canGoBack, setCanGoBack] = React.useState(
        findIfCanGoBackForStack(currentStateRef.current, parentStateRef.current),
    );
    const canGoBackRef = React.useRef(canGoBack);
    const currentRouteIndex = React.useRef(currentStateRef.current.index).current;

    React.useEffect(() => {
        const disposeCurrent = navigation.addListener('state', event => {
            const { index } = event.data.state;

            if (currentRouteIndex !== index) {
                return;
            }

            if (event.data.state === currentStateRef.current) {
                return;
            }

            currentStateRef.current = event.data.state;

            const canGoBackForStack = findIfCanGoBackForStack(
                event.data.state,
                parentStateRef.current,
            );
            if (canGoBackForStack !== canGoBackRef.current) {
                setCanGoBack(canGoBackForStack);
                canGoBackRef.current = canGoBackForStack;
            }
        });
        const parent = navigation.dangerouslyGetParent();
        const disposeParent = parent?.addListener('state', event => {
            if (event.data.state === parentStateRef.current) {
                return;
            }
            parentStateRef.current = event.data.state;
            const canGoBackForStack = findIfCanGoBackForStack(
                currentStateRef.current,
                event.data.state,
            );
            if (canGoBackForStack !== canGoBackRef.current) {
                setCanGoBack(canGoBackForStack);
                canGoBackRef.current = canGoBackForStack;
            }
        });

        return () => {
            disposeCurrent();
            disposeParent?.();
        };
    }, [currentRouteIndex, navigation]);

    return canGoBack;
}

function HeaderLeftItems({
    navigation,
    headerBackButton,
    shouldShowCloseButton,
    closeModal,
}: {
    navigation: ReturnType<typeof useNavigation>;
    headerBackButton: HeaderItem | undefined;
    shouldShowCloseButton: boolean;
    closeModal: (() => void) | null;
}) {
    const canGoBackIfStack = useIfCanGoBackForStack(navigation);

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
        return null;
    }

    return (
        <HeaderLeftItems
            navigation={navigation}
            headerBackButton={headerBackButton}
            shouldShowCloseButton={shouldShowCloseButton}
            closeModal={closeModal}
        />
    );
}
