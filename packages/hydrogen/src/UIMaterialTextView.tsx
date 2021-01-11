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

export type UIMaterialTextViewProps = UITextViewProps & {
    label: string;
    helperText?: string;
    error?: boolean;
};

const getBorderColor = (
    props: UIMaterialTextViewProps,
    isFocused: boolean,
    isHovered: boolean,
): ColorVariants => {
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

const getCommentColor = (props: UIMaterialTextViewProps): ColorVariants => {
    if (props.error) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextTertiary;
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
const footnoteTextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphFootnote],
);
const FOLDED_FLOATING_LABEL_SCALE =
    // @ts-expect-error
    footnoteTextStyle.fontSize / paragraphTextStyle.fontSize;
const FOLDED_FLOATING_LABEL_SCALE_SPRING_CONFIG = {
    toValue: FOLDED_FLOATING_LABEL_SCALE,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG = {
    toValue: 1,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const PSEUDO_LABEL_BOTTOM_MARGIN = 5;

const isLabelFolded = (props: UIMaterialTextViewProps) => {
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

function useFloatLabelTransform(
    props: UIMaterialTextViewProps,
    inputHasValue: boolean,
) {
    const { onFocus: onFocusProp, onBlur: onBlurProp, value } = props;
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
    const [isFocused, setIsFocused] = React.useState(false);
    const onFocus = React.useCallback(
        (e) => {
            setIsFocused(true);

            if (onFocusProp) {
                onFocusProp(e);
            }
        },
        [translateX, translateY, scale, onFocusProp, setIsFocused],
    );
    const onBlur = React.useCallback(
        (e) => {
            setIsFocused(false);

            if (onBlurProp) {
                onBlurProp(e);
            }
        },
        [
            translateX,
            translateY,
            scale,
            onBlurProp,
            setIsFocused,
            inputHasValue,
        ],
    );
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
        [layout, isLabelReady, setIsLabelReady],
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
        [layout, isLabelReady, setIsLabelReady],
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
    }, [
        scale,
        translateX,
        translateY,
        isLabelReady,
        isFocused,
        inputHasValue,
        value,
    ]);
    const labelStyle = React.useMemo(() => {
        return {
            transform: [
                {
                    scale: scale.current,
                },
            ],
        };
    }, [scale, translateX, translateY, isLabelReady]);

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

export const UIMaterialTextView = React.forwardRef<
    TextInput,
    UIMaterialTextViewProps
>(function UIMaterialTextViewForwarded(props: UIMaterialTextViewProps, ref) {
    const { label, helperText, onChangeText, ...rest } = props;
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
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const main = (
        <View style={styles.container}>
            <View style={styles.pseudoLabel}>
                <Text
                    onLayout={onPseudoLabelLayout}
                    style={[
                        Typography[TypographyVariants.ParagraphFootnote],
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
            <View
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={[
                    styles.inputWrapper,
                    {
                        borderBottomColor:
                            theme[getBorderColor(props, isFocused, isHovered)],
                    },
                ]}
            >
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
                    <UILabel
                        onLayout={onActualLabelLayout}
                        role={TypographyVariants.ParagraphText}
                        color={UILabelColors.TextTertiary}
                        textComponent={Animated.Text}
                        // @ts-ignore
                        style={labelStyle}
                    >
                        {label}
                    </UILabel>
                </Animated.View>
            </View>
        </View>
    );

    if (!helperText) {
        return main;
    }

    return (
        <View style={styles.withCommentContainer}>
            {main}
            <UILabel
                role={TypographyVariants.ParagraphLabel}
                color={getCommentColor(props)}
                style={styles.comment}
            >
                {helperText}
            </UILabel>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    inputWrapper: {
        position: 'relative',
        paddingBottom: 5,
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
    withCommentContainer: {
        flexDirection: 'column',
    },
    comment: {
        marginTop: 5,
    },
});
