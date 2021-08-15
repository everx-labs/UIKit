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
    DOT_WITH_SPRING_CONFIG,
    KEY_HEIGHT,
    KEY_WIDTH,
    UIPinCodeBiometryType,
} from './constants';

type CircleAnimationStatus =
    | /** Active */ 0
    | /** NotActive */ 1
    | /** Filler (just to put it in column) */ -100
    | number;

function useCircleAboveStyle(
    circleAnimProgress: Animated.SharedValue<CircleAnimationStatus>,
) {
    const { colorParts } = useColorParts(ColorVariants.BackgroundSecondary);
    const circleColorTransparent = `rgba(${colorParts},1)`;
    const circleColorOpaque = `rgba(${colorParts},0)`;

    return useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                circleAnimProgress.value,
                [/** Active */ 0, /** NotActive */ 1],
                [circleColorTransparent, circleColorOpaque],
            ),
            transform: [
                {
                    scale: interpolate(
                        circleAnimProgress.value,
                        [/** Active */ 0, /** NotActive */ 1],
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

    const circleAnimProgress = useSharedValue(/** NotActive */ 1);

    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = /** Active */ 0;
        },
        onFinish: () => {
            if (activeDotIndex.value > dotsCount - 1) {
                return;
            }

            // A number was chosen
            dotsValues[activeDotIndex.value].value = num;
            dotsAnims[activeDotIndex.value].value = withSpring(
                /** Active */ 1,
                DOT_WITH_SPRING_CONFIG,
            );
            activeDotIndex.value += 1;

            hapticSelection();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(/** NotActive */ 1);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(/** NotActive */ 1);
        },
    });

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID={`pincode_digit_${num}`}
            enabled={!disabled}
            onGestureEvent={gestureHandler}
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
    dotsValues: Animated.SharedValue<number>[];
    dotsAnims: Animated.SharedValue<number>[];
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

                dotsValues.forEach((_dot, index) => {
                    dotsValues[index].value = 1;
                    dotsAnims[index].value = withSpring(
                        /** Active */ 1,
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

            dotsValues.forEach((_dot, index) => {
                dotsValues[index].value = Number(passcode[index]);
                dotsAnims[index].value = withSpring(
                    /** Active */ 1,
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

    const circleAnimProgress = useSharedValue(/** NotActive */ 1);
    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = /** Active */ 0;
        },
        onFinish: () => {
            hapticSelection();
            runOnJS(getPasscode)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(/** NotActive */ 1);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(/** NotActive */ 1);
        },
    });

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID="pincode_biometry"
            enabled={!disabled}
            onGestureEvent={gestureHandler}
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

    const circleAnimProgress = useSharedValue(/** NotActive */ 1);
    const circleAboveDelButtonStyle = useCircleAboveStyle(circleAnimProgress);
    const gestureHandlerDel = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = /** Active */ 0;
        },
        onFinish: () => {
            // Nothing to delete
            if (activeDotIndex.value <= 0) {
                return;
            }

            dotsValues[activeDotIndex.value - 1].value = -1;
            dotsAnims[activeDotIndex.value - 1].value = withSpring(
                /** NotActive */ 0,
                DOT_WITH_SPRING_CONFIG,
            );
            activeDotIndex.value -= 1;

            hapticSelection();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(/** NotActive */ 1);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(/** NotActive */ 1);
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
            enabled={!disabled}
            onGestureEvent={gestureHandlerDel}
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
