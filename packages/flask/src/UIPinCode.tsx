import * as React from 'react';
import {
    View,
    StyleSheet,
    Vibration,
    StyleProp,
    ViewStyle,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '@tonlabs/uikit.core';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    ColorVariants,
    UIImage,
    useColorParts,
} from '@tonlabs/uikit.hydrogen';

function hapticResponse() {
    // TODO: think to use https://docs.expo.io/versions/latest/sdk/haptics/
    Vibration.vibrate(40);
}

// eslint-disable-next-line no-shadow
export enum UIPinCodeBiometryType {
    Fingerprint = 'Fingerprint',
    Face = 'Face',
}

export const RawButton: React.FunctionComponent<Animated.AnimateProps<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>> = Animated.createAnimatedComponent(GHRawButton);

function useCircleAboveStyle(circleAnimProgress: Animated.SharedValue<number>) {
    const { colorParts } = useColorParts(ColorVariants.BackgroundSecondary);

    return useAnimatedStyle(() => {
        return {
            backgroundColor: Animated.interpolateColor(
                circleAnimProgress.value,
                [0, 1],
                [`rgba(${colorParts},1)`, `rgba(${colorParts},0)`],
            ),
            transform: [
                {
                    scale: Animated.interpolate(
                        circleAnimProgress.value,
                        [0, 1],
                        [0.7, 1],
                    ),
                },
            ],
        };
    });
}

const DotsContext = React.createContext<{
    activeDotIndex: Animated.SharedValue<number>;
    dotsValues: { current: Animated.SharedValue<number>[] };
    dotsAnims: { current: Animated.SharedValue<number>[] };
}>(
    // @ts-ignore
    {},
);

function Key({ num, disabled }: { num: number; disabled: boolean }) {
    const { activeDotIndex, dotsValues, dotsAnims } = React.useContext(
        DotsContext,
    );

    const circleAnimProgress = useSharedValue(1);

    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = 0;
        },
        onFinish: () => {
            if (activeDotIndex.value > 5) {
                return;
            }

            // A number was chosen
            dotsValues.current[activeDotIndex.value].value = num;
            dotsAnims.current[activeDotIndex.value].value = withSpring(1);
            activeDotIndex.value += 1;

            runOnJS(hapticResponse)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(1);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(1);
        },
    });

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID={`pincode_digit_${num}`}
            onGestureEvent={gestureHandler}
            style={[styles.button, disabled ? { opacity: 0.5 } : null]}
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

type BiometryProps = {
    isBiometryEnabled: boolean;
    biometryType?: UIPinCodeBiometryType;
    getPasscodeWithBiometry?: () => Promise<string>;
};

function BiometryKey({
    isBiometryEnabled,
    biometryType,
    getPasscodeWithBiometry,
}: BiometryProps) {
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
                dotsAnims.current[index].value = withSpring(1);
            });
            activeDotIndex.value = 6;
            return;
        }
        if (!isBiometryEnabled || getPasscodeWithBiometry == null) {
            return;
        }
        const passcode = await getPasscodeWithBiometry();

        dotsValues.current.forEach((_dot, index) => {
            dotsValues.current[index].value = Number(passcode[index]);
            dotsAnims.current[index].value = withSpring(1);
        });
        activeDotIndex.value = 6;
    }, [
        usePredefined,
        isBiometryEnabled,
        getPasscodeWithBiometry,
        dotsValues,
        dotsAnims,
        activeDotIndex,
    ]);

    const circleAnimProgress = useSharedValue(1);
    const gestureHandler = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = 0;
        },
        onFinish: () => {
            runOnJS(getPasscode)();
            runOnJS(hapticResponse)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(1);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(1);
        },
    });

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID="pincode_biometry"
            onGestureEvent={gestureHandler}
            style={styles.button}
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

