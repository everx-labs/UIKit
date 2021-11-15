import * as React from 'react';
import {
    useWindowDimensions,
    StyleSheet,
    View,
    ViewStyle,
    Platform,
    StyleProp,
} from 'react-native';
import type { EventMapBase, NavigationState } from '@react-navigation/core';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
    useTheme as useNavTheme,
} from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { screensEnabled, ScreenContainer } from 'react-native-screens';
import { StackView } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ResourceSavingScene } from './ResourceSavingScene';
import { SafeAreaProviderCompat } from './SafeAreaProviderCompat';
import { SplitRouter, SplitActions, MAIN_SCREEN_NAME, SplitActionHelpers } from './SplitRouter';
import type { SplitNavigationState, SplitRouterOptions } from './SplitRouter';
import { SplitBottomTabBar, SplitScreenTabBarIconOptions } from './SplitBottomTabBar';

export const NestedInSplitContext = React.createContext<{
    isSplitted: boolean;
}>({ isSplitted: false });

const getIsSplitted = ({ width }: { width: number }, mainWidth: number) => width > mainWidth;

function SceneContent({ isFocused, children }: { isFocused: boolean; children: React.ReactNode }) {
    const { colors } = useNavTheme();

    return (
        <View
            accessibilityElementsHidden={!isFocused}
            importantForAccessibility={isFocused ? 'auto' : 'no-hide-descendants'}
            style={[styles.content, { backgroundColor: colors.background }]}
        >
            {children}
        </View>
    );
}

const SplitTabBarHeightContext = React.createContext(0);
export function useSplitTabBarHeight() {
    return React.useContext(SplitTabBarHeightContext);
}

type SplitNavigatorProps = {
    children?: React.ReactNode;
    initialRouteName: string;
    mainWidth: number;
    screenOptions: {
        splitStyles?: {
            body?: StyleProp<ViewStyle>;
            main?: StyleProp<ViewStyle>;
            detail?: StyleProp<ViewStyle>;
        };
    } & SplitRouterOptions;
};
type SplitScreenOptions = SplitScreenTabBarIconOptions | Record<string, never>;

