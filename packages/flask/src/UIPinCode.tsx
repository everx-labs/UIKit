import * as React from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
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
    RawButton as GHRawButton,
} from 'react-native-gesture-handler';

import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

function hapticResponse() {
    // TODO: think to use https://docs.expo.io/versions/latest/sdk/haptics/
    Vibration.vibrate(40);
}

export const RawButton = Animated.createAnimatedComponent(GHRawButton);

function useKey(
    num: number,
    dotsValues: React.RefObject<Animated.SharedValue<number>[]>,
    dotsAnims: React.RefObject<Animated.SharedValue<number>[]>,
    activeDotIndex: Animated.SharedValue<number>,
) {
    return useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
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
    });
}
function useAnimatedDot(
    num: number,
    dotsAnims: React.RefObject<Animated.SharedValue<number>[]>,
) {
    const theme = useTheme();

    return useAnimatedStyle(() => {
        return {
            backgroundColor: Animated.interpolateColor(
                dotsAnims.current[num].value,
                [0, 1],
                [
                    theme[ColorVariants.BackgroundTertiary] as string,
                    theme[ColorVariants.BackgroundAccent] as string,
                ],
            ),
            // transform: [
            //     {
            //         translateX: Animated.interpolate(
            //             dotsAnims.current[num].value,
            //             [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
            //             [0, -10, 10, -10, 10, -10, 0],
            //         ),
            //     },
            // ],
        };
    });
}

export function UIPinCode() {
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

    const gestureHandler1 = useKey(1, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler2 = useKey(2, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler3 = useKey(3, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler4 = useKey(4, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler5 = useKey(5, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler6 = useKey(6, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler7 = useKey(7, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler8 = useKey(8, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler9 = useKey(9, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandler0 = useKey(0, dotsValues, dotsAnims, activeDotIndex);
    const gestureHandlerDel = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
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
    });

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

    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <Animated.View style={[styles.circle, stylesDot1]} />
                <Animated.View style={[styles.circle, stylesDot2]} />
                <Animated.View style={[styles.circle, stylesDot3]} />
                <Animated.View style={[styles.circle, stylesDot4]} />
                <Animated.View style={[styles.circle, stylesDot5]} />
                <Animated.View style={[styles.circle, stylesDot6]} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <RawButton
                    onGestureEvent={gestureHandler1}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        1
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler2}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        2
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler3}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        3
                    </UILabel>
                </RawButton>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <RawButton
                    onGestureEvent={gestureHandler4}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        4
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler5}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        5
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler6}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        6
                    </UILabel>
                </RawButton>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <RawButton
                    onGestureEvent={gestureHandler7}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        7
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler8}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        8
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler9}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        9
                    </UILabel>
                </RawButton>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <RawButton
                    // ref={ref7}
                    // onGestureEvent={gestureHandler}
                    style={styles.button}
                >
                    {/* <UILabel>7</UILabel> */}
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandler0}
                    style={styles.button}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.LightHuge}
                    >
                        0
                    </UILabel>
                </RawButton>
                <RawButton
                    onGestureEvent={gestureHandlerDel}
                    style={styles.button}
                >
                    <UILabel>Del</UILabel>
                </RawButton>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    circle: { width: 10, height: 10, borderRadius: 5 },
    button: {
        width: 90, // 1 + 88 + 1
        height: 74, // 1 + 72 + 1
        alignItems: 'center',
        justifyContent: 'center',
    },
});
