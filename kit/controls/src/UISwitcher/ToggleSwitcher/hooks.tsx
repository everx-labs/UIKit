import * as React from 'react';
import type {
    GestureEvent,
    PanGestureHandlerGestureEvent,
    TapGestureHandlerEventPayload,
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
import { clamp, snapPoint } from 'react-native-redash';
import { IconSwitcherState, PressSwitcherState, SwitcherState } from '../types';
import { hapticSelection } from '../../Haptics/Haptics';
import { ColorVariants, Theme } from '@tonlabs/uikit.themes';
import { UIConstant } from '../../constants';

const springConfig: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 500,
};

export const useSwitcherGestureEvent = (onPress: (() => void) | undefined) => {
    const pressed = useSharedValue<PressSwitcherState>(PressSwitcherState.NotPressed);

    const onGestureEvent = useAnimatedGestureHandler<GestureEvent<TapGestureHandlerEventPayload>>({
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
        onFinish: (_event, _, isCanceledOrFailed: boolean) => {
            pressed.value = PressSwitcherState.NotPressed;
            if (!isCanceledOrFailed && onPress) {
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
    theme: Theme,
    onPress?: (() => void) | undefined,
) => {
    const iconSwitcherState = useSharedValue<IconSwitcherState>(IconSwitcherState.NotActive);

    React.useEffect(() => {
        if (active && iconSwitcherState.value !== IconSwitcherState.Active) {
            iconSwitcherState.value = IconSwitcherState.Active;
        } else if (!active && iconSwitcherState.value !== IconSwitcherState.NotActive) {
            iconSwitcherState.value = IconSwitcherState.NotActive;
        }
    }, [active, iconSwitcherState]);

    const animatedValue = useDerivedValue(() => {
        return withSpring(iconSwitcherState.value, springConfig);
    });

    const toggleImageOnStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        animatedValue.value,
                        [IconSwitcherState.NotActive, IconSwitcherState.Active],
                        [
                            0,
                            UIConstant.switcher.toggleWidth -
                                UIConstant.switcher.toggleDotSize -
                                UIConstant.switcher.togglePadding * 2,
                        ],
                    ),
                },
            ],
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

    const panGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { x: number }
    >({
        onStart: (_e, ctx) => {
            ctx.x = iconSwitcherState.value;
        },
        onActive: ({ translationX }) => {
            iconSwitcherState.value = clamp(translationX, 0, 1);
        },
        onEnd: ({ velocityX }) => {
            const selectedSnapPoint = snapPoint(iconSwitcherState.value, velocityX, [0, 1]);
            iconSwitcherState.value = withSpring(selectedSnapPoint);
        },
        onFinish: (_e, _, isCanceledOrFailed: boolean) => {
            if (!isCanceledOrFailed && onPress) {
                hapticSelection();
                runOnJS(onPress)();
            }
        },
    });

    return {
        toggleBackgroundStyle,
        toggleImageOnStyle,
        panGestureHandler,
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
                [SwitcherState.Active, SwitcherState.Hovered, SwitcherState.Pressed],
                [
                    theme[ColorVariants.Transparent] as string,
                    theme[ColorVariants.StaticHoverOverlay] as string,
                    theme[ColorVariants.StaticPressOverlay] as string,
                ],
            ),
        };
    });
    return overlayStyle;
};
