import * as React from 'react';
import {
    useWindowDimensions,
    StyleSheet,
    View,
    ViewStyle,
    Platform,
    StyleProp,
} from 'react-native';
import type { Descriptor, EventMapBase, NavigationState, RouteProp } from '@react-navigation/core';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
} from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { screensEnabled, enableScreens } from 'react-native-screens';
import { StackView, TransitionPresets } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import {
    useWrapScreensWithUILargeTitleHeader,
    StackNavigationOptions,
    filterDescriptorOptionsForOriginalImplementation,
} from '@tonlabs/uicast.stack-navigator';

import { SafeAreaProviderCompat } from './SafeAreaProviderCompat';
import {
    SplitRouter,
    SplitActions,
    MAIN_SCREEN_NAME,
    SplitActionHelpers,
    NavigationRoute,
} from './SplitRouter';
import type { SplitNavigationState, SplitRouterOptions } from './SplitRouter';
import {
    SplitBottomTabBar,
    SplitScreenTabBarAnimatedIconOptions,
    SplitScreenTabBarIconOptions,
    SplitScreenTabBarStaticIconOptions,
    useTabBarHeight,
} from './SplitBottomTabBar';
import { MainAnimatedIcon } from './MainAnimatedIcon';
import { TabScreen } from './TabScreen';
import { MaybeScreenContainer } from './ScreenFallback';

enableScreens(Platform.OS !== 'web');

export const NestedInSplitContext = React.createContext<boolean>(false);

export function useIsSplitted() {
    const isSplitted = React.useContext(NestedInSplitContext);
    return isSplitted;
}

const getIsSplitted = ({ width }: { width: number }, mainWidth: number) => width > mainWidth;

const SplitTabBarHeightContext = React.createContext(0);
export function useSplitTabBarHeight() {
    return React.useContext(SplitTabBarHeightContext);
}

type SplitStyles = {
    body?: StyleProp<ViewStyle>;
    main?: StyleProp<ViewStyle>;
    detail?: StyleProp<ViewStyle>;
};

export type SplitScreenOptions =
    | (SplitScreenTabBarStaticIconOptions & StackNavigationOptions)
    | (SplitScreenTabBarAnimatedIconOptions & StackNavigationOptions)
    | StackNavigationOptions;

type SplitNavigatorProps = {
    initialRouteName: string;
    mainWidth: number;
    screenOptions?: SplitScreenOptions;
    styles?: SplitStyles;
    children?: React.ReactNode;
};

