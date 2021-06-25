import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
    useNavigationBuilder,
    createNavigatorFactory,
    StackRouter,
    StackRouterOptions,
    StackActionHelpers,
    StackActions,
    EventArg,
    Descriptor,
    RouteProp,
    NavigationProp,
} from '@react-navigation/native';
import type {
    StackNavigationState,
    ParamListBase,
} from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';
import { StackView, TransitionPresets } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';
import type { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    ColorVariants,
    UIBackgroundView,
    PortalManager,
} from '@tonlabs/uikit.hydrogen';

import {
    UILargeTitleHeader,
    UILargeTitleHeaderProps,
} from '../UILargeTitleHeader';
import { NestedInModalContext } from '../ModalNavigator/createModalNavigator';
import { UIStackNavigationBar } from '../UIStackNavigationBar';
import StaticContainer from './StaticContainer';

type StackDescriptor = Descriptor<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Record<string, object | undefined>,
    string,
    StackNavigationState<ParamListBase>,
    StackNavigationOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {}
>;

const DescriptorsContext = React.createContext<Record<string, StackDescriptor>>(
    {},
);

export type StackNavigationOptions = Omit<
    UILargeTitleHeaderProps,
    'children'
> & {
    /**
     * A string or ReactNode to render in large title header
     *
     * `title` property is used as a fallback
     */
    headerLargeTitle?: React.ReactNode | string;
    /**
     * Boolean to prefer large title header (like in iOS setting).
     * For large title to collapse on scroll, the content of the screen
     * should be wrapped in a scrollable view such as `ScrollView` or `FlatList`
     * from our package.
     */
    useHeaderLargeTitle?: boolean;
    /**
     * Whether to show header or not
     *
     * Defaults to true
     *
     * P.S. Basically it's the same options as [`headerShown`](https://github.com/software-mansion/react-native-screens/blob/master/createNativeStackNavigator/README.md#headershown).
     *      Unfortunatelly we can't name it the same,
     *      because we're already using it to prevent drawing of
     *      original header in underlying libraries.
     */
    headerVisible?: boolean;
    /**
     * Background color for the whole screen
     */
    backgroundColor?: ColorVariants;
};

function ScreenWithHeaderContent({
    descriptor,
    children,
    compareProps,
}: {
    descriptor: StackDescriptor;
    children: React.ReactNode;
    compareProps: any;
}) {
    const { top } = useSafeAreaInsets();
    const closeModal = React.useContext(NestedInModalContext);

    if (descriptor.options.headerVisible === false) {
        return (
            <UIBackgroundView
                color={
                    descriptor.options.backgroundColor ||
                    ColorVariants.BackgroundPrimary
                }
                style={styles.screenContainer}
            >
                <StaticContainer {...compareProps}>{children}</StaticContainer>
            </UIBackgroundView>
        );
    }

    return (
        <UIBackgroundView
            color={
                descriptor.options.backgroundColor ||
                ColorVariants.BackgroundPrimary
            }
            style={[
                styles.screenContainer,
                closeModal == null
                    ? {
                          paddingTop: top,
                      }
                    : null,
            ]}
        >
            {descriptor.options.useHeaderLargeTitle ? (
                <PortalManager id="scene">
                    <UILargeTitleHeader
                        testID={descriptor.options.testID}
                        title={descriptor.options.title}
                        headerLargeTitle={descriptor.options.headerLargeTitle}
                        caption={descriptor.options.caption}
                        onTitlePress={descriptor.options.onTitlePress}
                        onHeaderLargeTitlePress={
                            descriptor.options.onHeaderLargeTitlePress
                        }
                        headerLeft={descriptor.options.headerLeft}
                        headerLeftItems={descriptor.options.headerLeftItems}
                        headerBackButton={descriptor.options.headerBackButton}
                        headerRight={descriptor.options.headerRight}
                        headerRightItems={descriptor.options.headerRightItems}
                    >
                        <StaticContainer {...compareProps}>
                            {children}
                        </StaticContainer>
                    </UILargeTitleHeader>
                </PortalManager>
            ) : (
                <PortalManager id="scene">
                    <UIStackNavigationBar
                        testID={descriptor.options.testID}
                        title={descriptor.options.title}
                        caption={descriptor.options.caption}
                        onTitlePress={descriptor.options.onTitlePress}
                        headerLeft={descriptor.options.headerLeft}
                        headerLeftItems={descriptor.options.headerLeftItems}
                        headerBackButton={descriptor.options.headerBackButton}
                        headerRight={descriptor.options.headerRight}
                        headerRightItems={descriptor.options.headerRightItems}
                    />
                    <StaticContainer {...compareProps}>
                        {children}
                    </StaticContainer>
                </PortalManager>
            )}
        </UIBackgroundView>
    );
}

