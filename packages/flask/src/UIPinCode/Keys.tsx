import * as React from 'react';
import { StyleProp, Vibration, ViewStyle, StyleSheet } from 'react-native';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import {
    ColorVariants,
    UIImage,
    UILabel,
    UILabelColors,
    UILabelRoles,
    useColorParts,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';

import { DotsContext } from './DotsContext';
import {
    CircleAnimationStatus,
    DotAnimationStatus,
    DOTS_COUNT,
    DOT_WITH_SPRING_CONFIG,
    KEY_HAPTIC_VIBRATION_DURATION,
    KEY_HEIGHT,
    KEY_WIDTH,
    UIPinCodeBiometryType,
} from './constants';

function hapticResponse() {
    // TODO: think to use https://docs.expo.io/versions/latest/sdk/haptics/
    Vibration.vibrate(KEY_HAPTIC_VIBRATION_DURATION);
}

function useCircleAboveStyle(circleAnimProgress: Animated.SharedValue<number>) {
    const { colorParts } = useColorParts(ColorVariants.BackgroundSecondary);

    return useAnimatedStyle(() => {
        return {
            backgroundColor: Animated.interpolateColor(
                circleAnimProgress.value,
                [CircleAnimationStatus.Active, CircleAnimationStatus.NotActive],
                [`rgba(${colorParts},1)`, `rgba(${colorParts},0)`],
            ),
            transform: [
                {
                    scale: Animated.interpolate(
                        circleAnimProgress.value,
                        [
                            CircleAnimationStatus.Active,
                            CircleAnimationStatus.NotActive,
                        ],
                        [0.8, 1],
                    ),
                },
            ],
        };
    });
}

export const RawButton: React.FunctionComponent<Animated.AnimateProps<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>> = Animated.createAnimatedComponent(GHRawButton);

export function Key({ num, disabled }: { num: number; disabled: boolean }) {
    const { activeDotIndex, dotsValues, dotsAnims } = React.useContext(
        DotsContext,
    );

    const circleAnimProgress = useSharedValue(CircleAnimationStatus.NotActive);

    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = CircleAnimationStatus.Active;
        },
        onFinish: () => {
            if (activeDotIndex.value > 5) {
                return;
            }

            // A number was chosen
            dotsValues.current[activeDotIndex.value].value = num;
            dotsAnims.current[activeDotIndex.value].value = withSpring(
                DotAnimationStatus.Active,
                DOT_WITH_SPRING_CONFIG,
            );
            activeDotIndex.value += 1;

            runOnJS(hapticResponse)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(
                CircleAnimationStatus.NotActive,
            );
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(
                CircleAnimationStatus.NotActive,
            );
        },
    });

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID={`pincode_digit_${num}`}
            onGestureEvent={disabled ? undefined : gestureHandler}
            style={[styles.button, disabled ? styles.disabledKey : null]}
        >
            <Animated.View
                style={[styles.circleAbove, circleAboveButtonStyle]}
            />
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.LightHuge}
            >
                {num}
            </UILabel>
        </RawButton>
    );
}

export type BiometryProps = {
    isBiometryEnabled: boolean;
    biometryType?: UIPinCodeBiometryType;
    getPasscodeWithBiometry?: () => Promise<string | undefined>;
};

