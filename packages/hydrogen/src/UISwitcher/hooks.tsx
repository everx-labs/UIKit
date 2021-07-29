import * as React from 'react';
import { View } from 'react-native';
import { UIAssets } from '@tonlabs/uikit.assets';
import type {
    GestureEvent,
    NativeViewGestureHandlerPayload,
} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {
    IconSwitcherState,
    PressSwitcherState,
    SwitcherState,
    UISwitcherVariant,
} from './types';
import { UIImage } from '../UIImage';
import { hapticSelection } from '../Haptics/Haptics';
import { ColorVariants, Theme } from '../Colors';
import { UIConstant } from '../constants';

const springConfig: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 500,
};

export const useImage = (variant: UISwitcherVariant, theme: Theme) => {
    switch (variant) {
        case UISwitcherVariant.Toggle:
            return (
                <View
                    style={{
                        width: UIConstant.switcher.toggleDotSize,
                        height: UIConstant.switcher.toggleDotSize,
                        borderRadius: UIConstant.switcher.toggleDotSize,
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    }}
                />
            );
        case UISwitcherVariant.Radio:
            return (
                <View
                    style={{
                        width: UIConstant.switcher.radioDotSize,
                        height: UIConstant.switcher.radioDotSize,
                        borderRadius: UIConstant.switcher.radioDotSize,
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    }}
                />
            );
        case UISwitcherVariant.Select:
        case UISwitcherVariant.Check:
        default:
            return (
                <UIImage
                    source={UIAssets.icons.ui.tickWhite}
                    style={{
                        width: UIConstant.switcher.thikIconSize,
                        height: UIConstant.switcher.thikIconSize,
                    }}
                />
            );
    }
};

export const useSwitcherGestureEvent = (onPress: (() => void) | undefined) => {
    const pressed = useSharedValue<PressSwitcherState>(
        PressSwitcherState.NotPressed,
    );

    const onGestureEvent = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onStart: () => {
            if (pressed.value !== PressSwitcherState.Pressed) {
                pressed.value = PressSwitcherState.Pressed;
            }
        },
        onActive: () => {
            if (pressed.value !== PressSwitcherState.Pressed) {
                pressed.value = PressSwitcherState.Pressed;
            }
        },
        onFinish: (event, _, isCanceledOrFailed: boolean) => {
            pressed.value = PressSwitcherState.NotPressed;
            if (!isCanceledOrFailed && event.pointerInside && onPress) {
                hapticSelection();
                runOnJS(onPress)();
            }
        },
    });
    return {
        onGestureEvent,
        pressed,
    };
};

export const useImageStyle = (
    active: boolean,
    switcherState: Readonly<Animated.SharedValue<SwitcherState>>,
    theme: Theme,
    variant: UISwitcherVariant,
) => {
    const iconSwitcherState = useSharedValue<IconSwitcherState>(
        IconSwitcherState.NotActive,
    );

    React.useEffect(() => {
        if (active && iconSwitcherState.value !== IconSwitcherState.Active) {
            iconSwitcherState.value = IconSwitcherState.Active;
        } else if (
            !active &&
            iconSwitcherState.value !== IconSwitcherState.NotActive
        ) {
            iconSwitcherState.value = IconSwitcherState.NotActive;
        }
    }, [active, iconSwitcherState]);

    const animatedValue = useDerivedValue(() => {
        return withSpring(iconSwitcherState.value, springConfig);
    });

    const imageOnStyle = useAnimatedStyle(() => {
        if (variant === UISwitcherVariant.Toggle) {
            return {
                transform: [
                    {
                        translateX: interpolate(
                            animatedValue.value,
                            [
                                IconSwitcherState.NotActive,
                                IconSwitcherState.Active,
                            ],
                            [
                                0,
                                UIConstant.switcher.toggleWidth -
                                    UIConstant.switcher.toggleDotSize -
                                    UIConstant.switcher.togglePadding*2,
                            ],
                        ),
                    },
                ],
            };
        }
        return {
            opacity: interpolate(
                animatedValue.value,
                [IconSwitcherState.NotActive, IconSwitcherState.Active],
                [0, 1],
            ),
        };
    });

    const toggleBackgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animatedValue.value,
                [IconSwitcherState.NotActive, IconSwitcherState.Active],
                [
                    theme[ColorVariants.BackgroundTertiaryInverted] as string,
                    theme[ColorVariants.BackgroundAccent] as string,
                ],
            ),
        };
    });

    const toggleOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                switcherState.value,
                [
                    SwitcherState.Active,
                    SwitcherState.Hovered,
                    SwitcherState.Pressed,
                ],
                [
                    theme[ColorVariants.Transparent] as string,
                    theme[ColorVariants.BackgroundOverlay] as string,
                    theme[ColorVariants.Transparent] as string,
                ],
            ),
        };
    });


    const imageOffOpacity = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                animatedValue.value,
                [IconSwitcherState.NotActive, IconSwitcherState.Active],
                [1, 0],
            ),
        };
    });

    const imageOffBorderColor = useAnimatedStyle(() => {
        return {
            borderColor: interpolateColor(
                switcherState.value,
                [
                    SwitcherState.Active,
                    SwitcherState.Hovered,
                    SwitcherState.Pressed,
                ],
                [
                    theme[ColorVariants.BackgroundTertiaryInverted] as string,
                    theme[ColorVariants.LineNeutral] as string,
                    theme[ColorVariants.LineNeutral] as string,
                ],
            ),
        };
    });

    return {
        imageOnStyle,
        imageOffOpacity,
        imageOffBorderColor,
        toggleBackgroundStyle,
        toggleOverlayStyle
    };
};

export const useSwitcherState = (
    isHovered: boolean,
    pressed: Animated.SharedValue<PressSwitcherState>,
) => {
    const switcherState = useDerivedValue<SwitcherState>(() => {
        if (pressed.value === PressSwitcherState.Pressed) {
            return withSpring(SwitcherState.Pressed, springConfig);
        }
        if (isHovered) {
            return withSpring(SwitcherState.Hovered, springConfig);
        }
        return withSpring(SwitcherState.Active, springConfig);
    }, [isHovered]);

    return switcherState;
};

export const useOverlayStyle = (
    switcherState: Readonly<Animated.SharedValue<SwitcherState>>,
    theme: Theme,
) => {
    const overlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                switcherState.value,
                [
                    SwitcherState.Active,
                    SwitcherState.Hovered,
                    SwitcherState.Pressed,
                ],
                [
                    theme[ColorVariants.BackgroundAccent] as string,
                    theme[ColorVariants.BackgroundAccent] as string,
                    theme[ColorVariants.StaticPressOverlay] as string,
                ],
            ),
        };
    });
    return overlayStyle;
};