function wrapScreenComponentWithHeader(
    ScreenComponent: React.ComponentType<any>,
) {
    function ScreenWithHeader({
        navigation,
        route,
    }: {
        navigation: NavigationProp<
            ParamListBase,
            string,
            StackNavigationState<ParamListBase>
        >;
        route: RouteProp<ParamListBase, string>;
    }) {
        const descriptors = React.useContext(DescriptorsContext);
        const descriptor = descriptors[route.key];

        if (descriptor == null) {
            return null;
        }

        return (
            <ScreenWithHeaderContent
                descriptor={descriptor}
                compareProps={{
                    name: route.name,
                    render: ScreenComponent,
                    navigation,
                    route,
                    descriptor,
                }}
            >
                <ScreenComponent navigation={navigation} route={route} />
            </ScreenWithHeaderContent>
        );
    }

    return ScreenWithHeader;
}

function wrapScreenRenderPropWithHeader(
    screenRenderProp: ({
        navigation,
        route,
    }: {
        navigation: NavigationProp<
            ParamListBase,
            string,
            StackNavigationState<ParamListBase>
        >;
        route: RouteProp<ParamListBase, string>;
    }) => React.ReactNode,
) {
    function ScreenWithHeader({
        navigation,
        route,
    }: {
        navigation: NavigationProp<
            ParamListBase,
            string,
            StackNavigationState<ParamListBase>
        >;
        route: RouteProp<ParamListBase, string>;
    }) {
        const descriptors = React.useContext(DescriptorsContext);
        const descriptor = descriptors[route.key];

        if (descriptor == null) {
            return null;
        }

        return (
            <ScreenWithHeaderContent
                descriptor={descriptor}
                compareProps={{
                    name: route.name,
                    render: screenRenderProp,
                    navigation,
                    route,
                    descriptor,
                }}
            >
                {screenRenderProp({ navigation, route })}
            </ScreenWithHeaderContent>
        );
    }

    return ScreenWithHeader;
}

function wrapScreensWithHeader(children: React.ReactNode) {
    const screens = React.Children.toArray(children).reduce<React.ReactNode[]>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === React.Fragment) {
                    acc.push(...wrapScreensWithHeader(child.props.children));

                    return acc;
                }

                if (child.props && 'component' in child.props) {
                    acc.push(
                        React.cloneElement(child, {
                            ...child.props,
                            component: wrapScreenComponentWithHeader(
                                child.props.component,
                            ),
                        }),
                    );
                    return acc;
                }

                if (child.props && 'children' in child.props) {
                    acc.push(
                        React.cloneElement(child, {
                            ...child.props,
                            component: wrapScreenRenderPropWithHeader(
                                child.props.children,
                            ),
                            children: null,
                        }),
                    );
                    return acc;
                }
            }
            return acc;
        },
        [],
    );

    return screens;
}

function filterDescriptorOptionsForOriginalImplementation(
    descriptors: Record<string, StackDescriptor>,
) {
    return Object.keys(descriptors).reduce<Record<string, any>>((acc, key) => {
        const originalDescriptor = descriptors[key];

        const {
            headerShown,
            stackAnimation,
        } = originalDescriptor.options as any;

        acc[key] = {
            ...originalDescriptor,
            options: {
                headerShown,
                stackAnimation,
            },
        };

        return acc;
    }, {});
}

type SurfSplitNavigatorProps = {
    children?: React.ReactNode;
    initialRouteName: string;
    screenOptions: StackRouterOptions;
};

