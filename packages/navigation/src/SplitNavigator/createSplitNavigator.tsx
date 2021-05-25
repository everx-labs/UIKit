import * as React from 'react';
import {
    useWindowDimensions as useWindowDimensionsNative,
    StyleSheet,
    View,
    ViewStyle,
    Dimensions,
    Platform,
    ScaledSize,
    StyleProp,
} from 'react-native';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
    useTheme,
} from '@react-navigation/native';
import type {
    StackNavigationState,
    GenericNavigationAction,
    NavigationProp,
    ParamListBase,
} from '@react-navigation/native';
import { screensEnabled, ScreenContainer } from 'react-native-screens';
import { StackView } from '@react-navigation/stack';
import type { StackOptions } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';

import { ResourceSavingScene } from './ResourceSavingScene';
import { SafeAreaProviderCompat } from './SafeAreaProviderCompat';
import { SplitRouter, SplitActions, MAIN_SCREEN_NAME } from './SplitRouter';
import type { SplitNavigationState, SplitRouterOptions } from './SplitRouter';

const getIsSplitted = ({ width }: { width: number }, mainWidth: number) =>
    width > mainWidth;

const useWindowDimensions =
    useWindowDimensionsNative ||
    function useWindowDimensionsFallback() {
        const [dimensions, setDimensions] = React.useState(() =>
            Dimensions.get('window'),
        );

        React.useEffect(() => {
            function handleChange({ window }: { window: ScaledSize }) {
                if (
                    dimensions.width !== window.width ||
                    dimensions.height !== window.height ||
                    dimensions.scale !== window.scale ||
                    dimensions.fontScale !== window.fontScale
                ) {
                    setDimensions(window);
                }
            }
            Dimensions.addEventListener('change', handleChange);
            // We might have missed an update between calling `get` in render and
            // `addEventListener` in this handler, so we set it here. If there was
            // no change, React will filter out this update as a no-op.
            handleChange({ window: Dimensions.get('window') });
            return () => {
                Dimensions.removeEventListener('change', handleChange);
            };
        }, [dimensions]);

        return dimensions;
    };

function SceneContent({
    isFocused,
    children,
}: {
    isFocused: boolean;
    children: React.ReactNode;
}) {
    const { colors } = useTheme();

    return (
        <View
            accessibilityElementsHidden={!isFocused}
            importantForAccessibility={
                isFocused ? 'auto' : 'no-hide-descendants'
            }
            style={[styles.content, { backgroundColor: colors.background }]}
        >
            {children}
        </View>
    );
}

type SurfSplitNavigatorProps = {
    children?: React.ReactNode;
    initialRouteName: string;
    mainWidth: number;
    screenOptions: {
        splitStyles?: {
            body?: StyleProp<ViewStyle>;
            main?: StyleProp<ViewStyle>;
            detail?: StyleProp<ViewStyle>;
        };
        headerShown?: boolean;
    };
};

export const SplitNavigator = ({
    children,
    initialRouteName,
    mainWidth,
    screenOptions,
}: SurfSplitNavigatorProps) => {
    const dimensions = useWindowDimensions();
    const isSplitted = getIsSplitted(dimensions, mainWidth);
    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const { splitStyles: splitStylesFromOptions, ...restScreenOptions } =
        screenOptions || {};
    const splitStyles = splitStylesFromOptions || {
        body: styles.body,
        main: styles.main,
        detail: styles.detail,
    };
    const { state, navigation, descriptors } = useNavigationBuilder<
        SplitNavigationState,
        GenericNavigationAction,
        StackOptions,
        SplitRouterOptions,
        NavigationProp<ParamListBase>
    >(SplitRouter, {
        children,
        initialRouteName,
        // $FlowExpectedError
        screenOptions: {
            ...restScreenOptions,
            headerShown: false,
        },
        isSplitted,
    });

    React.useEffect(() => {
        navigation.dispatch(
            SplitActions.setSplitted(
                isSplitted,
                isSplitted ? initialRouteName : MAIN_SCREEN_NAME,
            ),
        );
    }, [isSplitted, initialRouteName, navigation]);

    const [loaded, setLoaded] = React.useState<Array<number>>([]);

    React.useEffect(() => {
        if (!loaded.includes(state.index)) {
            setLoaded([...loaded, state.index]);
        }
    }, [state, loaded]);

    if (isSplitted) {
        const mainRoute = state.routes.find(
            ({ name }: { name: string }) => name === MAIN_SCREEN_NAME,
        );
        if (mainRoute == null) {
            throw new Error(`You should provide ${MAIN_SCREEN_NAME} screen!`);
        }
        return (
            <NavigationHelpersContext.Provider value={navigation}>
                <SafeAreaProviderCompat>
                    <View style={splitStyles.body}>
                        <View style={splitStyles.main}>
                            {descriptors[mainRoute.key].render()}
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
                                    const isFocused = state.index === index;

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
            </NavigationHelpersContext.Provider>
        );
    }

    const stackState: StackNavigationState = {
        ...state,
        type: 'stack',
    };

    // TODO: there could be issues on iOS with rendering
    // need to check it and disable for iOS if it works badly
    // if (Platform.OS === 'android' && screensEnabled()) {
    if (doesSupportNative) {
        return (
            <NativeStackView
                state={stackState}
                // we can't use StackNavigationProp 'cause we'd got errors in other places
                // $FlowExpectedError
                navigation={navigation}
                // we can't use StackNavigationProp 'cause we'd got errors in other places
                // $FlowExpectedError
                descriptors={descriptors}
            />
        );
    }
    return (
        <StackView
            headerMode="none"
            state={stackState}
            // we can't use StackNavigationProp 'cause we'd got errors in other places
            // $FlowExpectedError
            navigation={navigation}
            // we can't use StackNavigationProp 'cause we'd got errors in other places
            // $FlowExpectedError
            descriptors={descriptors}
        />
    );
};

export const createSplitNavigator = createNavigatorFactory(SplitNavigator);

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