function UnfoldedSplitNavigator({
    navigation,
    descriptors,
    state,
    mainRoute,
    splitStyles,
    tabRouteNamesMap,
    loaded,
    onTabPress,
}: {
    splitStyles: SplitStyles;
    navigation: any;
    descriptors: Record<
        string,
        Descriptor<
            // eslint-disable-next-line @typescript-eslint/ban-types
            Record<string, object | undefined>,
            string,
            SplitNavigationState<ParamListBase>,
            SplitScreenOptions,
            // eslint-disable-next-line @typescript-eslint/ban-types
            {}
        >
    >;
    state: SplitNavigationState<ParamListBase>;
    mainRoute: NavigationRoute<ParamListBase, string>;
    tabRouteNamesMap: Set<string>;
    loaded: React.RefObject<number[]>;
    onTabPress: (key: string) => void;
}) {
    const tabBarIcons = React.useMemo(
        () =>
            state.routes.reduce<Record<string, SplitScreenTabBarIconOptions>>((acc, route) => {
                if (!tabRouteNamesMap.has(route.name)) {
                    return acc;
                }

                if (route.key === mainRoute.key) {
                    return acc;
                }

                const descriptor = descriptors[route.key];
                if (descriptor.options == null) {
                    return acc;
                }
                if ('tabBarActiveIcon' in descriptor.options) {
                    acc[route.key] = {
                        tabBarActiveIcon: descriptor.options.tabBarActiveIcon,
                        tabBarDisabledIcon: descriptor.options.tabBarDisabledIcon,
                    };
                    return acc;
                }
                if ('tabBarAnimatedIcon' in descriptor.options) {
                    acc[route.key] = {
                        tabBarAnimatedIcon: descriptor.options.tabBarAnimatedIcon,
                    };
                    return acc;
                }

                return acc;
            }, {}),
        // The rule is disabled to not include `descriptors` as a dep
        // because descriptors going to be changed every render
        // and will ruin the optimisation
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [tabRouteNamesMap, mainRoute.key, state.routes],
    );

    // const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();
    const { tabBarHeight, insetsWithTabBar } = useTabBarHeight();

    return (
        <NavigationHelpersContext.Provider value={navigation}>
            <NestedInSplitContext.Provider value>
                <SafeAreaProviderCompat>
                    <View style={splitStyles.body}>
                        <View style={splitStyles.main}>
                            <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                                <SafeAreaInsetsContext.Provider value={insetsWithTabBar}>
                                    {descriptors[mainRoute.key].render()}
                                </SafeAreaInsetsContext.Provider>
                            </SplitTabBarHeightContext.Provider>
                            <SplitBottomTabBar
                                icons={tabBarIcons}
                                activeKey={state.routes[state.tabIndex].key}
                                onPress={onTabPress}
                            />
                        </View>
                        <View style={splitStyles.detail}>
                            <MaybeScreenContainer
                                // If not disabling the container for native, it will crash on iOS.
                                // It happens due to an error in `react-native-reanimated`:
                                // https://github.com/software-mansion/react-native-reanimated/issues/216
                                // enabled={!doesSupportNative}
                                enabled
                                style={styles.pages}
                            >
                                {state.routes.map((route, index) => {
                                    // Do not render main route
                                    if (route.key === mainRoute.key) {
                                        return null;
                                    }

                                    const descriptor = descriptors[route.key];
                                    const isFocused = state.tabIndex === index;

                                    // isFocused check is important here
                                    // as we can try to render a screen before it was put
                                    // to `loaded` screens
                                    if (!loaded.current?.includes(index) && !isFocused) {
                                        // Don't render a screen if we've never navigated to it
                                        return null;
                                    }

                                    return (
                                        <TabScreen key={route.key} isVisible={isFocused}>
                                            {descriptor.render()}
                                        </TabScreen>
                                    );
                                })}
                            </MaybeScreenContainer>
                        </View>
                    </View>
                </SafeAreaProviderCompat>
            </NestedInSplitContext.Provider>
        </NavigationHelpersContext.Provider>
    );
}

