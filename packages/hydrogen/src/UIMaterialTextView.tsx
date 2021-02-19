import * as React from 'react';
import {
    Animated,
    LayoutChangeEvent,
    StyleSheet,
    TextInput,
    View,
    Text,
} from 'react-native';

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

const FLOATING_LABEL_SPRING_CONFIG = {
    speed: 20,
    bounciness: 0,
    useNativeDriver: true,
};
const FOLDED_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG = {
    toValue: 0,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const OPEN_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG = {
    toValue: 0,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const FOLDED_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG = {
    toValue: -30,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const OPEN_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG = {
    toValue: 0,
    ...FLOATING_LABEL_SPRING_CONFIG,
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
const FOLDED_FLOATING_LABEL_SCALE_SPRING_CONFIG = {
    toValue: FOLDED_FLOATING_LABEL_SCALE,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG = {
    toValue: 1,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
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

function useFloatLabelTransform(
    props: UIMaterialTextViewCommonProps,
    inputHasValue: boolean,
) {
    const { value } = props;
    const isFolded = isLabelFolded(props);

    const translateX = React.useRef(
        new Animated.Value(
            isFolded
                ? FOLDED_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG.toValue
                : OPEN_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG.toValue,
        ),
    );
    const translateY = React.useRef(
        new Animated.Value(
            isFolded
                ? FOLDED_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG.toValue
                : OPEN_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG.toValue,
        ),
    );
    const scale = React.useRef(
        new Animated.Value(
            isFolded
                ? FOLDED_FLOATING_LABEL_SCALE_SPRING_CONFIG.toValue
                : OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG.toValue,
        ),
    );

    const { isFocused, onFocus, onBlur } = useFocused(props);

    const layout = React.useRef<{
        foldedHeight?: number;
        foldedWidth?: number;
        fullHeight?: number;
        fullWidth?: number;
    }>({});

    const [isLabelReady, setIsLabelReady] = React.useState(false);
    const onPseudoLabelLayout = React.useCallback(
        ({ nativeEvent: { layout: measuredLayout } }: LayoutChangeEvent) => {
            layout.current = {
                ...layout.current,
                foldedHeight: measuredLayout.height,
                foldedWidth: measuredLayout.width,
            };
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
        },
        [isLabelReady, setIsLabelReady],
    );

    const onActualLabelLayout = React.useCallback(
        ({ nativeEvent: { layout: measuredLayout } }: LayoutChangeEvent) => {
            layout.current = {
                ...layout.current,
                fullHeight: measuredLayout.height,
                fullWidth: measuredLayout.width,
            };
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
        },
        [isLabelReady, setIsLabelReady],
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
        const translateXValue =
            (layout.current.foldedWidth - layout.current.fullWidth) / 2;
        const foldedHeightDiff =
            (layout.current.fullHeight - layout.current.foldedHeight) / 2;
        const translateYValue =
            0 -
            foldedHeightDiff -
            PSEUDO_LABEL_BOTTOM_MARGIN -
            layout.current.foldedHeight;
        Animated.parallel([
            Animated.spring(
                translateX.current,
                isFoldedNow
                    ? {
                          ...FOLDED_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG,
                          toValue: translateXValue,
                      }
                    : OPEN_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG,
            ),
            Animated.spring(
                translateY.current,
                isFoldedNow
                    ? {
                          ...FOLDED_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG,
                          toValue: translateYValue,
                      }
                    : OPEN_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG,
            ),
            Animated.spring(
                scale.current,
                isFoldedNow
                    ? FOLDED_FLOATING_LABEL_SCALE_SPRING_CONFIG
                    : OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG,
            ),
        ]).start();
    }, [isFocused, inputHasValue, value, isLabelReady]);

    const pseudoLabelStyle = React.useMemo(() => {
        const isFoldedNow = getIsFolded(isFocused, inputHasValue, value);
        const isHidden = isLabelReady || !isFoldedNow;
        return {
            opacity: isHidden ? 0 : 1,
        };
    }, [isLabelReady, isFocused, inputHasValue, value]);

    const labelContainerStyle = React.useMemo(() => {
        const isFoldedNow = getIsFolded(isFocused, inputHasValue, value);
        const isVisible = isLabelReady || !isFoldedNow;
        return {
            transform: [
                {
                    translateX: translateX.current,
                },
                {
                    translateY: translateY.current,
                },
            ],
            opacity: isVisible ? 1 : 0,
        };
    }, [isLabelReady, isFocused, inputHasValue, value]);

    const theme = useTheme();
    const labelStyle = React.useMemo(() => {
        return {
            color: scale.current.interpolate({
                inputRange: [
                    FOLDED_FLOATING_LABEL_SCALE,
                    OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG.toValue,
                ],
                outputRange: [
                    theme[ColorVariants.TextTertiary] as string,
                    theme[ColorVariants.TextSecondary] as string,
                ],
            }),
            transform: [
                {
                    scale: scale.current,
                },
            ],
        };
    }, [theme]);

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
