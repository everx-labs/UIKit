import * as React from 'react';
import {
    LayoutChangeEvent,
    StyleSheet,
    TextInput,
    View,
    Text,
    ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { ColorVariants, useTheme } from './Colors';
import { Typography, TypographyVariants } from './Typography';
import { UILabel, UILabelColors } from './UILabel';
import { UITextView, UITextViewProps, useUITextViewValue } from './UITextView';

export type UIMaterialTextViewCommonProps = UITextViewProps & {
    label: string;
    helperText?: string;
    error?: boolean;
    success?: boolean;
    onLayout?: Pick<UITextViewProps, 'onLayout'>;
};

const getBorderColor = (
    props: UIMaterialTextViewCommonProps,
    isFocused: boolean,
    isHovered: boolean,
): ColorVariants => {
    if (props.success) {
        return ColorVariants.Transparent;
    }
    if (props.error) {
        return ColorVariants.LineNegative;
    }
    if (isFocused) {
        return ColorVariants.LineAccent;
    }
    if (isHovered) {
        return ColorVariants.LineNeutral;
    }
    return ColorVariants.LineSecondary;
};

const getCommentColor = (
    props: UIMaterialTextViewCommonProps,
): ColorVariants => {
    if (props.success) {
        return ColorVariants.TextPositive;
    }
    if (props.error) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextSecondary;
};

const paragraphTextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphText],
);
const labelTextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphLabel],
);
const FOLDED_FLOATING_LABEL_SCALE =
    // @ts-expect-error
    labelTextStyle.fontSize / paragraphTextStyle.fontSize;
const PSEUDO_LABEL_BOTTOM_MARGIN = 4;

const isLabelFolded = (props: UIMaterialTextViewCommonProps) => {
    if (props.defaultValue) {
        return true;
    }
    if (props.value) {
        return true;
    }
    return false;
};

const getIsFolded = (
    isFocused: boolean,
    inputHasValue: boolean,
    value: string | undefined,
) => {
    return Boolean(isFocused || inputHasValue || value);
};

function useFocused(props: UIMaterialTextViewCommonProps) {
    const { onFocus: onFocusProp, onBlur: onBlurProp } = props;
    const [isFocused, setIsFocused] = React.useState(false);
    const onFocus = React.useCallback(
        (e) => {
            setIsFocused(true);

            if (onFocusProp) {
                onFocusProp(e);
            }
        },
        [onFocusProp, setIsFocused],
    );
    const onBlur = React.useCallback(
        (e) => {
            setIsFocused(false);

            if (onBlurProp) {
                onBlurProp(e);
            }
        },
        [onBlurProp, setIsFocused],
    );

    return {
        isFocused,
        onFocus,
        onBlur,
    };
}

// eslint-disable-next-line no-shadow
enum ShowStates {
    FOLD = 0,
    FOLDING = 1,
    OPEN = 2,
    OPENING = 3,
    RESET = 5,
}

const getScale = (isFolded: boolean, show: Animated.Value<ShowStates>) => {
    const {
        block,
        cond,
        eq,
        neq,
        and,
        set,
        spring,
        startClock,
        stopClock,
        clockRunning,
    } = Animated;

    const clock = new Animated.Clock();

    const prevShow = new Animated.Value<ShowStates>(ShowStates.FOLDING);
    const innerShow = new Animated.Value<ShowStates>(ShowStates.FOLDING);

    const state = {
        finished: new Animated.Value(0),
        velocity: new Animated.Value(0),
        position: new Animated.Value(
            isFolded ? FOLDED_FLOATING_LABEL_SCALE : 1,
        ),
        time: new Animated.Value(0),
    };

    const config: Animated.SpringConfig = {
        // Default ones from https://reactnative.dev/docs/animated#spring
        ...Animated.SpringUtils.makeConfigFromBouncinessAndSpeed({
            overshootClamping: false,
            bounciness: 0,
            speed: 20,
            // mass: new Animated.Value(1),
            // restSpeedThreshold: new Animated.Value(0.001),
            // restDisplacementThreshold: new Animated.Value(0.001),
            mass: 1,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
            toValue: new Animated.Value(0),
        }),
    };

    return block([
        cond(neq(show, prevShow), [set(innerShow, show), set(prevShow, show)]),
        cond(eq(innerShow, ShowStates.OPEN), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.toValue, 1),
            set(innerShow, ShowStates.OPENING),
            startClock(clock),
        ]),
        cond(eq(innerShow, ShowStates.FOLD), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.toValue, FOLDED_FLOATING_LABEL_SCALE),
            set(innerShow, ShowStates.FOLDING),
            startClock(clock),
        ]),
        cond(neq(innerShow, ShowStates.RESET), [spring(clock, state, config)]),
        cond(and(state.finished, clockRunning(clock)), [stopClock(clock)]),
        state.position,
    ]);
};

