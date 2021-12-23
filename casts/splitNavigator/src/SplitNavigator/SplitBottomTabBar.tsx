/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { View, ImageSourcePropType, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import ReAnimated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIImage } from '@tonlabs/uikit.media';
import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';
import { hapticSelection } from '@tonlabs/uikit.controls';
import { ShadowView } from './ShadowView';

export type SplitScreenTabBarAnimatedIconComponentProps = {
    progress: ReAnimated.SharedValue<number>;
    style?: StyleProp<ViewStyle>;
};
type SplitScreenTabBarAnimatedIconComponent =
    React.ComponentType<SplitScreenTabBarAnimatedIconComponentProps>;

export type SplitScreenTabBarIconOptions =
    | {
          tabBarActiveIcon: ImageSourcePropType;
          tabBarDisabledIcon: ImageSourcePropType;
      }
    | {
          tabBarAnimatedIcon: SplitScreenTabBarAnimatedIconComponent;
      };

// @inline
const ANIMATED_ICON_INACTIVE = 0;
// @inline
const ANIMATED_ICON_ACTIVE = 1;
const TAB_BAR_ICON_SIZE = 22;

type AnimatedIconViewProps = {
    activeState: boolean;
    component: SplitScreenTabBarAnimatedIconComponent;
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
};
function ImageIconView({ activeState, activeSource, disabledSource }: ImageIconViewProps) {
    return <UIImage source={activeState ? activeSource : disabledSource} style={styles.icon} />;
}

export const RawButton: React.FunctionComponent<
    ReAnimated.AnimateProps<
        RawButtonProps &
            NativeViewGestureHandlerProps & {
                testID?: string;
                style?: StyleProp<ViewStyle>;
            }
    >
> = ReAnimated.createAnimatedComponent(GHRawButton);

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
        <RawButton enabled onGestureEvent={gestureHandler} style={styles.iconButton}>
            {children}
        </RawButton>
    );
}

const TAB_BAR_DOT_SIZE = 4;
const TAB_BAR_DOT_BOTTOM = 8;

type SplitBottomTabBarDotRef = { moveTo(index: number): void };
type SplitBottomTabBarDotProps = { initialIndex: number };
const SplitBottomTabBarDot = React.memo(
    React.forwardRef<SplitBottomTabBarDotRef, SplitBottomTabBarDotProps>(
        function SplitBottomTabBarDot({ initialIndex }: SplitBottomTabBarDotProps, ref) {
            const theme = useTheme();
            const position = useSharedValue(
                (initialIndex + 1) * TAB_BAR_HEIGHT - TAB_BAR_HEIGHT / 2 - TAB_BAR_DOT_SIZE / 2,
            );
            React.useImperativeHandle(ref, () => ({
                moveTo(index: number) {
                    position.value = withSpring(
                        (index + 1) * TAB_BAR_HEIGHT - TAB_BAR_HEIGHT / 2 - TAB_BAR_DOT_SIZE / 2,
                        {
                            overshootClamping: true,
                        },
                    );
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
    const initialDotIndex = React.useRef(-1);

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

    if (initialDotIndex.current === -1 && iconsMap[activeKey] != null) {
        initialDotIndex.current = iconsMap[activeKey];
    }

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
                    {
                        shadowColor: theme[ColorVariants.Shadow],
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                ]}
            >
                {Object.keys(icons).map(key => {
                    const icon = icons[key];
                    if ('tabBarAnimatedIcon' in icon) {
                        return (
                            <SplitBottomTabBarItem key={key} keyProp={key} onPress={onPress}>
                                <AnimatedIconView
                                    component={icon.tabBarAnimatedIcon}
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
                {hasIconForActiveKey && (
                    <SplitBottomTabBarDot ref={dotRef} initialIndex={initialDotIndex.current} />
                )}
            </ShadowView>
        </View>
    );
}

const TAB_BAR_DEFAULT_BOTTOM_INSET = 32;
const TAB_BAR_HEIGHT = 64;
export function useTabBarHeight() {
    const insets = useSafeAreaInsets();
    const tabBarHeight = React.useMemo(
        () => Math.max(insets.bottom, TAB_BAR_DEFAULT_BOTTOM_INSET) + TAB_BAR_HEIGHT,
        [insets.bottom],
    );
    const insetsWithTabBar = React.useMemo(
        () => ({ ...insets, bottom: insets.bottom + tabBarHeight }),
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
        shadowRadius: 48,
        shadowOffset: {
            width: 0,
            height: 16,
        },
        shadowOpacity: 0.08,
    },
});
