import * as React from 'react';
import { View, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
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
import { useTheme, ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { hapticSelection } from '@tonlabs/uikit.controls';

type SplitScreenTabBarAnimatedIconComponent = React.ComponentType<{
    progress: ReAnimated.SharedValue<number>;
    style?: StyleProp<ViewStyle>;
}>;

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

    return (
        <Comp
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
        <RawButton
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
        </RawButton>
    );
}
type SplitBottomTabBarDotRef = { moveTo(index: number): void };
type SplitBottomTabBarDotProps = { initialIndex: number };
const SplitBottomTabBarDot = React.memo(
    React.forwardRef<SplitBottomTabBarDotRef, SplitBottomTabBarDotProps>(
        function SplitBottomTabBarDot({ initialIndex }: SplitBottomTabBarDotProps, ref) {
            const theme = useTheme();
            const position = useSharedValue((initialIndex + 1) * 64 - 32 - 4 / 2);
            React.useImperativeHandle(ref, () => ({
                moveTo(index: number) {
                    position.value = withSpring((index + 1) * 64 - 32 - 4 / 2, {
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
    const hasIconForActiveKey = React.useMemo(() => {
        const iconsArr = Object.keys(icons);
        for (let i = 0; i < iconsArr.length; i += 1) {
            if (iconsArr[i] === activeKey) {
                return true;
            }
        }
        return false;
    }, [icons, activeKey]);

    /**
     * Do not show tab bar when there're only
     * 0 or 1 icon available, as it won't do anything useful anyway
     */
    if (Object.keys(icons).length < 2) {
        return null;
    }

    return (
        <View
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
            <UIBackgroundView
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
            </UIBackgroundView>
        </View>
    );
}