function useFloatLabelTransform(
    props: UIMaterialTextViewCommonProps,
    inputHasValue: boolean,
) {
    const { value } = props;
    const isFolded = isLabelFolded(props);

    const { isFocused, onFocus, onBlur } = useFocused(props);

    const layout = React.useRef<{
        foldedHeight?: number;
        foldedWidth?: number;
        fullHeight?: number;
        fullWidth?: number;
    }>({});

    const show = Animated.useValue<ShowStates>(
        isFolded ? ShowStates.FOLDING : ShowStates.OPENING,
    );

    const fullHeight = Animated.useValue(0);
    const fullWidth = Animated.useValue(0);
    const foldedWidth = Animated.useValue(0);
    const foldedHeight = Animated.useValue(0);

    const [isLabelReady, setIsLabelReady] = React.useState(false);
    const onPseudoLabelLayout = React.useCallback(
        ({ nativeEvent: { layout: measuredLayout } }: LayoutChangeEvent) => {
            layout.current = {
                ...layout.current,
                foldedHeight: measuredLayout.height,
                foldedWidth: measuredLayout.width,
            };
            // @ts-expect-error
            foldedHeight.setValue(measuredLayout.height);
            // @ts-expect-error
            foldedWidth.setValue(measuredLayout.width);
            if (
                isLabelReady ||
                layout.current.fullHeight == null ||
                layout.current.fullWidth == null ||
                layout.current.foldedWidth == null ||
                layout.current.foldedHeight == null
            ) {
                return;
            }
            setIsLabelReady(true);
            show.setValue(ShowStates.RESET);
        },
        [isLabelReady, setIsLabelReady, foldedHeight, foldedWidth, show],
    );

    const onActualLabelLayout = React.useCallback(
        ({ nativeEvent: { layout: measuredLayout } }: LayoutChangeEvent) => {
            layout.current = {
                ...layout.current,
                fullHeight: measuredLayout.height,
                fullWidth: measuredLayout.width,
            };
            // @ts-expect-error
            fullHeight.setValue(measuredLayout.height);
            // @ts-expect-error
            fullWidth.setValue(measuredLayout.width);
            if (
                isLabelReady ||
                layout.current.fullHeight == null ||
                layout.current.fullWidth == null ||
                layout.current.foldedWidth == null ||
                layout.current.foldedHeight == null
            ) {
                return;
            }
            setIsLabelReady(true);
            show.setValue(ShowStates.RESET);
        },
        [isLabelReady, setIsLabelReady, fullHeight, fullWidth, show],
    );

    React.useEffect(() => {
        if (
            layout.current.fullHeight == null ||
            layout.current.fullWidth == null ||
            layout.current.foldedWidth == null ||
            layout.current.foldedHeight == null
        ) {
            return;
        }

        const isFoldedNow = getIsFolded(isFocused, inputHasValue, value);

        show.setValue(isFoldedNow ? ShowStates.FOLD : ShowStates.OPEN);
    }, [isFocused, inputHasValue, show, value]);

    const pseudoLabelStyle = React.useMemo(() => {
        const isFoldedNow = getIsFolded(isFocused, inputHasValue, value);
        const isHidden = isLabelReady || !isFoldedNow;
        return {
            opacity: isHidden ? 0 : 1,
        };
    }, [isLabelReady, isFocused, inputHasValue, value]);

    const scale = React.useRef(getScale(isFolded, show)).current;

    const labelContainerStyle = React.useMemo(() => {
        const isFoldedNow = getIsFolded(isFocused, inputHasValue, value);
        const isVisible = isLabelReady || !isFoldedNow;
        return {
            transform: [
                {
                    translateX: Animated.interpolate(scale, {
                        inputRange: [FOLDED_FLOATING_LABEL_SCALE, 1],
                        outputRange: [
                            Animated.divide(
                                Animated.sub(foldedWidth, fullWidth),
                                2,
                            ),
                            0,
                        ],
                    }),
                },
                {
                    translateY: Animated.interpolate(scale, {
                        inputRange: [FOLDED_FLOATING_LABEL_SCALE, 1],
                        outputRange: [
                            Animated.sub(
                                0,
                                Animated.divide(
                                    Animated.sub(fullHeight, foldedHeight),
                                    2,
                                ),
                                PSEUDO_LABEL_BOTTOM_MARGIN,
                                foldedHeight,
                            ),
                            0,
                        ],
                    }),
                },
            ],
            opacity: isVisible ? 1 : 0,
        };
    }, [
        isLabelReady,
        isFocused,
        inputHasValue,
        value,
        foldedHeight,
        fullHeight,
        foldedWidth,
        fullWidth,
        scale,
    ]);

    const theme = useTheme();
    const labelStyle: ViewStyle = React.useMemo(() => {
        return {
            color: Animated.interpolateColors(scale, {
                inputRange: [FOLDED_FLOATING_LABEL_SCALE, 1],
                outputColorRange: [
                    theme[ColorVariants.TextTertiary] as string,
                    theme[ColorVariants.TextSecondary] as string,
                ],
            }) as any,
            transform: [
                {
                    scale: scale as any,
                },
            ],
        };
    }, [theme, scale]);

    return {
        isFocused,
        pseudoLabelStyle,
        labelContainerStyle,
        labelStyle,
        onFocus,
        onBlur,
        onPseudoLabelLayout,
        onActualLabelLayout,
    };
}

