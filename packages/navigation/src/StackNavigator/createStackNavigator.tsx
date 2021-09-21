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
import type { StackNavigationState, ParamListBase } from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';
import { StackView, TransitionPresets } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';
import type { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';

import { UIBackgroundView, PortalManager } from '@tonlabs/uikit.hydrogen';
import { ColorVariants } from '@tonlabs/uikit.themes';

import { UILargeTitleHeader, UILargeTitleHeaderProps } from '../UILargeTitleHeader';
import { UIStackNavigationBar } from '../UIStackNavigationBar';
import { shouldUpdateScreens } from './shouldUpdateScreens';
import { useStackTopInsetStyle } from './useStackTopInsetStyle';

type StackDescriptor = Descriptor<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Record<string, object | undefined>,
    string,
    StackNavigationState<ParamListBase>,
    StackNavigationOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {}
>;

const DescriptorsContext = React.createContext<Record<string, StackDescriptor>>({});

export type StackNavigationOptions = Omit<UILargeTitleHeaderProps, 'children'> & {
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
}: {
    descriptor: StackDescriptor;
    children: React.ReactNode;
}) {
    const topInsetStyle = useStackTopInsetStyle();

    if (descriptor.options.headerVisible === false) {
        return (
            <UIBackgroundView
                color={descriptor.options.backgroundColor || ColorVariants.BackgroundPrimary}
                style={styles.screenContainer}
            >
                <PortalManager id="scene">{children}</PortalManager>
            </UIBackgroundView>
        );
    }

    return (
        <UIBackgroundView
            color={descriptor.options.backgroundColor || ColorVariants.BackgroundPrimary}
            style={[styles.screenContainer, topInsetStyle]}
        >
            {descriptor.options.useHeaderLargeTitle ? (
                <PortalManager id="scene">
                    <UILargeTitleHeader
                        testID={descriptor.options.testID}
                        title={descriptor.options.title}
                        titleTestID={descriptor.options.titleTestID}
                        headerLargeTitle={descriptor.options.headerLargeTitle}
                        caption={descriptor.options.caption}
                        captionTestID={descriptor.options.captionTestID}
                        onTitlePress={descriptor.options.onTitlePress}
                        onHeaderLargeTitlePress={descriptor.options.onHeaderLargeTitlePress}
                        label={descriptor.options.label}
                        note={descriptor.options.note}
                        renderAboveContent={descriptor.options.renderAboveContent}
                        renderBelowContent={descriptor.options.renderBelowContent}
                        headerLeft={descriptor.options.headerLeft}
                        headerLeftItems={descriptor.options.headerLeftItems}
                        headerBackButton={descriptor.options.headerBackButton}
                        headerRight={descriptor.options.headerRight}
                        headerRightItems={descriptor.options.headerRightItems}
                    >
                        {children}
                    </UILargeTitleHeader>
                </PortalManager>
            ) : (
                <PortalManager id="scene">
                    <UIStackNavigationBar
                        testID={descriptor.options.testID}
                        title={descriptor.options.title}
                        titleTestID={descriptor.options.titleTestID}
                        caption={descriptor.options.caption}
                        captionTestID={descriptor.options.captionTestID}
                        onTitlePress={descriptor.options.onTitlePress}
                        headerLeft={descriptor.options.headerLeft}
                        headerLeftItems={descriptor.options.headerLeftItems}
                        headerBackButton={descriptor.options.headerBackButton}
                        headerRight={descriptor.options.headerRight}
                        headerRightItems={descriptor.options.headerRightItems}
                    />
                    {children}
                </PortalManager>
            )}
        </UIBackgroundView>
    );
}

type OriginalComponentsRegistry = Record<
    string,
    React.ComponentType<{
        navigation: NavigationProp<ParamListBase, string, StackNavigationState<ParamListBase>>;
        route: RouteProp<ParamListBase, string>;
    }>
>;
type OriginalRenderPropRegistry = Record<
    string,
    (params: {
        navigation: NavigationProp<ParamListBase, string, StackNavigationState<ParamListBase>>;
        route: RouteProp<ParamListBase, string>;
    }) => React.ReactNode
>;
const OriginalComponentsContext = React.createContext<{
    components: OriginalComponentsRegistry;
    renderProps: OriginalRenderPropRegistry;
}>({
    components: {},
    renderProps: {},
});

function ComponentScreenWithHeader({
    navigation,
    route,
}: {
    navigation: NavigationProp<ParamListBase, string, StackNavigationState<ParamListBase>>;
    route: RouteProp<ParamListBase, string>;
}) {
    const descriptors = React.useContext(DescriptorsContext);
    const descriptor = descriptors[route.key];

    const ScreenComponent = React.useContext(OriginalComponentsContext).components[route.name];

    if (descriptor == null || ScreenComponent == null) {
        return null;
    }

    return (
        <ScreenWithHeaderContent descriptor={descriptor}>
            <ScreenComponent navigation={navigation} route={route} />
        </ScreenWithHeaderContent>
    );
}

