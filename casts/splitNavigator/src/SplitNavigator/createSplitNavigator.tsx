import * as React from 'react';
import {
    useWindowDimensions,
    StyleSheet,
    View,
    ViewStyle,
    Platform,
    StyleProp,
    Animated,
    ImageSourcePropType,
    ImageRequireSource,
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
import { UIImage } from '@tonlabs/uikit.media';
import { useTheme, ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { hapticSelection } from '@tonlabs/uikit.controls';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    RawButton as GHRawButton,
} from 'react-native-gesture-handler';
import ReAnimated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { ResourceSavingScene } from './ResourceSavingScene';
import { SafeAreaProviderCompat } from './SafeAreaProviderCompat';
import { SplitRouter, SplitActions, MAIN_SCREEN_NAME, SplitActionHelpers } from './SplitRouter';
import type { SplitNavigationState, SplitRouterOptions } from './SplitRouter';

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

type SplitScreenTabBarIconOptions =
    | {
          tabBarActiveIcon: ImageSourcePropType;
          tabBarDisabledIcon: ImageSourcePropType;
      }
    | {
          tabBarIconLottieSource: ImageRequireSource;
      };
type SplitScreenOptions = SplitScreenTabBarIconOptions | Record<string, never>;

/**
 * TODO
 */
function LottieView(_props: {
    source: ImageSourcePropType;
    progress: Animated.Value;
    style: StyleProp<ViewStyle>;
}) {
    return null;
}

type LottieIconViewProps = {
    activeState: boolean;
    source: ImageRequireSource;
};
function LottieIconView({ activeState, source }: LottieIconViewProps) {
    const progress = React.useRef(new Animated.Value(activeState ? 1 : 0)).current;
    // React.useImperativeHandle(ref, () => ({
    //     activate() {
    //         /**
    //          * TODO: maybe linear is better to keep it in sync with the dot?
    //          */
    //         Animated.spring(progress, {
    //             toValue: 1,
    //             useNativeDriver: true,
    //         });
    //     },
    //     disable() {
    //         Animated.spring(progress, {
    //             toValue: 0,
    //             useNativeDriver: true,
    //         });
    //     },
    // }));

    return (
        <LottieView
            source={source}
            progress={progress}
            // TODO
            style={{ width: 22, height: 22 }}
        />
    );
}

type ImageIconViewProps = {
    activeState: boolean;
    activeSource: ImageSourcePropType;
    disabledSource: ImageSourcePropType;
};
function ImageIconView({ activeState, activeSource, disabledSource }: ImageIconViewProps) {
    return (
        <UIImage
            source={activeState ? activeSource : disabledSource}
            // TODO
            style={{ width: 22, height: 22 }}
        />
    );
}

function SplitBottomTabBarItem({
    children,
    keyProp,
    onPress,
}: {
    children: React.ReactNode;
    // key is reserved prop in React,
    // therefore had to call it this way
    keyProp: string;
    onPress: (key: string) => void;
}) {
    const gestureHandler = useAnimatedGestureHandler<GestureEvent<NativeViewGestureHandlerPayload>>(
        {
            onFinish: () => {
                hapticSelection();
                runOnJS(onPress)(keyProp);
            },
        },
    );
    return (
        <GHRawButton
            enabled
            onGestureEvent={gestureHandler}
            // TODO
            style={{
                height: 64,
                width: 64,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </GHRawButton>
    );
}
type SplitBottomTabBarDotRef = { moveTo(index: number): void };
type SplitBottomTabBarDotProps = { initialIndex: number };
const SplitBottomTabBarDot = React.memo(
    React.forwardRef<SplitBottomTabBarDotRef, SplitBottomTabBarDotProps>(
        function SplitBottomTabBarDot({ initialIndex }: SplitBottomTabBarDotProps, ref) {
            const theme = useTheme();
            const position = useSharedValue((initialIndex + 1) * 64 - 32);
            React.useImperativeHandle(ref, () => ({
                moveTo(index: number) {
                    position.value = withSpring((index + 1) * 64 - 32, { overshootClamping: true });
                },
            }));

            const style = useAnimatedStyle(() => {
                return {
                    transform: [
                        {
                            translateX: position.value,
                        },
                    ],
                };
            });
            return (
                <ReAnimated.View
                    style={[
                        {
                            position: 'absolute',
                            bottom: 8, // TODO
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme[ColorVariants.BackgroundAccent],
                        },
                        style,
                    ]}
                />
            );
        },
    ),
);

function SplitBottomTabBar({
    icons,
    activeKey,
    onPress,
}: {
    icons: Record<string, SplitScreenTabBarIconOptions>;
    activeKey: string;
    onPress: (key: string) => void;
}) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const dotRef = React.useRef<SplitBottomTabBarDotRef>(null);
    const prevActiveKey = React.useRef(activeKey);
    const initialDotIndex = React.useRef(-1);
    if (initialDotIndex.current === -1) {
        const iconsArr = Object.keys(icons);
        for (let i = 0; i < iconsArr.length; i += 1) {
            if (iconsArr[i] === activeKey) {
                initialDotIndex.current = i;
                break;
            }
        }
    }
    React.useEffect(() => {
        if (activeKey === prevActiveKey.current) {
            return;
        }

        prevActiveKey.current = activeKey;
        const iconsArr = Object.keys(icons);
        for (let i = 0; i < iconsArr.length; i += 1) {
            if (iconsArr[i] === activeKey) {
                dotRef.current?.moveTo(i);
                break;
            }
        }
    }, [activeKey, icons]);

    /**
     * Do not show tab bar when there're only
     * 0 or 1 icon available, as it won't do anything useful anyway
     */
    if (Object.keys(icons).length < 2) {
        return null;
    }

    return (
        <UIBackgroundView
            // TODO
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                paddingBottom: Math.max(insets?.bottom, 32 /* TODO */),
                alignItems: 'center',
            }}
            pointerEvents="box-none"
        >
            <View
                style={{
                    position: 'relative',
                    flexDirection: 'row',
                    borderRadius: 32, // TODO
                    shadowRadius: 48,
                    shadowOffset: {
                        width: 0,
                        height: 16,
                    },
                    shadowColor: theme[ColorVariants.Shadow],
                    shadowOpacity: 0.08,
                }}
            >
                {Object.keys(icons).map(key => {
                    const icon = icons[key];
                    if ('tabBarIconLottieSource' in icon) {
                        return (
                            <SplitBottomTabBarItem key={key} keyProp={key} onPress={onPress}>
                                <LottieIconView
                                    source={icon.tabBarIconLottieSource}
                                    activeState={key === activeKey}
                                />
                            </SplitBottomTabBarItem>
                        );
                    }
                    return (
                        <SplitBottomTabBarItem key={key} keyProp={key} onPress={onPress}>
                            <ImageIconView
                                activeSource={icon.tabBarActiveIcon}
                                disabledSource={icon.tabBarDisabledIcon}
                                activeState={key === activeKey}
                            />
                        </SplitBottomTabBarItem>
                    );
                })}
                <SplitBottomTabBarDot ref={dotRef} initialIndex={initialDotIndex.current} />
            </View>
        </UIBackgroundView>
    );
}

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
