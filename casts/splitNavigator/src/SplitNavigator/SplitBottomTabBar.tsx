/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import {
    View,
    ImageSourcePropType,
    StyleProp,
    ViewStyle,
    StyleSheet,
    processColor,
    I18nManager,
} from 'react-native';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import ReAnimated, {
    runOnJS,
    SharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIImage } from '@tonlabs/uikit.media';
import { useTheme, ColorVariants, useShadow } from '@tonlabs/uikit.themes';
import { hapticSelection } from '@tonlabs/uikit.controls';
import { ShadowView } from './ShadowView';

export type SplitScreenTabBarAnimatedIconComponentProps = {
    progress: ReAnimated.SharedValue<number>;
    style?: StyleProp<ViewStyle>;
};
type SplitScreenTabBarAnimatedIconComponent =
    React.ComponentType<SplitScreenTabBarAnimatedIconComponentProps>;

export type SplitScreenTabBarStaticIconOptions = {
    tabBarTestID?: string;
    tabBarActiveIcon: ImageSourcePropType;
    tabBarDisabledIcon: ImageSourcePropType;
};

export type SplitScreenTabBarAnimatedIconOptions = {
    tabBarTestID?: string;
    tabBarAnimatedIcon: SplitScreenTabBarAnimatedIconComponent;
};

export type SplitScreenTabBarIconOptions =
    | SplitScreenTabBarStaticIconOptions
    | SplitScreenTabBarAnimatedIconOptions;

// @inline
const ANIMATED_ICON_INACTIVE = 0;
// @inline
const ANIMATED_ICON_ACTIVE = 1;
const TAB_BAR_ICON_SIZE = 22;

type AnimatedIconViewProps = {
    activeState: boolean;
    component: SplitScreenTabBarAnimatedIconComponent;
    testID: string;
};

function AnimatedIconView({ activeState, component }: AnimatedIconViewProps) {
    const progress = useSharedValue(activeState ? ANIMATED_ICON_ACTIVE : ANIMATED_ICON_INACTIVE);

    React.useEffect(() => {
        progress.value = withSpring(activeState ? ANIMATED_ICON_ACTIVE : ANIMATED_ICON_INACTIVE, {
            overshootClamping: true,
        });
    }, [activeState, progress]);

    const Comp = component;

    return <Comp progress={progress} style={styles.icon} />;
}

type ImageIconViewProps = {
    activeState: boolean;
    activeSource: ImageSourcePropType;
    disabledSource: ImageSourcePropType;
    testID: string;
};
function ImageIconView({ activeState, activeSource, disabledSource, testID }: ImageIconViewProps) {
    return (
        <UIImage
            testID={testID}
            source={activeState ? activeSource : disabledSource}
            style={styles.icon}
        />
    );
}

export const RawButton = ReAnimated.createAnimatedComponent<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>(GHRawButton);

function SplitBottomTabBarItem({
    children,
    keyProp,
    testID,
    onPress,
}: {
    children: React.ReactNode;
    // key is reserved prop in React,
    // therefore had to call it this way
    keyProp: string;
    testID: string;
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
        <RawButton
            testID={testID}
            enabled
            onGestureEvent={gestureHandler}
            style={styles.iconButton}
            rippleColor={processColor('transparent')}
        >
            {children}
        </RawButton>
    );
}

const TAB_BAR_DOT_SIZE = 4;
const TAB_BAR_DOT_BOTTOM = 8;

function runUIGetDotPosition(index: number, isRTLShared: SharedValue<boolean>) {
    'worklet';

    return (
        ((index + 1) * TAB_BAR_HEIGHT - TAB_BAR_HEIGHT / 2 - TAB_BAR_DOT_SIZE / 2) *
        (isRTLShared.value ? -1 : 1)
    );
}

