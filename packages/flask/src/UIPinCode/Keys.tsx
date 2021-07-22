/* eslint-disable no-param-reassign */
import * as React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    interpolateColor,
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
    hapticSelection,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';

import { DotsContext } from './DotsContext';
import {
    CircleAnimationStatus,
    DotAnimationStatus,
    DOT_WITH_SPRING_CONFIG,
    KEY_HEIGHT,
    KEY_WIDTH,
    UIPinCodeBiometryType,
} from './constants';

function useCircleAboveStyle(circleAnimProgress: Animated.SharedValue<number>) {
    const { colorParts } = useColorParts(ColorVariants.BackgroundSecondary);

    return useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                circleAnimProgress.value,
                [CircleAnimationStatus.Active, CircleAnimationStatus.NotActive],
                [`rgba(${colorParts},1)`, `rgba(${colorParts},0)`],
            ),
            transform: [
                {
                    scale: interpolate(
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

export function Key({ num }: { num: number }) {
    const {
        activeDotIndex,
        dotsValues,
        dotsAnims,
        dotsCount,
        disabled,
    } = React.useContext(DotsContext);

    const circleAnimProgress = useSharedValue(CircleAnimationStatus.NotActive);

    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = CircleAnimationStatus.Active;
        },
        onFinish: () => {
            if (activeDotIndex.value > dotsCount - 1) {
                return;
            }

            // A number was chosen
            dotsValues.current[activeDotIndex.value].value = num;
            dotsAnims.current[activeDotIndex.value].value = withSpring(
                DotAnimationStatus.Active,
                DOT_WITH_SPRING_CONFIG,
            );
            activeDotIndex.value += 1;

            hapticSelection();
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
    getPasscodeWithBiometry?: (options?: {
        skipSettings?: boolean;
    }) => Promise<string | undefined>;
};

export function useBiometryPasscode({
    isBiometryEnabled,
    getPasscodeWithBiometry,
    dotsValues,
    dotsAnims,
    activeDotIndex,
    dotsCount,
}: BiometryProps & {
    dotsValues: { current: Animated.SharedValue<number>[] };
    dotsAnims: { current: Animated.SharedValue<number>[] };
    activeDotIndex: Animated.SharedValue<number>;
    dotsCount: number;
}) {
    const usePredefined =
        !isBiometryEnabled && process.env.NODE_ENV === 'development';

    const getPasscode = React.useCallback(
        async (options?: {
            skipSettings?: boolean;
            skipPredefined?: boolean;
        }) => {
            if (usePredefined) {
                if (options?.skipPredefined) {
                    return;
                }

                dotsValues.current.forEach((_dot, index) => {
                    dotsValues.current[index].value = 1;
                    dotsAnims.current[index].value = withSpring(
                        DotAnimationStatus.Active,
                        DOT_WITH_SPRING_CONFIG,
                    );
                });
                activeDotIndex.value = dotsCount;
                return;
            }

            if (!isBiometryEnabled || getPasscodeWithBiometry == null) {
                return;
            }
            const passcode = await getPasscodeWithBiometry(options);

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
            activeDotIndex.value = dotsCount;
        },
        [
            usePredefined,
            isBiometryEnabled,
            getPasscodeWithBiometry,
            dotsValues,
            dotsAnims,
            activeDotIndex,
            dotsCount,
        ],
    );

    return {
        usePredefined,
        getPasscode,
    };
}

export function BiometryKey({
    isBiometryEnabled,
    biometryType,
    getPasscodeWithBiometry,
}: BiometryProps) {
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

    const {
        activeDotIndex,
        dotsValues,
        dotsAnims,
        dotsCount,
        disabled,
    } = React.useContext(DotsContext);

    const { usePredefined, getPasscode } = useBiometryPasscode({
        isBiometryEnabled,
        getPasscodeWithBiometry,
        dotsValues,
        dotsAnims,
        activeDotIndex,
        dotsCount,
    });

    const circleAnimProgress = useSharedValue(CircleAnimationStatus.NotActive);
    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = CircleAnimationStatus.Active;
        },
        onFinish: () => {
            hapticSelection();
            runOnJS(getPasscode)();
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

export function DelKey() {
    const {
        activeDotIndex,
        dotsValues,
        dotsAnims,
        disabled,
    } = React.useContext(DotsContext);

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

            hapticSelection();
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