function RenderPropScreenWithHeader({
    navigation,
    route,
}: {
    navigation: NavigationProp<ParamListBase, string, StackNavigationState<ParamListBase>>;
    route: RouteProp<ParamListBase, string>;
}) {
    const descriptors = React.useContext(DescriptorsContext);
    const descriptor = descriptors[route.key];

    const screenRenderProp = React.useContext(OriginalComponentsContext).renderProps[route.name];

    if (descriptor == null || screenRenderProp == null) {
        return null;
    }

    return (
        <ScreenWithHeaderContent descriptor={descriptor}>
            {screenRenderProp({ navigation, route })}
        </ScreenWithHeaderContent>
    );
}

function wrapScreensWithHeader(children: React.ReactNode) {
    const originalComponents: OriginalComponentsRegistry = {};
    const originalRenderProps: OriginalRenderPropRegistry = {};
    const screens = React.Children.toArray(children).reduce<React.ReactNode[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (child.type === React.Fragment) {
                const {
                    screens: innerScreens,
                    original: { components, renderProps },
                } = wrapScreensWithHeader(child.props.children);

                acc.push(...innerScreens);
                // Iterate over deep components to collect into one registry
                Object.keys(components).forEach(key => {
                    originalComponents[key] = components[key];
                });
                // Iterate over deep render props to collect into one registry
                Object.keys(renderProps).forEach(key => {
                    originalRenderProps[key] = renderProps[key];
                });

                return acc;
            }

            if (child.props && 'component' in child.props) {
                originalComponents[child.props.name] = child.props.component;
                acc.push(
                    React.cloneElement(child, {
                        ...child.props,
                        component: ComponentScreenWithHeader,
                    }),
                );
                return acc;
            }

            if (child.props && 'children' in child.props) {
                originalRenderProps[child.props.name] = child.props.children;
                acc.push(
                    React.cloneElement(child, {
                        ...child.props,
                        component: RenderPropScreenWithHeader,
                        children: null,
                    }),
                );
                return acc;
            }
        }
        return acc;
    }, []);

    return {
        screens,
        original: {
            components: originalComponents,
            renderProps: originalRenderProps,
        },
    };
}

function filterDescriptorOptionsForOriginalImplementation(
    descriptors: Record<string, StackDescriptor>,
) {
    return Object.keys(descriptors).reduce<Record<string, any>>((acc, key) => {
        const originalDescriptor = descriptors[key];

        const { headerShown, stackAnimation } = originalDescriptor.options as any;

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

export const StackNavigator = ({
    children,
    initialRouteName,
    screenOptions,
}: SurfSplitNavigatorProps) => {
    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const prevChildren = React.useRef<React.ReactNode>(null);
    const wrapped = React.useRef<ReturnType<typeof wrapScreensWithHeader>>();

    if (prevChildren.current == null || shouldUpdateScreens(children, prevChildren.current)) {
        prevChildren.current = children;
        wrapped.current = wrapScreensWithHeader(children);
    }

    const { state, navigation, descriptors } = useNavigationBuilder<
        StackNavigationState<ParamListBase>,
        StackRouterOptions,
        StackActionHelpers<ParamListBase>,
        StackNavigationOptions,
        StackNavigationEventMap
    >(StackRouter, {
        children: wrapped.current?.screens,
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
            navigation.addListener?.('tabPress', e => {
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

    const originalComponentsData = wrapped.current?.original;

    if (originalComponentsData == null) {
        return null;
    }

    if (doesSupportNative) {
        const descriptorsFiltered = filterDescriptorOptionsForOriginalImplementation(descriptors);
        return (
            <OriginalComponentsContext.Provider value={originalComponentsData}>
                <DescriptorsContext.Provider value={descriptors}>
                    <NativeStackView
                        state={state}
                        navigation={navigation}
                        descriptors={descriptorsFiltered}
                    />
                </DescriptorsContext.Provider>
            </OriginalComponentsContext.Provider>
        );
    }

    return (
        <OriginalComponentsContext.Provider value={originalComponentsData}>
            <DescriptorsContext.Provider value={descriptors}>
                <StackView
                    headerMode="none"
                    state={state}
                    navigation={navigation}
                    // @ts-ignore `title` types are incompatible
                    descriptors={descriptors}
                />
            </DescriptorsContext.Provider>
        </OriginalComponentsContext.Provider>
    );
};

export const createStackNavigator = createNavigatorFactory(StackNavigator);

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
});
