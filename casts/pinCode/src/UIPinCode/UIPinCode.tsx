/* eslint-disable no-param-reassign */
import * as React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
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
import { hapticNotification, UIIndicator } from '@tonlabs/uikit.controls';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
    UIBackgroundView,
} from '@tonlabs/uikit.themes';

import { DotsContext } from './DotsContext';
import { BiometryKey, DelKey, GetPasscodeCb, Key } from './Keys';
import {
    DEFAULT_DOTS_COUNT,
    DOTS_STATE_PRESENTATION_DURATION,
    DOT_WITH_SPRING_CONFIG,
    UIPinCodeBiometryType,
} from './constants';
import { UIPinCodeDescription, UIPinCodeDescriptionRef } from './UIPinCodeDescription';
import { useKeyboardListener } from './UIPinCodeKeyboardListener';
import { BlockingView, BlockingViewRef } from './BlockingView';

export type UIPinCodeEnterValidationResult = {
    valid: boolean;
    description?: string;
    payload?: any;
};

// @inline
const DOT_ANIMATION_NOT_ACTIVE = 0;
// @inline
const DOT_ANIMATION_ACTIVE = 1;
export type DotAnimationStatus =
    | typeof DOT_ANIMATION_NOT_ACTIVE
    | typeof DOT_ANIMATION_ACTIVE
    | number;

// @inline
const SHAKE_ANIMATION_NOT_ACTIVE = 0;
// @inline
const SHAKE_ANIMATION_ACTIVE = 1;
type ShakeAnimationStatus =
    | typeof SHAKE_ANIMATION_NOT_ACTIVE
    | typeof SHAKE_ANIMATION_ACTIVE
    | number;