export function SplitNavigator({
    children,
    initialRouteName,
    mainWidth,
    screenOptions,
}: SplitNavigatorProps) {
    const dimensions = useWindowDimensions();
    const isSplitted = getIsSplitted(dimensions, mainWidth);
    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const { splitStyles: splitStylesFromOptions, ...restScreenOptions } = screenOptions || {};
    const splitStyles = splitStylesFromOptions || {
        body: styles.body,
        main: styles.main,
        detail: styles.detail,
    };
    // TODO: optimise me!
    const { tabRouteNames, stackRouteNames } = React.Children.toArray(children).reduce<{
        tabRouteNames: string[];
        stackRouteNames: string[];
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (
                    child.props.name === MAIN_SCREEN_NAME ||
                    (child.props.options != null &&
                        ('tabBarActiveIcon' in child.props.options ||
                            'tabBarIconLottieSource' in child.props.options))
                ) {
                    acc.tabRouteNames.push(child.props.name);
                } else {
                    acc.stackRouteNames.push(child.props.name);
                }
            }
            return acc;
        },
        {
            tabRouteNames: [],
            stackRouteNames: [],
        },
    );
    const { state, navigation, descriptors } = useNavigationBuilder<
        SplitNavigationState,
        SplitRouterOptions,
        SplitActionHelpers,
        SplitScreenOptions,
        NavigationProp<ParamListBase>
    >(SplitRouter, {
        children,
        initialRouteName,
        screenOptions: {
            ...restScreenOptions,
            // @ts-ignore it's doesn't exist in our options
            // but it's needed to turn of header in react-native-screens
            headerShown: false,
        },
        tabRouteNames,
        stackRouteNames,
        isSplitted,
    });
    console.log(state);

    React.useEffect(() => {
        navigation.dispatch(
            SplitActions.setSplitted(isSplitted, isSplitted ? initialRouteName : MAIN_SCREEN_NAME),
        );
    }, [isSplitted, initialRouteName, navigation]);

    const [loaded, setLoaded] = React.useState<Array<number>>([]);

    React.useEffect(() => {
        if (!loaded.includes(state.index)) {
            setLoaded([...loaded, state.index]);
        }
    }, [state, loaded]);

    const insets = useSafeAreaInsets();
    const tabBarHeight = Math.max(insets?.bottom, 32 /* TODO */) + 64; /* TODO */

    // Access it from the state to re-render a container
    // only when router has processed SET_SPLITTED action

    if (state.isSplitted) {
        const mainRoute = state.routes.find(
            ({ name }: { name: string }) => name === MAIN_SCREEN_NAME,
        );
        if (mainRoute == null) {
            throw new Error(`You should provide ${MAIN_SCREEN_NAME} screen!`);
        }
        const tabBarIcons = Object.keys(descriptors).reduce<
            Record<string, SplitScreenTabBarIconOptions>
        >((acc, key) => {
            if (key === mainRoute.key) {
                return acc;
            }

            const descriptor = descriptors[key];
            if (descriptor.options == null) {
                return acc;
            }
            if ('tabBarActiveIcon' in descriptor.options) {
                acc[key] = {
                    tabBarActiveIcon: descriptor.options.tabBarActiveIcon,
                    tabBarDisabledIcon: descriptor.options.tabBarDisabledIcon,
                };
            }
            if ('tabBarIconLottieSource' in descriptor.options) {
                acc[key] = {
                    tabBarIconLottieSource: descriptor.options.tabBarIconLottieSource,
                };
            }

            return acc;
        }, {});

        return (
            <NavigationHelpersContext.Provider value={navigation}>
                <NestedInSplitContext.Provider value={{ isSplitted }}>
                    <SafeAreaProviderCompat>
                        <View style={splitStyles.body}>
                            <View style={splitStyles.main}>
                                <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                                    {descriptors[mainRoute.key].render()}
                                </SplitTabBarHeightContext.Provider>
                                <SplitBottomTabBar
                                    icons={tabBarIcons}
                                    activeKey={state.routes[state.tabIndex].key}
                                    onPress={key => {
                                        navigation.navigate({ key });
                                    }}
                                />
                            </View>
                            <View style={splitStyles.detail}>
                                <ScreenContainer
                                    // If not disabling the container for native, it will crash on iOS.
                                    // It happens due to an error in `react-native-reanimated`:
                                    // https://github.com/software-mansion/react-native-reanimated/issues/216
                                    enabled={!doesSupportNative}
                                    style={styles.pages}
                                >
                                    {state.routes.map((route, index) => {
                                        const descriptor = descriptors[route.key];
                                        const isFocused = state.tabIndex === index;

                                        // Do not render main route
                                        if (route.key === mainRoute.key) {
                                            return null;
                                        }

                                        // isFocused check is important here
                                        // as we can try to render a screen before it was put
                                        // to `loaded` screens
                                        if (!loaded.includes(index) && !isFocused) {
                                            // Don't render a screen if we've never navigated to it
                                            return null;
                                        }

                                        return (
                                            <ResourceSavingScene
                                                key={route.key}
                                                style={StyleSheet.absoluteFill}
                                                isVisible={isFocused}
                                            >
                                                <SceneContent isFocused={isFocused}>
                                                    {descriptor.render()}
                                                </SceneContent>
                                            </ResourceSavingScene>
                                        );
                                    })}
                                </ScreenContainer>
                            </View>
                        </View>
                    </SafeAreaProviderCompat>
                </NestedInSplitContext.Provider>
            </NavigationHelpersContext.Provider>
        );
    }

    const tabBarIcons = Object.keys(descriptors).reduce<
        Record<string, SplitScreenTabBarIconOptions>
    >((acc, key) => {
        const descriptor = descriptors[key];
        if (descriptor.options == null) {
            return acc;
        }
        if ('tabBarActiveIcon' in descriptor.options) {
            acc[key] = {
                tabBarActiveIcon: descriptor.options.tabBarActiveIcon,
                tabBarDisabledIcon: descriptor.options.tabBarDisabledIcon,
            };
        }
        if ('tabBarIconLottieSource' in descriptor.options) {
            acc[key] = {
                tabBarIconLottieSource: descriptor.options.tabBarIconLottieSource,
            };
        }

        return acc;
    }, {});
    const stackDescriptors = state.routes.reduce<typeof descriptors>((acc, route, index) => {
        const descriptor = descriptors[route.key];
        if (state.nestedStack && state.nestedStack.includes(index)) {
            acc[route.key] = descriptor;
        }
        return acc;
    }, {});
    return (
        <NavigationHelpersContext.Provider value={navigation}>
            <NestedInSplitContext.Provider value={{ isSplitted }}>
                <SafeAreaProviderCompat>
                    <ScreenContainer
                        // If not disabling the container for native, it will crash on iOS.
                        // It happens due to an error in `react-native-reanimated`:
                        // https://github.com/software-mansion/react-native-reanimated/issues/216
                        enabled={!doesSupportNative}
                        style={styles.pages}
                    >
                        {state.routes.map((route, index) => {
                            const descriptor = descriptors[route.key];
                            const isFocused = state.tabIndex === index;

                            // isFocused check is important here
                            // as we can try to render a screen before it was put
                            // to `loaded` screens
                            if (!loaded.includes(index) && !isFocused) {
                                // Don't render a screen if we've never navigated to it
                                return null;
                            }

                            if (route.name === MAIN_SCREEN_NAME) {
                                if (state.nestedStack == null) {
                                    return null;
                                }
                                if (doesSupportNative) {
                                    return (
                                        <ResourceSavingScene
                                            key={route.key}
                                            style={StyleSheet.absoluteFill}
                                            isVisible={isFocused}
                                        >
                                            <SceneContent isFocused={isFocused}>
                                                <NestedInSplitContext.Provider
                                                    value={{ isSplitted }}
                                                >
                                                    <SplitTabBarHeightContext.Provider
                                                        value={tabBarHeight}
                                                    >
                                                        <NativeStackView
                                                            state={{
                                                                stale: false,
                                                                type: 'stack',
                                                                key: state.key.replace(
                                                                    'split',
                                                                    'stack',
                                                                ),
                                                                index: state.nestedStack.length - 1,
                                                                routeNames: stackRouteNames,
                                                                routes: state.nestedStack.map(
                                                                    routeIndex => {
                                                                        return state.routes[
                                                                            routeIndex
                                                                        ];
                                                                    },
                                                                ),
                                                            }}
                                                            navigation={navigation}
                                                            // @ts-ignore
                                                            descriptors={stackDescriptors}
                                                        />
                                                    </SplitTabBarHeightContext.Provider>
                                                </NestedInSplitContext.Provider>
                                            </SceneContent>
                                        </ResourceSavingScene>
                                    );
                                }

                                return (
                                    <ResourceSavingScene
                                        key={route.key}
                                        style={StyleSheet.absoluteFill}
                                        isVisible={isFocused}
                                    >
                                        <SceneContent isFocused={isFocused}>
                                            <NestedInSplitContext.Provider value={{ isSplitted }}>
                                                <SplitTabBarHeightContext.Provider
                                                    value={tabBarHeight}
                                                >
                                                    {/* @ts-ignore */}
                                                    <StackView
                                                        headerMode="none"
                                                        state={{
                                                            stale: false,
                                                            type: 'stack',
                                                            key: state.key.replace(
                                                                'split',
                                                                'stack',
                                                            ),
                                                            index: state.nestedStack.length - 1,
                                                            routeNames: stackRouteNames,
                                                            routes: state.nestedStack.map(
                                                                routeIndex => {
                                                                    return state.routes[routeIndex];
                                                                },
                                                            ),
                                                        }}
                                                        navigation={navigation}
                                                        // @ts-ignore
                                                        descriptors={stackDescriptors}
                                                    />
                                                </SplitTabBarHeightContext.Provider>
                                            </NestedInSplitContext.Provider>
                                        </SceneContent>
                                    </ResourceSavingScene>
                                );
                            }

                            if (stackDescriptors[route.key] != null) {
                                return null;
                            }

                            return (
                                <ResourceSavingScene
                                    key={route.key}
                                    style={StyleSheet.absoluteFill}
                                    isVisible={isFocused}
                                >
                                    <SceneContent isFocused={isFocused}>
                                        <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                                            {descriptor.render()}
                                        </SplitTabBarHeightContext.Provider>
                                    </SceneContent>
                                </ResourceSavingScene>
                            );
                        })}
                    </ScreenContainer>
                    <SplitBottomTabBar
                        icons={tabBarIcons}
                        activeKey={state.routes[state.tabIndex].key}
                        onPress={key => {
                            navigation.navigate({ key });
                        }}
                    />
                </SafeAreaProviderCompat>
            </NestedInSplitContext.Provider>
        </NavigationHelpersContext.Provider>
    );
}

export const createSplitNavigator = createNavigatorFactory<
    NavigationState,
    SplitScreenOptions,
    EventMapBase,
    React.ComponentType<any>
>(SplitNavigator);

const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    main: {
        backgroundColor: 'white',
        minWidth: 300,
        marginRight: 10,
        borderRadius: 5,
    },
    detail: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
    },
    pages: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