export function BiometryKey({
    isBiometryEnabled,
    biometryType,
    getPasscodeWithBiometry,
    disabled,
}: BiometryProps & { disabled: boolean }) {
    const usePredefined =
        !isBiometryEnabled && process.env.NODE_ENV === 'development';

    let icon = null;
    if (biometryType && getPasscodeWithBiometry != null) {
        icon = (
            <UIImage
                source={
                    biometryType === UIPinCodeBiometryType.Face
                        ? UIAssets.icons.security.faceId
                        : UIAssets.icons.security.touchId
                }
                tintColor={ColorVariants.TextPrimary}
            />
        );
    }

    const { activeDotIndex, dotsValues, dotsAnims } = React.useContext(
        DotsContext,
    );

    const getPasscode = React.useCallback(async () => {
        if (usePredefined) {
            dotsValues.current.forEach((_dot, index) => {
                dotsValues.current[index].value = 1;
                dotsAnims.current[index].value = withSpring(
                    DotAnimationStatus.Active,
                    DOT_WITH_SPRING_CONFIG,
                );
            });
            activeDotIndex.value = DOTS_COUNT;
            return;
        }
        if (!isBiometryEnabled || getPasscodeWithBiometry == null) {
            return;
        }
        const passcode = await getPasscodeWithBiometry();

        if (passcode == null) {
            return;
        }

        dotsValues.current.forEach((_dot, index) => {
            dotsValues.current[index].value = Number(passcode[index]);
            dotsAnims.current[index].value = withSpring(
                DotAnimationStatus.Active,
                DOT_WITH_SPRING_CONFIG,
            );
        });
        activeDotIndex.value = DOTS_COUNT;
    }, [
        usePredefined,
        isBiometryEnabled,
        getPasscodeWithBiometry,
        dotsValues,
        dotsAnims,
        activeDotIndex,
    ]);

    const circleAnimProgress = useSharedValue(CircleAnimationStatus.NotActive);
    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = CircleAnimationStatus.Active;
        },
        onFinish: () => {
            runOnJS(getPasscode)();
            runOnJS(hapticResponse)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(
                CircleAnimationStatus.NotActive,
            );
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(
                CircleAnimationStatus.NotActive,
            );
        },
    });

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID="pincode_biometry"
            onGestureEvent={disabled ? undefined : gestureHandler}
            style={[styles.button, disabled ? styles.disabledKey : null]}
        >
            <Animated.View
                style={[styles.circleAbove, circleAboveButtonStyle]}
            />
            {usePredefined ? (
                <UILabel
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.ActionFootnote}
                >
                    DEV
                </UILabel>
            ) : (
                icon
            )}
        </RawButton>
    );
}

export function DelKey({ disabled }: { disabled: boolean }) {
    const { activeDotIndex, dotsValues, dotsAnims } = React.useContext(
        DotsContext,
    );

    const circleAnimProgress = useSharedValue(CircleAnimationStatus.NotActive);
    const circleAboveDelButtonStyle = useCircleAboveStyle(circleAnimProgress);
    const gestureHandlerDel = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = CircleAnimationStatus.Active;
        },
        onFinish: () => {
            // Nothing to delete
            if (activeDotIndex.value <= 0) {
                return;
            }

            dotsValues.current[activeDotIndex.value - 1].value = -1;
            dotsAnims.current[activeDotIndex.value - 1].value = withSpring(
                DotAnimationStatus.NotActive,
                DOT_WITH_SPRING_CONFIG,
            );
            activeDotIndex.value -= 1;

            runOnJS(hapticResponse)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(
                CircleAnimationStatus.NotActive,
            );
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(
                CircleAnimationStatus.NotActive,
            );
        },
    });

    const delButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: activeDotIndex.value > 0 ? 1 : 0.5,
        };
    });

    return (
        <RawButton
            testID="pincode_digit_delete"
            onGestureEvent={disabled ? undefined : gestureHandlerDel}
            style={[
                styles.button,
                delButtonStyle,
                disabled ? styles.disabledKey : null,
            ]}
        >
            <Animated.View
                style={[styles.circleAbove, circleAboveDelButtonStyle]}
            />
            <UIImage
                source={UIAssets.icons.ui.delete}
                tintColor={ColorVariants.TextPrimary}
            />
        </RawButton>
    );
}

const styles = StyleSheet.create({
    button: {
        width: KEY_WIDTH,
        height: KEY_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    circleAbove: {
        position: 'absolute',
        left: (KEY_WIDTH - KEY_HEIGHT) / 2,
        top: 0,
        width: KEY_HEIGHT,
        height: KEY_HEIGHT,
        borderRadius: KEY_HEIGHT / 2,
        // Important for web, to not cover a number label
        zIndex: -1,
    },
    disabledKey: { opacity: 0.5 },
});