function useHover() {
    const [isHovered, setIsHovered] = React.useState(false);
    const onMouseEnter = React.useCallback(() => {
        setIsHovered(true);
    }, [setIsHovered]);
    const onMouseLeave = React.useCallback(() => {
        setIsHovered(false);
    }, [setIsHovered]);

    return {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    };
}

function UIMaterialTextViewComment(
    props: UIMaterialTextViewCommonProps & {
        onLayout?: Pick<UITextViewProps, 'onLayout'>;
        children: React.ReactNode;
    },
) {
    const { helperText, onLayout, children } = props;

    if (!helperText) {
        return (
            <View style={styles.withoutCommentContainer} onLayout={onLayout}>
                {children}
            </View>
        );
    }

    return (
        <View style={styles.withCommentContainer} onLayout={onLayout}>
            {children}
            <UILabel
                role={TypographyVariants.ParagraphNote}
                color={getCommentColor(props)}
                style={styles.comment}
            >
                {helperText}
            </UILabel>
        </View>
    );
}

function UIMaterialTextViewBorder(
    props: UIMaterialTextViewCommonProps & {
        isFocused: boolean;
        children: React.ReactNode;
    },
) {
    const theme = useTheme();

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    return (
        <View
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={[
                styles.inputWrapper,
                {
                    borderBottomColor:
                        theme[
                            getBorderColor(props, props.isFocused, isHovered)
                        ],
                },
            ]}
        >
            {props.children}
        </View>
    );
}

const UIMaterialTextViewFloating = React.forwardRef<
    TextInput,
    UIMaterialTextViewCommonProps
