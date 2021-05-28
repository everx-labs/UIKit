import * as React from 'react';
import { Platform } from 'react-native';
import {
    useNavigationBuilder,
    createNavigatorFactory,
    StackRouter,
    StackRouterOptions,
    StackActionHelpers,
    StackActions,
    EventArg,
    useRoute,
    Descriptor,
} from '@react-navigation/native';
import type {
    StackNavigationState,
    ParamListBase,
} from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';
import { StackView } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';
import type { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorVariants, UIBackgroundView } from '@tonlabs/uikit.hydrogen';

import { UINavigationBar } from '../UINavigationBar';
import { UILargeTitleHeader } from '../UILargeTitleHeader';

const DescriptorsContext = React.createContext<
    Record<
        string,
        Descriptor<
            // eslint-disable-next-line @typescript-eslint/ban-types
            Record<string, object | undefined>,
            string,
            StackNavigationState<ParamListBase>,
            StackNavigationOptions,
            // eslint-disable-next-line @typescript-eslint/ban-types
            {}
        >
    >
>({});

type StackNavigationOptions = {
    /**
     * String to display in the header as title. Defaults to scene `title`.
     */
    title?: string;
    /**
     * Boolean to prefer large title header (like in iOS setting).
     * For large title to collapse on scroll, the content of the screen
     * should be wrapped in a scrollable view such as `ScrollView` or `FlatList`
     * from our package.
     */
    headerLargeTitle?: boolean;
    /**
     * Whether to show header or not
     */
    headerShown?: boolean;
    /**
     * Background color for the whole screen
     */
    backgroundColor?: ColorVariants;
};

function wrapScreenComponentWithHeader(
    ScreenComponent: React.ComponentType<any>,
) {
    function ScreenWithHeader(props: any) {
        const { top } = useSafeAreaInsets();

        const descriptors = React.useContext(DescriptorsContext);
        const route = useRoute();
        const descriptor = descriptors[route.key];

        let content: React.ReactNode = null;
        if (descriptor.options.headerLargeTitle) {
            content = (
                <UILargeTitleHeader
                    title={descriptor.options.title}
                    headerRightItems={[{ label: 'Action' }]}
                >
                    <ScreenComponent {...props} />
                </UILargeTitleHeader>
            );
        } else {
            content = (
                <>
                    <UINavigationBar
                        title={descriptor.options.title}
                        headerRightItems={[{ label: 'Action' }]}
                    />
                    <ScreenComponent {...props} />
                </>
            );
        }

        return (
            <UIBackgroundView
                color={
                    descriptor.options.backgroundColor ||
                    ColorVariants.BackgroundPrimary
                }
                style={{
                    flex: 1,
                    paddingTop: top,
                }}
            >
                {content}
            </UIBackgroundView>
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
            }
            return acc;
        },
        [],
    );

    return screens;
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

    const { state, navigation, descriptors } = useNavigationBuilder<
        StackNavigationState<ParamListBase>,
        StackRouterOptions,
        StackActionHelpers<ParamListBase>,
        StackNavigationOptions,
        StackNavigationEventMap
    >(StackRouter, {
        children: wrapScreensWithHeader(children),
        initialRouteName,
        screenOptions: {
            ...screenOptions,
            headerShown: false,
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

    // TODO: there could be issues on iOS with rendering
    // need to check it and disable for iOS if it works badly
    // if (Platform.OS === 'android' && screensEnabled()) {
    if (doesSupportNative) {
        return (
            <DescriptorsContext.Provider value={descriptors}>
                <NativeStackView
                    state={state}
                    navigation={navigation}
                    // @ts-ignore
                    descriptors={descriptors}
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
                descriptors={descriptors}
            />
        </DescriptorsContext.Provider>
    );
};

export const createStackNavigator = createNavigatorFactory(StackNavigator);
