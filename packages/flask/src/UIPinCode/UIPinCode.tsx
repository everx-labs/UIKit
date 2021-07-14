import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useDerivedValue,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import { DotsContext } from './DotsContext';
import { BiometryKey, BiometryProps, DelKey, Key } from './Keys';
import {
    DotAnimationStatus,
    DOTS_COUNT,
    DOTS_STATE_PRESENTATION_DURATION,
    DOT_WITH_SPRING_CONFIG,
    ShakeAnimationStatus,
    ValidationState,
} from './constants';

function useAnimatedDot(
    index: number,
    dotsAnims: { current: Animated.SharedValue<number>[] },
    validState: Animated.SharedValue<ValidationState>,
) {
    const theme = useTheme();

    /**
     * Styles has to be separated and applied to different views
     * to work properly on web
     */
    const outterStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: dotsAnims.current[index].value + 1,
                },
            ],
        };
    });

    const innerStyle = useAnimatedStyle(() => {
        let color = ColorVariants.BackgroundAccent;
        if (validState.value === ValidationState.Success) {
            color = ColorVariants.BackgroundPositive;
        } else if (validState.value === ValidationState.Error) {
            color = ColorVariants.BackgroundNegative;
        }

        return {
            backgroundColor: Animated.interpolateColor(
                dotsAnims.current[index].value,
                [DotAnimationStatus.NotActive, DotAnimationStatus.Active],
                [
                    theme[ColorVariants.BackgroundNeutral] as string,
                    theme[color] as string,
                ],
            ),
        };
    });

    return [outterStyle, innerStyle];
}