>(function UIMaterialTextViewFloatingForwarded(
    props: UIMaterialTextViewCommonProps,
    ref,
) {
    const { label, onChangeText, onLayout, ...rest } = props;
    const theme = useTheme();
    const {
        inputHasValue,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, onChangeText);
    const {
        isFocused,
        pseudoLabelStyle,
        labelContainerStyle,
        labelStyle,
        onFocus,
        onBlur,
        onPseudoLabelLayout,
        onActualLabelLayout,
    } = useFloatLabelTransform(props, inputHasValue);

    return (
        <UIMaterialTextViewComment {...props}>
            <View style={styles.container} onLayout={onLayout}>
                <View style={styles.pseudoLabel}>
                    <Text
                        onLayout={onPseudoLabelLayout}
                        style={[
                            Typography[TypographyVariants.ParagraphLabel],
                            {
                                letterSpacing: paragraphTextStyle.letterSpacing,
                                lineHeight: undefined,
                                color: theme[UILabelColors.TextTertiary],
                            },
                            pseudoLabelStyle,
                        ]}
                    >
                        {label}
                    </Text>
                </View>
                <UIMaterialTextViewBorder {...props} isFocused={isFocused}>
                    <UITextView
                        ref={ref}
                        {...rest}
                        placeholder={undefined}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeTextProp}
                    />
                    <Animated.View
                        pointerEvents="none"
                        style={[styles.floatingLabel, labelContainerStyle]}
                    >
                        <Animated.Text
                            onLayout={onActualLabelLayout}
                            style={[
                                Typography[TypographyVariants.ParagraphText],
                                labelStyle,
                            ]}
                        >
                            {label}
                        </Animated.Text>
                    </Animated.View>
                </UIMaterialTextViewBorder>
            </View>
        </UIMaterialTextViewComment>
    );
});

const UIMaterialTextViewSimple = React.forwardRef<
    TextInput,
    UIMaterialTextViewCommonProps
>(function UIMaterialTextViewSimpleForwarded(
    props: UIMaterialTextViewCommonProps,
    ref,
) {
    const { label, onChangeText, onLayout, ...rest } = props;
    const { onChangeText: onChangeTextProp } = useUITextViewValue(
        ref,
        false,
        onChangeText,
    );
    const { isFocused, onFocus, onBlur } = useFocused(props);

    return (
        <UIMaterialTextViewComment {...props}>
            <View style={styles.container} onLayout={onLayout}>
                <UIMaterialTextViewBorder {...props} isFocused={isFocused}>
                    <UITextView
                        ref={ref}
                        {...rest}
                        placeholder={label}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeTextProp}
                    />
                </UIMaterialTextViewBorder>
            </View>
        </UIMaterialTextViewComment>
    );
});

export type UIMaterialTextViewProps = UIMaterialTextViewCommonProps & {
    /**
     * Whether to make label float or use default native placeholder
     */
    floating?: boolean;
};

export const UIMaterialTextView = React.forwardRef<
    TextInput,
    UIMaterialTextViewProps
>(function UIMaterialTextViewForwarded(
    { floating = true, ...props }: UIMaterialTextViewProps,
    ref,
) {
    return floating ? (
        <UIMaterialTextViewFloating ref={ref} {...props} />
    ) : (
        <UIMaterialTextViewSimple ref={ref} {...props} />
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    inputWrapper: {
        position: 'relative',
        paddingBottom: 9,
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    pseudoLabel: {
        // To inner text be in intrinsic size
        alignItems: 'flex-start',
        paddingBottom: PSEUDO_LABEL_BOTTOM_MARGIN,
    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    withoutCommentContainer: {
        paddingTop: 12,
        paddingBottom: 18,
    },
    withCommentContainer: {
        flexDirection: 'column',
        paddingTop: 12,
        paddingBottom: 12,
    },
    comment: {
        marginTop: 10,
    },
});
