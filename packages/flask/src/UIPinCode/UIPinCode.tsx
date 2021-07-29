import * as React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
    interpolateColor,
    interpolate,
    runOnUI,
    useAnimatedReaction,
} from 'react-native-reanimated';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    ColorVariants,
    hapticNotification,
} from '@tonlabs/uikit.hydrogen';
import { DotsContext } from './DotsContext';
import {
    BiometryKey,
    BiometryProps,
    DelKey,
    Key,
    useBiometryPasscode,
} from './Keys';
import {
    DotAnimationStatus,
    DEFAULT_DOTS_COUNT,
    DOTS_STATE_PRESENTATION_DURATION,
    DOT_WITH_SPRING_CONFIG,
    ShakeAnimationStatus,
    ValidationState,
} from './constants';

function useAnimatedDot(
    index: number,
    dotsAnims: { current: Animated.SharedValue<number>[] },
    validState: Animated.SharedValue<ValidationState>,
): ViewStyle[] {
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

    const innerStyle: ViewStyle = useAnimatedStyle(() => {
        let color = ColorVariants.BackgroundAccent;
        if (validState.value === ValidationState.Success) {
            color = ColorVariants.BackgroundPositive;
        } else if (validState.value === ValidationState.Error) {
            color = ColorVariants.BackgroundNegative;
        }

        return {
            backgroundColor: interpolateColor(
                dotsAnims.current[index].value,
                [DotAnimationStatus.NotActive, DotAnimationStatus.Active],
                [
                    theme[ColorVariants.BackgroundNeutral] as string,
                    theme[color] as string,
                ],
            ) as string,
        };
    });

    return [outterStyle, innerStyle];
}

function useDotsValues(length: number) {
    const dotsValues = React.useRef<Animated.SharedValue<number>[]>([]);

    const values: Animated.SharedValue<number>[] = new Array(length).fill(null);

    for (let i = 0; i < length; i += 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        values[i] = useSharedValue(-1);
    }

    dotsValues.current = values;

    return dotsValues;
}

function useDotsAnims(length: number) {
    const dotsValues = React.useRef<Animated.SharedValue<number>[]>([]);

    const values: Animated.SharedValue<number>[] = new Array(length).fill(null);

    for (let i = 0; i < length; i += 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        values[i] = useSharedValue(DotAnimationStatus.NotActive);
    }

    dotsValues.current = values;

    return dotsValues;
}

function useAnimatedDots(
    length: number,
    dotsAnims: { current: Animated.SharedValue<number>[] },
    validState: Animated.SharedValue<ValidationState>,
) {
    const animatedDots = React.useRef<ReturnType<typeof useAnimatedDot>[]>([]);

    const dotsConfigs: ReturnType<typeof useAnimatedDot>[] = new Array(
        length,
    ).fill(null);

    for (let i = 0; i < length; i += 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        dotsConfigs[i] = useAnimatedDot(i, dotsAnims, validState);
    }

    animatedDots.current = dotsConfigs;

    return animatedDots;
}

export function UIPinCode({
    label,
    labelTestID,
    description,
    descriptionTestID,
    disabled = false,
    length = DEFAULT_DOTS_COUNT,
    onEnter,
    onSuccess,
    isBiometryEnabled = true,
    biometryType,
    getPasscodeWithBiometry,
    autoUnlock = false,
}: {
    label?: string;
    labelTestID?: string;
    description?: string;
    descriptionTestID?: string;
    disabled?: boolean;
    length?: number;
    onEnter: (pin: string) => Promise<boolean>;
    onSuccess: (pin: string) => void;
    autoUnlock?: boolean;
} & BiometryProps) {
    const dotsValues = useDotsValues(length);
    const dotsAnims = useDotsAnims(length);
    const activeDotIndex = useSharedValue(0);
    const validState = useSharedValue(ValidationState.None);
    const shakeAnim = useSharedValue(0);
    const animatedDots = useAnimatedDots(length, dotsAnims, validState);

    const showValidationError = React.useCallback(
        function showValidationErrorImpl() {
            'worklet';

            shakeAnim.value = ShakeAnimationStatus.NotActive;
            shakeAnim.value = withSpring(
                ShakeAnimationStatus.Active,
                DOT_WITH_SPRING_CONFIG,
            );

            hapticNotification('error');
        },
        [shakeAnim],
    );

    const validatePin = React.useCallback(
        (pin: string) => {
            onEnter(pin).then((isValid) => {
                validState.value = isValid
                    ? ValidationState.Success
                    : ValidationState.Error;

                if (!isValid) {
                    runOnUI(showValidationError)();
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
        [
            onEnter,
            validState,
            activeDotIndex,
            onSuccess,
            dotsValues,
            dotsAnims,
            showValidationError,
        ],
    );

    const { getPasscode } = useBiometryPasscode({
        isBiometryEnabled,
        getPasscodeWithBiometry,
        dotsValues,
        dotsAnims,
        dotsCount: length,
        activeDotIndex,
    });

    React.useLayoutEffect(() => {
        if (!autoUnlock) {
            return;
        }
        // Do not open settings if cannot authenticate
        getPasscode({
            skipSettings: true,
            skipPredefined: true,
        });
    }, [getPasscode, autoUnlock]);

    useAnimatedReaction(
        () => {
            return dotsValues.current.map((d) => d.value);
        },
        (dotsCurrentValues, previous) => {
            const pin = dotsCurrentValues.filter((val) => val !== -1).join('');

            // To prevent a situation when the reaction was called
            // because of deps changes (like validatePin was changed)
            // and not because of actual changes in dots values
            if (previous != null) {
                const prevPin = previous.filter((val) => val !== -1).join('');

                if (pin === prevPin) {
                    return;
                }
            }

            if (pin.length === length) {
                runOnJS(validatePin)(pin);
            }
        },
        [dotsValues, length, validatePin],
    );

    const dotsContextValue = React.useMemo(
        () => ({
            activeDotIndex,
            dotsValues,
            dotsAnims,
            dotsCount: length,
            disabled,
        }),
        [activeDotIndex, dotsValues, dotsAnims, length, disabled],
    );

    const shakeStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
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
                    {animatedDots.current.map(
                        ([outterStyles, innerStyles], index) => (
                            <Animated.View
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                style={[styles.dot, outterStyles]}
                            >
                                <Animated.View
                                    style={[styles.dotInner, innerStyles]}
                                />
                            </Animated.View>
                        ),
                    )}
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
                            <Key num={1} />
                            <Key num={2} />
                            <Key num={3} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Key num={4} />
                            <Key num={5} />
                            <Key num={6} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Key num={7} />
                            <Key num={8} />
                            <Key num={9} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <BiometryKey
                                isBiometryEnabled={isBiometryEnabled}
                                biometryType={biometryType}
                                getPasscodeWithBiometry={
                                    getPasscodeWithBiometry
                                }
                            />
                            <Key num={0} />
                            <DelKey />
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