function shouldUpdateScreens(
    children: React.ReactNode,
    prevChildren: React.ReactNode,
) {
    const prevScreens = React.Children.toArray(prevChildren);
    const currentScreens = React.Children.toArray(children);

    if (prevScreens.length !== currentScreens.length) {
        return true;
    }

    for (let i = 0; i < currentScreens.length; i += 1) {
        const prevScreen = prevScreens[i];
        const currentScreen = currentScreens[i];

        if (
            React.isValidElement(prevScreen) &&
            React.isValidElement(currentScreen)
        ) {
            if (currentScreen.type === React.Fragment) {
                if (
                    shouldUpdateScreens(
                        currentScreen.props.children,
                        prevScreen.props.children,
                    )
                ) {
                    return true;
                }
                continue;
            }

            if (currentScreen.props && 'component' in currentScreen.props) {
                if (
                    currentScreen.props.component !== prevScreen.props.component
                ) {
                    return true;
                }
                continue;
            }

            if (currentScreen.props && 'getComponent' in currentScreen.props) {
                if (
                    currentScreen.props.getComponent !==
                    prevScreen.props.getComponent
                ) {
                    return true;
                }
                continue;
            }

            if (currentScreen.props && 'children' in currentScreen.props) {
                if (
                    currentScreen.props.children !== prevScreen.props.children
                ) {
                    return true;
                }
                continue;
            }
        }
    }

    return false;
}

export const StackNavigator = ({
    children,
    initialRouteName,
    screenOptions,
}: SurfSplitNavigatorProps) => {
    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const prevChildren = React.useRef<React.ReactNode>(null);
    const wrappedChildren = React.useRef<React.ReactNode>(null);

    if (
        prevChildren.current == null ||
        shouldUpdateScreens(children, prevChildren.current)
    ) {
        prevChildren.current = children;
        wrappedChildren.current = wrapScreensWithHeader(children);
    }

    const { state, navigation, descriptors } = useNavigationBuilder<
        StackNavigationState<ParamListBase>,
        StackRouterOptions,
        StackActionHelpers<ParamListBase>,
        StackNavigationOptions,
        StackNavigationEventMap
    >(StackRouter, {
        children: wrappedChildren.current,
        initialRouteName,
        screenOptions: {
            ...screenOptions,
            // @ts-ignore
            headerShown: false,
            ...(doesSupportNative
                ? Platform.select({
                      android: {
                          stackAnimation: 'slide_from_right',
                      },
                      default: null,
                  })
                : {
                      ...TransitionPresets.SlideFromRightIOS,
                      animationEnabled: true,
                  }),
        },
    });

    React.useEffect(
        () =>
            navigation.addListener?.('tabPress', (e) => {
                const isFocused = navigation.isFocused();

                // Run the operation in the next frame so we're sure all listeners have been run
                // This is necessary to know if preventDefault() has been called
                requestAnimationFrame(() => {
                    if (
                        state.index > 0 &&
                        isFocused &&
                        !(e as EventArg<'tabPress', true>).defaultPrevented
                    ) {
                        // When user taps on already focused tab and we're inside the tab,
                        // reset the stack to replicate native behaviour
                        navigation.dispatch({
                            ...StackActions.popToTop(),
                            target: state.key,
                        });
                    }
                });
            }),
        [navigation, state.index, state.key],
    );

    if (doesSupportNative) {
        const descriptorsFiltered = filterDescriptorOptionsForOriginalImplementation(
            descriptors,
        );
        return (
            <DescriptorsContext.Provider value={descriptors}>
                <NativeStackView
                    state={state}
                    navigation={navigation}
                    descriptors={descriptorsFiltered}
                />
            </DescriptorsContext.Provider>
        );
    }
    return (
        <DescriptorsContext.Provider value={descriptors}>
            <StackView
                headerMode="none"
                state={state}
                navigation={navigation}
                // @ts-ignore `title` types are incompatible
                descriptors={descriptors}
            />
        </DescriptorsContext.Provider>
    );
};

export const createStackNavigator = createNavigatorFactory(StackNavigator);

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
});