export function UIPinCode({
    label,
    labelTestID,
    description,
    descriptionTestID,
    disabled = false,
    onEnter,
    onSuccess,
    isBiometryEnabled = true,
    biometryType,
    getPasscodeWithBiometry,
}: {
    label?: string;
    labelTestID?: string;
    description?: string;
    descriptionTestID?: string;
    disabled?: boolean;
    onEnter: (pin: string) => Promise<boolean>;
    onSuccess: (pin: string) => void;
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
        useSharedValue(DotAnimationStatus.NotActive),
        useSharedValue(DotAnimationStatus.NotActive),
        useSharedValue(DotAnimationStatus.NotActive),
        useSharedValue(DotAnimationStatus.NotActive),
        useSharedValue(DotAnimationStatus.NotActive),
        useSharedValue(DotAnimationStatus.NotActive),
    ]);
    const activeDotIndex = useSharedValue(0);
    const validState = useSharedValue(ValidationState.None);
    const shakeAnim = useSharedValue(0);

    const [outterStylesDot1, innerStylesDot1] = useAnimatedDot(
        0,
        dotsAnims,
        validState,
    );
    const [outterStylesDot2, innerStylesDot2] = useAnimatedDot(
        1,
        dotsAnims,
        validState,
    );
    const [outterStylesDot3, innerStylesDot3] = useAnimatedDot(
        2,
        dotsAnims,
        validState,
    );
    const [outterStylesDot4, innerStylesDot4] = useAnimatedDot(
        3,
        dotsAnims,
        validState,
    );
    const [outterStylesDot5, innerStylesDot5] = useAnimatedDot(
        4,
        dotsAnims,
        validState,
    );
    const [outterStylesDot6, innerStylesDot6] = useAnimatedDot(
        5,
        dotsAnims,
        validState,
    );

    const validatePin = React.useCallback(
        (pin: string) => {
            onEnter(pin).then((isValid) => {
                validState.value = isValid
                    ? ValidationState.Success
                    : ValidationState.Error;

                if (!isValid) {
                    shakeAnim.value = ShakeAnimationStatus.NotActive;
                    shakeAnim.value = withSpring(
                        ShakeAnimationStatus.Active,
                        DOT_WITH_SPRING_CONFIG,
                    );
                }

                setTimeout(() => {
                    dotsValues.current.forEach((_dot, index) => {
                        dotsValues.current[index].value = -1;
                        dotsAnims.current[index].value = withSpring(
                            DotAnimationStatus.NotActive,
                            DOT_WITH_SPRING_CONFIG,
                        );
                    });
                    activeDotIndex.value = 0;
                    validState.value = ValidationState.None;

                    if (isValid) {
                        onSuccess(pin);
                    }
                }, DOTS_STATE_PRESENTATION_DURATION);
            });
        },
        [onEnter, validState, activeDotIndex, shakeAnim, onSuccess],
    );

    useDerivedValue(() => {
        const pin = dotsValues.current
            .map((d) => d.value)
            .filter((val) => val !== -1)
            .join('');

        if (pin.length === DOTS_COUNT) {
            runOnJS(validatePin)(pin);
        }
    }, [dotsValues]);

    const dotsContextValue = React.useMemo(
        () => ({
            activeDotIndex,
            dotsValues,
            dotsAnims,
        }),
        [activeDotIndex],
    );

    const shakeStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: Animated.interpolate(
                        shakeAnim.value,
                        [0, 0.25, 0.5, 0.75, 1],
                        [0, -10, 10, -10, 0],
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.upperSpacer} />
            <View style={styles.inner}>
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
                <Animated.View style={[styles.dotsContainer, shakeStyle]}>
                    <Animated.View style={[styles.dot, outterStylesDot1]}>
                        <Animated.View
                            style={[styles.dotInner, innerStylesDot1]}
                        />
                    </Animated.View>
                    <Animated.View style={[styles.dot, outterStylesDot2]}>
                        <Animated.View
                            style={[styles.dotInner, innerStylesDot2]}
                        />
                    </Animated.View>
                    <Animated.View style={[styles.dot, outterStylesDot3]}>
                        <Animated.View
                            style={[styles.dotInner, innerStylesDot3]}
                        />
                    </Animated.View>
                    <Animated.View style={[styles.dot, outterStylesDot4]}>
                        <Animated.View
                            style={[styles.dotInner, innerStylesDot4]}
                        />
                    </Animated.View>
                    <Animated.View style={[styles.dot, outterStylesDot5]}>
                        <Animated.View
                            style={[styles.dotInner, innerStylesDot5]}
                        />
                    </Animated.View>
                    <Animated.View style={[styles.dot, outterStylesDot6]}>
                        <Animated.View
                            style={[styles.dotInner, innerStylesDot6]}
                        />
                    </Animated.View>
                </Animated.View>
                <UILabel
                    testID={descriptionTestID}
                    numberOfLines={1}
                    color={UILabelColors.TextSecondary}
                    role={UILabelRoles.ParagraphFootnote}
                    selectable={false}
                >
                    {description || ' '}
                </UILabel>
                <View style={styles.space} />
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
                                getPasscodeWithBiometry={
                                    getPasscodeWithBiometry
                                }
                                disabled={disabled}
                            />
                            <Key num={0} disabled={disabled} />
                            <DelKey disabled={disabled} />
                        </View>
                    </View>
                </DotsContext.Provider>
            </View>
            <View style={styles.bottomSpacer} />
        </View>
    );
}

const dotSize = UIConstant.tinyCellHeight();

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperSpacer: {
        flex: 3,
    },
    inner: {
        flex: 10,
        alignItems: 'center',
    },
    bottomSpacer: {
        flex: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        height: UIConstant.bigCellHeight(),
        alignItems: 'center',
    },
    dot: {
        width: dotSize / 2,
        height: dotSize / 2,
        borderRadius: dotSize / 4,
        marginHorizontal: UIConstant.normalContentOffset(),
    },
    dotInner: {
        width: dotSize / 2,
        height: dotSize / 2,
        borderRadius: dotSize / 4,
    },
    space: {
        flexGrow: 3,
    },
});