type SplitBottomTabBarDotRef = { moveTo(index: number): void };
type SplitBottomTabBarDotProps = { initialIndex: number };
const SplitBottomTabBarDot = React.memo(
    React.forwardRef<SplitBottomTabBarDotRef, SplitBottomTabBarDotProps>(
        function SplitBottomTabBarDot({ initialIndex }: SplitBottomTabBarDotProps, ref) {
            const theme = useTheme();
            const isRTLShared = useSharedValue(I18nManager.getConstants().isRTL);
            const position = useSharedValue(runUIGetDotPosition(initialIndex, isRTLShared));

            React.useImperativeHandle(ref, () => ({
                moveTo(index: number) {
                    position.value = withSpring(runUIGetDotPosition(index, isRTLShared), {
                        overshootClamping: true,
                    });
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
                        styles.dot,
                        {
                            backgroundColor: theme[ColorVariants.BackgroundAccent],
                        },
                        style,
                    ]}
                />
            );
        },
    ),
);

export function SplitBottomTabBar({
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

    const prevIconsRef = React.useRef<typeof icons>();
    const iconsMapRef = React.useRef<Record<string, number>>();
    if (prevIconsRef.current !== icons || iconsMapRef.current == null) {
        prevIconsRef.current = icons;
        iconsMapRef.current = Object.keys(icons).reduce<Record<string, number>>((acc, key, i) => {
            acc[key] = i;
            return acc;
        }, {});
    }
    const iconsMap = iconsMapRef.current;

    const currentDotIndex = React.useMemo(() => {
        return iconsMap[activeKey] ?? -1;
    }, [activeKey, iconsMap]);

    React.useEffect(() => {
        if (activeKey === prevActiveKey.current) {
            return;
        }

        prevActiveKey.current = activeKey;

        const index = iconsMap[activeKey];
        if (index != null) {
            dotRef.current?.moveTo(index);
        }
    }, [activeKey, icons, iconsMap]);

    const hasIconForActiveKey = React.useMemo(() => {
        return iconsMap[activeKey] != null;
    }, [activeKey, iconsMap]);

    const shadowStyle = useShadow(5);

    /**
     * Do not show tab bar when there're only
     * 0 or 1 icon available, as it won't do anything useful anyway
     */
    if (Object.keys(icons).length < 2) {
        return null;
    }

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: Math.max(insets?.bottom, TAB_BAR_DEFAULT_BOTTOM_INSET),
                },
            ]}
            pointerEvents="box-none"
        >
            <ShadowView
                style={[
                    styles.iconsBox,
                    shadowStyle,
                    {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                ]}
            >
                {Object.keys(icons).map(key => {
                    const icon = icons[key];
                    if ('tabBarAnimatedIcon' in icon) {
                        return (
                            <SplitBottomTabBarItem
                                testID={`tab_bar_item_${icon.tabBarTestID}`}
                                key={key}
                                keyProp={key}
                                onPress={onPress}
                            >
                                <AnimatedIconView
                                    testID={`tab_bar_icon_${icon.tabBarTestID}`}
                                    component={icon.tabBarAnimatedIcon}
                                    activeState={key === activeKey}
                                />
                            </SplitBottomTabBarItem>
                        );
                    }
                    return (
                        <SplitBottomTabBarItem
                            testID={`tab_bar_item_${icon.tabBarTestID}`}
                            key={key}
                            keyProp={key}
                            onPress={onPress}
                        >
                            <ImageIconView
                                testID={`tab_bar_icon_${icon.tabBarTestID}`}
                                activeSource={icon.tabBarActiveIcon}
                                disabledSource={icon.tabBarDisabledIcon}
                                activeState={key === activeKey}
                            />
                        </SplitBottomTabBarItem>
                    );
                })}
                {hasIconForActiveKey && (
                    <SplitBottomTabBarDot ref={dotRef} initialIndex={currentDotIndex} />
                )}
            </ShadowView>
        </View>
    );
}

const TAB_BAR_DEFAULT_BOTTOM_INSET = 32;
const TAB_BAR_HEIGHT = 64;
export function useTabBarHeight() {
    const insets = useSafeAreaInsets();
    const tabBarHeight = React.useMemo(() => {
        if (insets.bottom > 0) {
            return TAB_BAR_HEIGHT;
        }
        return TAB_BAR_DEFAULT_BOTTOM_INSET + TAB_BAR_HEIGHT;
    }, [insets.bottom]);
    const insetsWithTabBar = React.useMemo(
        () => ({ ...insets, bottom: tabBarHeight }),
        [insets, tabBarHeight],
    );
    return {
        tabBarHeight,
        insetsWithTabBar,
    };
}

const styles = StyleSheet.create({
    icon: { width: TAB_BAR_ICON_SIZE, height: TAB_BAR_ICON_SIZE },
    iconButton: {
        height: TAB_BAR_HEIGHT,
        width: TAB_BAR_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        bottom: TAB_BAR_DOT_BOTTOM,
        width: TAB_BAR_DOT_SIZE,
        height: TAB_BAR_DOT_SIZE,
        borderRadius: TAB_BAR_DOT_SIZE / 2,
    },
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
    iconsBox: {
        position: 'relative',
        flexDirection: 'row',
        borderRadius: TAB_BAR_HEIGHT / 2,
    },
});