function FoldedSplitNavigator({
    navigation,
    descriptors,
    state,
    mainRoute,
    tabRouteNames,
    tabRouteNamesMap,
    stackRouteNames,
    loaded,
    onTabPress,
}: {
    navigation: any;
    descriptors: Record<
        string,
        Descriptor<
            // eslint-disable-next-line @typescript-eslint/ban-types
            Record<string, object | undefined>,
            string,
            SplitNavigationState<ParamListBase>,
            SplitScreenOptions,
            // eslint-disable-next-line @typescript-eslint/ban-types
            {}
        >
    >;
    state: SplitNavigationState<ParamListBase>;
    mainRoute: NavigationRoute<ParamListBase, string>;
    tabRouteNames: string[];
    tabRouteNamesMap: Set<string>;
    stackRouteNames: string[];
    loaded: React.RefObject<number[]>;
    onTabPress: (key: string) => void;
}) {
    const tabBarIcons = React.useMemo(
        () =>
            state.routes.reduce<Record<string, SplitScreenTabBarIconOptions>>((acc, route) => {
                if (!tabRouteNamesMap.has(route.name)) {
                    return acc;
                }

                const descriptor = descriptors[route.key];
                if (descriptor.options == null) {
                    return acc;
                }
                if ('tabBarActiveIcon' in descriptor.options) {
                    acc[route.key] = {
                        tabBarActiveIcon: descriptor.options.tabBarActiveIcon,
                        tabBarDisabledIcon: descriptor.options.tabBarDisabledIcon,
                    };
                    return acc;
                }
                if ('tabBarAnimatedIcon' in descriptor.options) {
                    acc[route.key] = {
                        tabBarAnimatedIcon: descriptor.options.tabBarAnimatedIcon,
                    };
                    return acc;
                }
                if (mainRoute.key === route.key) {
                    acc[route.key] = {
                        tabBarAnimatedIcon: MainAnimatedIcon,
                    };
                    return acc;
                }

                return acc;
            }, {}),
        // The rule is disabled to not include `descriptors` as a dep
        // because descriptors going to be changed every render
        // and will ruin the optimisation
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [tabRouteNamesMap, mainRoute.key, state.routes],
    );
    const { tabBarHeight, insetsWithTabBar } = useTabBarHeight();

    const stackDescriptors = (state.nestedStack ?? []).reduce<typeof descriptors>(
        (acc, routeIndex) => {
            const route = state.routes[routeIndex];
            const descriptor = descriptors[route.key];

            if (route.key === mainRoute.key) {
                acc[route.key] = {
                    ...descriptor,
                    render: () => {
                        return (
                            <MaybeScreenContainer
                                // If not disabling the container for native, it will crash on iOS.
                                // It happens due to an error in `react-native-reanimated`:
                                // https://github.com/software-mansion/react-native-reanimated/issues/216
                                // enabled={!doesSupportNative}
                                enabled
                                style={styles.pages}
                            >
                                {tabRouteNames.map(tabName => {
                                    const tabRouteIndex = state.routeNames.indexOf(tabName);
                                    const tabRoute = state.routes[tabRouteIndex];
                                    const tabDescriptor = descriptors[tabRoute.key];
                                    const isFocused = state.tabIndex === tabRouteIndex;

                                    // isFocused check is important here
                                    // as we can try to render a screen before it was put
                                    // to `loaded` screens
                                    if (!loaded.current?.includes(tabRouteIndex) && !isFocused) {
                                        // Don't render a screen if we've never navigated to it
                                        return null;
                                    }
                                    return (
                                        <SafeAreaInsetsContext.Provider value={insetsWithTabBar}>
                                            <TabScreen key={tabRoute.key} isVisible={isFocused}>
                                                {tabDescriptor.render()}
                                            </TabScreen>
                                        </SafeAreaInsetsContext.Provider>
                                    );
                                })}
                                <SplitBottomTabBar
                                    icons={tabBarIcons}
                                    activeKey={state.routes[state.tabIndex].key}
                                    onPress={onTabPress}
                                />
                            </MaybeScreenContainer>
                        );
                    },
                };
                return acc;
            }
            acc[route.key] = descriptor;
            return acc;
        },
        {},
    );

    const stackState = React.useMemo(
        () => ({
            stale: false,
            type: 'stack',
            key: state.key.replace('split', 'stack'),
            index: state.nestedStack ? state.nestedStack.length - 1 : 0,
            routeNames: stackRouteNames,
            routes: (state.nestedStack ?? []).map(routeIndex => {
                return state.routes[routeIndex];
            }),
        }),
        [stackRouteNames, state.nestedStack, state.routes, state.key],
    );
    /**
     * react-native-screens rely on original navigation structure
     * and tries to set source and target for actions
     * https://github.com/software-mansion/react-native-screens/blob/6c87d7749ec62fbb51fb4ec50af1fa8733ebae86/src/native-stack/views/NativeStackView.tsx#L256-L260
     *
     * But this way it won't be handled by our router,
     * so we have to exclude it from an action
     */
    const stackNavigation = React.useMemo(() => {
        const originalDispatch = navigation.dispatch;
        return {
            ...navigation,
            dispatch<Op = Record<string, unknown>>(op: Op | ((op: Op) => void)) {
                if (typeof op === 'function') {
                    return originalDispatch.call(navigation, op);
                }

                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { source, target, ...action } = op;

                return originalDispatch.call(navigation, action);
            },
        };
    }, [navigation]);

    if (screensEnabled?.()) {
        const descriptorsFiltered =
            filterDescriptorOptionsForOriginalImplementation(stackDescriptors);
        return (
            <NavigationHelpersContext.Provider value={navigation}>
                <NestedInSplitContext.Provider value={false}>
                    <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                        <NativeStackView
                            // @ts-ignore
                            state={stackState}
                            navigation={stackNavigation}
                            // @ts-ignore
                            descriptors={descriptorsFiltered}
                        />
                    </SplitTabBarHeightContext.Provider>
                </NestedInSplitContext.Provider>
            </NavigationHelpersContext.Provider>
        );
    }

    return (
        <NavigationHelpersContext.Provider value={navigation}>
            <NestedInSplitContext.Provider value={false}>
                <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                    {/* @ts-ignore */}
                    <StackView
                        headerMode="none"
                        // @ts-ignore
                        state={stackState}
                        navigation={stackNavigation}
                        // @ts-ignore
                        descriptors={stackDescriptors}
                    />
                </SplitTabBarHeightContext.Provider>
            </NestedInSplitContext.Provider>
        </NavigationHelpersContext.Provider>
    );
}

