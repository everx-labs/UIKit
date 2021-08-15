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
    DEFAULT_DOTS_COUNT,
    DotAnimationStatus,
    DOTS_STATE_PRESENTATION_DURATION,
    DOT_WITH_SPRING_CONFIG,
} from './constants';
import {
    UIPinCodeDescription,
    UIPinCodeDescriptionRef,
} from './UIPinCodeDescription';

export type UIPinCodeEnterValidationResult = {
    valid: boolean;
    description: string;
};

type ShakeAnimationStatus =
    | /** NotActive */ 0
    | /** Active */ 1
    | /** Filler (just to put it in column) */ -100
    | number;

type ValidationState =
    | /** None */ 0
    | /** Success */ 1
    | /** Error */ 2
    | number;

function useAnimatedDot(
    index: number,
    dotsAnims: Animated.SharedValue<DotAnimationStatus>[],
    validState: Animated.SharedValue<ValidationState>,
): ViewStyle[] {
    const theme = useTheme();

    const dotAnim = dotsAnims[index];

    /**
     * Styles has to be separated and applied to different views
     * to work properly on web
     */
    const outterStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: dotAnim.value + 1,
                },
            ],
        };
    });

    const bgNeutral = theme[ColorVariants.BackgroundNeutral] as string;

    const colorBgAccent = theme[ColorVariants.BackgroundAccent] as string;
    const colorBgPositive = theme[ColorVariants.BackgroundPositive] as string;
    const colorBgNegative = theme[ColorVariants.BackgroundNegative] as string;

    const innerStyle: ViewStyle = useAnimatedStyle(() => {
        let color = colorBgAccent;
        if (validState.value === 1 /** Success */) {
            color = colorBgPositive;
        } else if (validState.value === 2 /** Error */) {
            color = colorBgNegative;
        }

        return {
            backgroundColor: interpolateColor(
                dotAnim.value,
                [0 /** NotActive */, 1 /** Active */],
                [bgNeutral, color],
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

    React.useEffect(() => {
        return () => {
            // @ts-ignore
            dotsValues.current = null;
        };
    }, []);

    return dotsValues.current;
}

function useDotsAnims(length: number) {
    const dotsValues = React.useRef<Animated.SharedValue<DotAnimationStatus>[]>(
        [],
    );

    const values: Animated.SharedValue<DotAnimationStatus>[] = new Array(
        length,
    ).fill(null);

    for (let i = 0; i < length; i += 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        values[i] = useSharedValue(0 /** NotActive */);
    }

    dotsValues.current = values;

    React.useEffect(() => {
        return () => {
            // @ts-ignore
            dotsValues.current = null;
        };
    }, []);

    return dotsValues.current;
}

function useAnimatedDots(
    length: number,
    dotsAnims: Animated.SharedValue<DotAnimationStatus>[],
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

    React.useEffect(() => {
        return () => {
            // @ts-ignore
            animatedDots.current = null;
        };
    }, []);

    return animatedDots.current;
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
    onEnter: (pin: string) => Promise<boolean | UIPinCodeEnterValidationResult>;
    onSuccess: (pin: string) => void;
    autoUnlock?: boolean;
} & BiometryProps) {
    const dotsValues = useDotsValues(length);
    const dotsAnims = useDotsAnims(length);
    const activeDotIndex = useSharedValue(0);
    const validState = useSharedValue<ValidationState>(0 /** None */);
    const shakeAnim = useSharedValue<ShakeAnimationStatus>(0);
    const animatedDots = useAnimatedDots(length, dotsAnims, validState);

    const showValidationError = React.useCallback(
        function showValidationErrorImpl() {
            'worklet';

            shakeAnim.value = 0 /** NotActive */;
            shakeAnim.value = withSpring(
                1 /** Active */,
                DOT_WITH_SPRING_CONFIG,
            );

            hapticNotification('error');
        },
        [shakeAnim],
    );

    const descriptionRef = React.useRef<UIPinCodeDescriptionRef>(null);

    const validatePin = React.useCallback(
        (pin: string) => {
            onEnter(pin).then((result) => {
                let isValid: boolean;
                let validationDescription: string | null = null;
                if (typeof result === 'object') {
                    isValid = result.valid;
                    validationDescription = result.description;
                } else {
                    isValid = result;
                }

                validState.value = isValid ? /** Success */ 1 : /** Error */ 2;

                if (isValid) {
                    validState.value = /** Success */ 1;

                    if (
                        validationDescription != null &&
                        descriptionRef.current != null
                    ) {
                        descriptionRef.current.showValid(validationDescription);
                    }
                } else {
                    validState.value = /** Error */ 2;

                    if (
                        validationDescription != null &&
                        descriptionRef.current != null
                    ) {
                        descriptionRef.current.showError(validationDescription);
                    }

                    runOnUI(showValidationError)();
                }

                setTimeout(() => {
                    dotsValues.forEach((_dot, index) => {
                        dotsValues[index].value = -1;
                        dotsAnims[index].value = withSpring(
                            /** NotActive */ 0,
                            DOT_WITH_SPRING_CONFIG,
                        );
                    });
                    activeDotIndex.value = 0;
                    validState.value = /** None */ 0;

                    if (isValid) {
                        onSuccess(pin);
                    }
                }, DOTS_STATE_PRESENTATION_DURATION);
            });
        },
        [
            onEnter,
            // validState,
            // activeDotIndex,
            onSuccess,
            // dotsValues,
            // dotsAnims,
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

    React.useEffect(() => {
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
            return dotsValues.map((d) => d.value);
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
                    {animatedDots.map(([outterStyles, innerStyles], index) => (
                        <Animated.View
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            style={[styles.dot, outterStyles]}
                        >
                            <Animated.View
                                style={[styles.dotInner, innerStyles]}
                                testID="pin_code_circle"
                            />
                        </Animated.View>
                    ))}
                </Animated.View>
                <UIPinCodeDescription
                    ref={descriptionRef}
                    description={description}
                    descriptionTestID={descriptionTestID}
                />
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
