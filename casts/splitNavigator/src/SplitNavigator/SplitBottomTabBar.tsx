import * as React from 'react';
import { View, Animated, ImageSourcePropType, ImageRequireSource } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIImage } from '@tonlabs/uikit.media';
import { useTheme, ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { hapticSelection } from '@tonlabs/uikit.controls';

export type SplitScreenTabBarIconOptions =
    | {
          tabBarActiveIcon: ImageSourcePropType;
          tabBarDisabledIcon: ImageSourcePropType;
      }
    | {
          tabBarIconLottieSource: ImageRequireSource;
      };

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
                {hasIconForActiveKey && (
                    <SplitBottomTabBarDot ref={dotRef} initialIndex={initialDotIndex.current} />
                )}
            </UIBackgroundView>
        </View>
    );
}