function DelKey() {
    const { activeDotIndex, dotsValues, dotsAnims } = React.useContext(
        DotsContext,
    );

    const circleAnimProgress = useSharedValue(1);
    const circleAboveDelButtonStyle = useCircleAboveStyle(circleAnimProgress);
    const gestureHandlerDel = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = 0;
        },
        onFinish: () => {
            // Nothing to delete
            if (activeDotIndex.value <= 0) {
                return;
            }

            dotsValues.current[activeDotIndex.value - 1].value = -1;
            dotsAnims.current[activeDotIndex.value - 1].value = withSpring(0);
            activeDotIndex.value -= 1;

            runOnJS(hapticResponse)();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(1);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(1);
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
            onGestureEvent={gestureHandlerDel}
            style={[styles.button, delButtonStyle]}
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

function useAnimatedDot(
    num: number,
    dotsAnims: { current: Animated.SharedValue<number>[] },
) {
    const theme = useTheme();

    return useAnimatedStyle(() => {
        return {
            backgroundColor: Animated.interpolateColor(
                dotsAnims.current[num].value,
                [0, 1],
                [
                    theme[ColorVariants.BackgroundNeutral] as string,
                    theme[ColorVariants.BackgroundAccent] as string,
                ],
            ),
            transform: [
                // {
                //     translateX: Animated.interpolate(
                //         dotsAnims.current[num].value,
                //         [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                //         [0, -10, 10, -10, 10, -10, 0],
                //     ),
                // },
                {
                    scale: Animated.interpolate(
                        dotsAnims.current[num].value,
                        [0, 1],
                        [1, 2],
                    ),
                },
            ],
        };
    });
}

export function UIPinCode({
    label,
    labelTestID,
    description,
    descriptionTestID,
    disabled = false,
    isBiometryEnabled = true,
    biometryType,
    getPasscodeWithBiometry,
}: {
    label?: string;
    labelTestID?: string;
    description?: string;
    descriptionTestID?: string;
    disabled?: boolean;
} & BiometryProps) {
    const dotsValues = React.useRef([
        useSharedValue(-1),
        useSharedValue(-1),
        useSharedValue(-1),
        useSharedValue(-1),
        useSharedValue(-1),
        useSharedValue(-1),
    ]);
    const dotsAnims = React.useRef([
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
        useSharedValue(0),
    ]);
    const activeDotIndex = useSharedValue(0);

    const stylesDot1 = useAnimatedDot(0, dotsAnims);
    const stylesDot2 = useAnimatedDot(1, dotsAnims);
    const stylesDot3 = useAnimatedDot(2, dotsAnims);
    const stylesDot4 = useAnimatedDot(3, dotsAnims);
    const stylesDot5 = useAnimatedDot(4, dotsAnims);
    const stylesDot6 = useAnimatedDot(5, dotsAnims);

    useDerivedValue(() => {
        console.log(
            dotsValues.current
                .map((d) => d.value)
                .filter((val) => val !== -1)
                .join(''),
        );
    });

    const dotsContextValue = React.useMemo(
        () => ({
            activeDotIndex,
            dotsValues,
            dotsAnims,
        }),
        [activeDotIndex],
    );

    return (
        <>
            {label != null && (
                <UILabel
                    testID={labelTestID}
                    numberOfLines={1}
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.ParagraphText}
                    selectable={false}
                >
                    {label}
                </UILabel>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    height: UIConstant.bigCellHeight(),
                    alignItems: 'center',
                }}
            >
                <Animated.View style={[styles.dot, stylesDot1]} />
                <Animated.View style={[styles.dot, stylesDot2]} />
                <Animated.View style={[styles.dot, stylesDot3]} />
                <Animated.View style={[styles.dot, stylesDot4]} />
                <Animated.View style={[styles.dot, stylesDot5]} />
                <Animated.View style={[styles.dot, stylesDot6]} />
            </View>
            <UILabel
                testID={descriptionTestID}
                numberOfLines={1}
                color={UILabelColors.TextSecondary}
                role={UILabelRoles.ParagraphFootnote}
                selectable={false}
            >
                {description || ' '}
            </UILabel>
            <DotsContext.Provider value={dotsContextValue}>
                <View style={{ position: 'relative' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Key num={1} disabled={disabled} />
                        <Key num={2} disabled={disabled} />
                        <Key num={3} disabled={disabled} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Key num={4} disabled={disabled} />
                        <Key num={5} disabled={disabled} />
                        <Key num={6} disabled={disabled} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Key num={7} disabled={disabled} />
                        <Key num={8} disabled={disabled} />
                        <Key num={9} disabled={disabled} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <BiometryKey
                            isBiometryEnabled={isBiometryEnabled}
                            biometryType={biometryType}
                            getPasscodeWithBiometry={getPasscodeWithBiometry}
                        />
                        <Key num={0} disabled={disabled} />
                        <DelKey />
                    </View>
                </View>
            </DotsContext.Provider>
        </>
    );
}

const dotSize = UIConstant.tinyCellHeight();

const styles = StyleSheet.create({
    dot: {
        width: dotSize / 2,
        height: dotSize / 2,
        borderRadius: dotSize / 4,
        marginHorizontal: UIConstant.smallContentOffset(),
    },
    button: {
        width: 90, // 1 + 88 + 1
        height: 74, // 1 + 72 + 1
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    circleAbove: {
        position: 'absolute',
        left: 0,
        right: 0,
        aspectRatio: 1,
        borderRadius: 45,
    },
});