function useSplitTabsAndStacksScreens(children: React.ReactNode) {
    // A little optimisation to not create it with every render
    const prevChildren = React.useRef<React.ReactNode>(null);
    const tabRouteNamesRef = React.useRef<string[]>();
    const tabRouteNamesMapRef = React.useRef<Set<string>>();
    const stackRouteNamesRef = React.useRef<string[]>();

    if (
        prevChildren.current !== children ||
        tabRouteNamesRef.current == null ||
        tabRouteNamesMapRef.current == null ||
        stackRouteNamesRef.current == null
    ) {
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
                                'tabBarAnimatedIcon' in child.props.options))
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
        tabRouteNamesRef.current = tabRouteNames;
        tabRouteNamesMapRef.current = new Set(tabRouteNames);
        stackRouteNamesRef.current = stackRouteNames;
    }

    return {
        tabRouteNames: tabRouteNamesRef.current,
        tabRouteNamesMap: tabRouteNamesMapRef.current,
        stackRouteNames: stackRouteNamesRef.current,
    };
}

export function SplitNavigator({
    children,
    initialRouteName,
    mainWidth,
    screenOptions,
    styles,
}: SplitNavigatorProps) {
    const dimensions = useWindowDimensions();
    const isSplitted = getIsSplitted(dimensions, mainWidth);

    const splitStyles = styles || defaultSplitStyles;

    const { tabRouteNames, tabRouteNamesMap, stackRouteNames } =
        useSplitTabsAndStacksScreens(children);

    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const {
        state,
        navigation,
        descriptors: rawDescriptors,
    } = useNavigationBuilder<
        SplitNavigationState,
        SplitRouterOptions,
        SplitActionHelpers,
        SplitScreenOptions,
        NavigationProp<ParamListBase>
    >(SplitRouter, {
        children,
        initialRouteName: isSplitted ? initialRouteName : MAIN_SCREEN_NAME,
        screenOptions: {
            ...screenOptions,
            // @ts-ignore it's doesn't exist in our options
            // but it's needed to turn of header in react-native-screens
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
        tabRouteNames,
        stackRouteNames,
        isSplitted,
    });

    React.useEffect(() => {
        navigation.dispatch(
            SplitActions.setSplitted(isSplitted, isSplitted ? initialRouteName : MAIN_SCREEN_NAME),
        );
    }, [isSplitted, initialRouteName, navigation]);

    const loadedRef = React.useRef<number[]>([]);

    if (!loadedRef.current.includes(state.index)) {
        loadedRef.current = [...loadedRef.current, state.index];
    }

    // Access it from the state to re-render a container
    // only when router has processed SET_SPLITTED action

    const onTabPress = React.useCallback(
        (key: string) => {
            if (state.routes[state.tabIndex].key === key) {
                return;
            }
            navigation.navigate({ key });
        },
        [navigation, state.routes, state.tabIndex],
    );

    const descriptors = useWrapScreensWithUILargeTitleHeader<
        SplitScreenOptions,
        SplitNavigationState
    >(rawDescriptors, !isSplitted);

    const mainRoute = state.routes.find(({ name }: { name: string }) => name === MAIN_SCREEN_NAME);
    if (mainRoute == null) {
        throw new Error(`You should provide ${MAIN_SCREEN_NAME} screen!`);
    }

    if (state.isSplitted) {
        return (
            <UnfoldedSplitNavigator
                navigation={navigation}
                descriptors={descriptors}
                state={state}
                mainRoute={mainRoute}
                splitStyles={splitStyles}
                tabRouteNamesMap={tabRouteNamesMap}
                loaded={loadedRef}
                onTabPress={onTabPress}
            />
        );
    }

    return (
        <FoldedSplitNavigator
            navigation={navigation}
            descriptors={descriptors}
            state={state}
            mainRoute={mainRoute}
            tabRouteNames={tabRouteNames}
            tabRouteNamesMap={tabRouteNamesMap}
            stackRouteNames={stackRouteNames}
            loaded={loadedRef}
            onTabPress={onTabPress}
        />
    );
}

export const createSplitNavigator = createNavigatorFactory<
    NavigationState,
    SplitScreenOptions,
    EventMapBase,
    React.ComponentType<any>
>(SplitNavigator);

export type SplitNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = NavigationProp<ParamList, RouteName, SplitNavigationState<ParamList>, StackNavigationOptions> &
    SplitActionHelpers;
export type SplitScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string,
> = {
    navigation: SplitNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
};

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
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
});
const defaultSplitStyles = {
    body: styles.body,
    main: styles.main,
    detail: styles.detail,
};