// @inline
const VALIDATION_STATE_NONE = 0;
// @inline
const VALIDATION_STATE_SUCCESS = 1;
// @inline
const VALIDATION_STATE_ERROR = 2;
type ValidationState =
    | typeof VALIDATION_STATE_NONE
    | typeof VALIDATION_STATE_SUCCESS
    | typeof VALIDATION_STATE_ERROR
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
        if (validState.value === VALIDATION_STATE_SUCCESS) {
            color = colorBgPositive;
        } else if (validState.value === VALIDATION_STATE_ERROR) {
            color = colorBgNegative;
        }

        return {
            backgroundColor: interpolateColor(
                dotAnim.value,
                [DOT_ANIMATION_NOT_ACTIVE, DOT_ANIMATION_ACTIVE],
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
    const dotsValues = React.useRef<Animated.SharedValue<DotAnimationStatus>[]>([]);

    const values: Animated.SharedValue<DotAnimationStatus>[] = new Array(length).fill(null);

    for (let i = 0; i < length; i += 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        values[i] = useSharedValue(DOT_ANIMATION_NOT_ACTIVE);
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

    const dotsConfigs: ReturnType<typeof useAnimatedDot>[] = new Array(length).fill(null);

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

function usePinValidation<Validation extends boolean | UIPinCodeEnterValidationResult>({
    validate: validateProp,
    onSuccess,
    dotsValues,
    dotsAnims,
    activeDotIndex,
}: {
    validate: UIPinCodeProps<Validation>['validate'];
    onSuccess: UIPinCodeProps<Validation>['onSuccess'];
    dotsValues: Animated.SharedValue<number>[];
    dotsAnims: Animated.SharedValue<number>[];
    activeDotIndex: Animated.SharedValue<number>;
}) {
    const shakeAnim = useSharedValue<ShakeAnimationStatus>(0);
    const descriptionRef = React.useRef<UIPinCodeDescriptionRef>(null);
    const validState = useSharedValue<ValidationState>(VALIDATION_STATE_NONE);

    const showValidationError = React.useCallback(
        function showValidationErrorImpl() {
            'worklet';

            shakeAnim.value = SHAKE_ANIMATION_NOT_ACTIVE;
            shakeAnim.value = withSpring(SHAKE_ANIMATION_ACTIVE, DOT_WITH_SPRING_CONFIG);

            hapticNotification('error');
        },
        [shakeAnim],
    );

    const validatePin = React.useCallback(
        (pin: string) => {
            validateProp(pin).then(result => {
                let isValid: boolean;
                let validationDescription: string | undefined;
                let payload: any;
                if (typeof result === 'object') {
                    isValid = result.valid;
                    validationDescription = result.description;
                    payload = result.payload;
                } else {
                    isValid = result;
                }

                if (isValid) {
                    validState.value = VALIDATION_STATE_SUCCESS;

                    if (validationDescription != null && descriptionRef.current != null) {
                        descriptionRef.current.showValid(validationDescription);
                    }
                } else {
                    validState.value = VALIDATION_STATE_ERROR;

                    if (validationDescription != null && descriptionRef.current != null) {
                        descriptionRef.current.showError(validationDescription);
                    }

                    runOnUI(showValidationError)();
                }

                setTimeout(() => {
                    dotsValues.forEach((_dot, index) => {
                        // eslint-disable-next-line no-param-reassign
                        dotsValues[index].value = -1;
                        // eslint-disable-next-line no-param-reassign
                        dotsAnims[index].value = withSpring(
                            DOT_ANIMATION_NOT_ACTIVE,
                            DOT_WITH_SPRING_CONFIG,
                        );
                    });
                    // eslint-disable-next-line no-param-reassign
                    activeDotIndex.value = 0;
                    validState.value = VALIDATION_STATE_NONE;

                    if (isValid) {
                        if (payload == null) {
                            onSuccess(pin);
                        } else {
                            // @ts-ignore
                            onSuccess(pin, payload);
                        }
                    }
                }, DOTS_STATE_PRESENTATION_DURATION);
            });
        },
        [
            validateProp,
            onSuccess,
            showValidationError,
            validState,
            activeDotIndex,
            dotsValues,
            dotsAnims,
        ],
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

    return {
        validatePin,
        shakeStyle,
        validState,
        descriptionRef,
    };
}

function useBiometry({
    loading,
    length,
    biometryType,
    passcodeBiometryProvider,
    dotsValues,
    dotsAnims,
    activeDotIndex,
}: {
    loading: Required<UIPinCodeProps<any>>['loading'];
    length: Required<UIPinCodeProps<any>>['length'];
    biometryType: Required<UIPinCodeProps<any>>['biometryType'];
    passcodeBiometryProvider: UIPinCodeProps<any>['passcodeBiometryProvider'];
    dotsValues: Animated.SharedValue<number>[];
    dotsAnims: Animated.SharedValue<number>[];
    activeDotIndex: Animated.SharedValue<number>;
}) {
    const usePredefined =
        biometryType === UIPinCodeBiometryType.None && process.env.NODE_ENV === 'development';
    const biometryBlockingRef = React.useRef<BlockingViewRef>(null);

    const loadingGuard = React.useRef<Promise<void> | null>(null);
    const loadingResolve = React.useRef<(() => void) | null>();

    React.useEffect(() => {
        if (loading) {
            if (loadingResolve.current != null) {
                return;
            }
            loadingGuard.current = new Promise(res => {
                loadingResolve.current = res;
            });
        } else {
            loadingResolve.current?.();
            loadingResolve.current = null;
        }
    }, [loading]);

    const callBiometry = React.useCallback(async () => {
        if (biometryType === UIPinCodeBiometryType.None || passcodeBiometryProvider == null) {
            return;
        }

        let passcode: string | undefined;

        try {
            await biometryBlockingRef.current?.block();
            // Wait until loading is completed if any
            await loadingGuard.current;
            passcode = await passcodeBiometryProvider();
        } catch (error) {
            console.error('Failed to get the passcode with biometry with error:', error);
        } finally {
            await biometryBlockingRef.current?.unblock();
        }

        if (passcode != null) {
            dotsValues.forEach((_dot, index) => {
                dotsValues[index].value = Number((passcode as string)[index]);
                dotsAnims[index].value = withSpring(DOT_ANIMATION_ACTIVE, DOT_WITH_SPRING_CONFIG);
            });
            activeDotIndex.value = length;
        }
    }, [length, biometryType, passcodeBiometryProvider, dotsValues, dotsAnims, activeDotIndex]);

    return {
        usePredefined,
        callBiometry,
        biometryBlockingRef,
    };
}

function UIPinCodeImpl<Validation extends boolean | UIPinCodeEnterValidationResult>(
    {
        autoUnlock,
        label,
        labelTestID,
        description,
        descriptionTestID,
        length: lengthProp = DEFAULT_DOTS_COUNT,
        disabled: disabledProp = false,
        loading = false,
        biometryType = UIPinCodeBiometryType.None,
        validate,
        onSuccess,
        passcodeBiometryProvider,
    }: UIPinCodeProps<Validation>,
    ref: React.Ref<UIPinCodeRef>,
) {
    // Do not change length after mount
    // since it can affect how many hooks is called
    const length = React.useRef(lengthProp).current;

    const dotsValues = useDotsValues(length);
    const dotsAnims = useDotsAnims(length);
    const activeDotIndex = useSharedValue(0);

    // The keys should be disabled until an auto unlock call to biometry does not happen,
    // or until we learn that there is no auto unlock.
    // (There must be a `passcodeProviderIsReady` call from the client side)
    const [autoUnlockIsPassed, setAutoUnlockIsPassed] = React.useState(
        // Do not wait for biometry if it isn't declared
        !autoUnlock || biometryType === UIPinCodeBiometryType.None,
    );

    /**
     * Beside simple inability to tap on keys when
     * a pin code is disabled externally or in the loading state
     * there is a thing connected to biometry.
     * It's crucial to not let any UI changes happen when
     * call to keychain with biometry access is happening,
     * due to some internal deadlock, that can freaze the whole app
     */
    const disabled = React.useMemo(
        () => disabledProp || loading || !autoUnlockIsPassed,
        [disabledProp, loading, autoUnlockIsPassed],
    );

    const { validatePin, shakeStyle, descriptionRef, validState } = usePinValidation({
        validate,
        onSuccess,
        dotsValues,
        dotsAnims,
        activeDotIndex,
    });

    const animatedDots = useAnimatedDots(length, dotsAnims, validState);

    useKeyboardListener(activeDotIndex, dotsValues, dotsAnims, length, disabled);

    const { callBiometry, usePredefined, biometryBlockingRef } = useBiometry({
        loading,
        length,
        biometryType,
        passcodeBiometryProvider,
        dotsValues,
        dotsAnims,
        activeDotIndex,
    });

    React.useImperativeHandle(
        ref,
        () => ({
            async getPasscodeWithBiometry() {
                if (!autoUnlock) {
                    // No need to `setAutoUnlockIsPassed(true);` as it's already there initially.
                    return;
                }

                try {
                    await callBiometry();
                } catch (error) {
                    console.error('Failed to call the biometry with error:', error);
                } finally {
                    setAutoUnlockIsPassed(true);
                }
            },
        }),
        [autoUnlock, callBiometry],
    );

    useAnimatedReaction(
        () => {
            return dotsValues.map(d => d.value);
        },
        (dotsCurrentValues, previous) => {
            const pin = dotsCurrentValues.filter(val => val !== -1).join('');

            if (pin.length !== length) {
                return;
            }

            // To prevent a situation when the reaction was called
            // because of deps changes (like validatePin was changed)
            // and not because of actual changes in dots values
            const prevPin = (previous || []).filter(val => val !== -1).join('');

            if (pin === prevPin) {
                return;
            }

            runOnJS(validatePin)(pin);
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

    return (
        <>
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
                        {loading && (
                            <UIBackgroundView
                                style={[StyleSheet.absoluteFill, styles.loadingIndicator]}
                            >
                                <UIIndicator size={dotSize} />
                            </UIBackgroundView>
                        )}
                    </Animated.View>
                    <UIPinCodeDescription
                        ref={descriptionRef}
                        description={description}
                        descriptionTestID={descriptionTestID}
                    />
                    <View style={styles.space} />
                    <DotsContext.Provider value={dotsContextValue}>
                        <View style={styles.keysContainer}>
                            <View style={styles.keysRow}>
                                <Key num={1} />
                                <Key num={2} />
                                <Key num={3} />
                            </View>
                            <View style={styles.keysRow}>
                                <Key num={4} />
                                <Key num={5} />
                                <Key num={6} />
                            </View>
                            <View style={styles.keysRow}>
                                <Key num={7} />
                                <Key num={8} />
                                <Key num={9} />
                            </View>
                            <View style={styles.keysRow}>
                                <BiometryKey
                                    usePredefined={usePredefined}
                                    biometryType={biometryType}
                                    onCallBiometry={callBiometry}
                                />
                                <Key num={0} />
                                <DelKey />
                            </View>
                        </View>
                    </DotsContext.Provider>
                </View>
                <View style={styles.bottomSpacer} />
            </View>
            {/*
             * On Android there is a deadlock when UI changes happening
             * simultaneously with biometry keychain access. To prevent
             * them we simply show a View above all content, that prevent
             * any unnwanted touch handlers to be fired, thus elimintaing
             * possibility of such a deadlock to happen
             */}
            {Platform.OS === 'android' && <BlockingView ref={biometryBlockingRef} />}
        </>
    );
}

export const UIPinCode = React.memo(React.forwardRef(UIPinCodeImpl)) as typeof UIPinCodeImpl;

type UIPinCodeProps<Validation extends boolean | UIPinCodeEnterValidationResult> = {
    // eslint-disable-next-line react/no-unused-prop-types
    ref?: React.Ref<UIPinCodeRef>;

    label?: string;
    labelTestID?: string;
    description?: string;
    descriptionTestID?: string;
    length?: number;

    disabled?: boolean;
    loading?: boolean;
    /**
     * Flag either can auto-unlock or not via `getPasscodeWithBiometry()` method.
     */
    autoUnlock?: boolean;
    biometryType?: UIPinCodeBiometryType;

    // Verify that pin is valid with external method
    validate: (pin: string) => Promise<Validation>;
    // Is called when pin code is successfully extracted
    // and validated
    onSuccess: (pin: string) => void;
    passcodeBiometryProvider?: GetPasscodeCb<string | undefined>;
};

export type UIPinCodeRef = {
    // Call it when biometry is ready to be called
    //
    // Note: Be aware that biometry is a heavy process,
    // thus it's better to call it when a process isn't busy.
    //
    // Note2: this method can be called only when `autoUnlock` prop is true!
    getPasscodeWithBiometry(): Promise<void>;
};

const dotSize = UIConstant.tinyCellHeight();

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperSpacer: {
        flex: 3,
    },
    inner: {
        flexGrow: 4,
        flexShrink: 1,
        // Do not provide flex-basis, it breaks the fitting logic!
        alignItems: 'center',
        minHeight: 'auto', // disallow to cut off the content!
    },
    bottomSpacer: {
        flex: 1,
    },
    keysContainer: { position: 'relative' },
    keysRow: { flexDirection: 'row' },
    dotsContainer: {
        flexDirection: 'row',
        height: UIConstant.bigCellHeight(),
        alignItems: 'center',
        position: 'relative',
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
    loadingIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
