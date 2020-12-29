import * as React from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

import { ColorVariants, useTheme } from './Colors';
import { TypographyVariants } from './Typography';
import { UILabel, UILabelColors } from './UILabel';
import { UITextView, UITextViewProps, useUITextViewValue } from './UITextView';

export type UIMaterialTextViewProps = UITextViewProps & {
    label: string;
    helperText: string;
    error: boolean;
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
    toValue: -7,
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
const FOLDED_FLOATING_LABEL_SCALE_SPRING_CONFIG = {
    toValue: 0.75,
    ...FLOATING_LABEL_SPRING_CONFIG,
};
const OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG = {
    toValue: 1,
    ...FLOATING_LABEL_SPRING_CONFIG,
};

const isLabelFolded = (props: UIMaterialTextViewProps) => {
    if (props.defaultValue) {
        return true;
    }
    if (props.value) {
        return true;
    }
    return false;
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
    React.useEffect(() => {
        const isFoldedNow = isFocused || inputHasValue || value;
        Animated.parallel([
            Animated.spring(
                translateX.current,
                isFoldedNow
                    ? FOLDED_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG
                    : OPEN_FLOATING_LABEL_TRANSLATE_X_SPRING_CONFIG,
            ),
            Animated.spring(
                translateY.current,
                isFoldedNow
                    ? FOLDED_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG
                    : OPEN_FLOATING_LABEL_TRANSLATE_Y_SPRING_CONFIG,
            ),
            Animated.spring(
                scale.current,
                isFoldedNow
                    ? FOLDED_FLOATING_LABEL_SCALE_SPRING_CONFIG
                    : OPEN_FLOATING_LABEL_SCALE_SPRING_CONFIG,
            ),
        ]).start();
    }, [isFocused]);
    const transform = React.useMemo(
        () => [
            {
                scale: scale.current,
            },
            {
                translateX: translateX.current,
            },
            {
                translateY: translateY.current,
            },
        ],
        [scale, translateX, translateY],
    );
    return {
        isFocused,
        transform,
        onFocus,
        onBlur,
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
>(function UIDecoratedTextViewForwarded(props: UIMaterialTextViewProps, ref) {
    const { label, helperText, onChangeText, ...rest } = props;
    const theme = useTheme();
    const {
        inputHasValue,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, onChangeText);
    const { isFocused, transform, onFocus, onBlur } = useFloatLabelTransform(
        props,
        inputHasValue,
    );
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const main = (
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
                style={[
                    styles.floatingLabel,
                    {
                        transform,
                    },
                ]}
            >
                <UILabel
                    role={TypographyVariants.ParagraphText}
                    color={UILabelColors.TextTertiary}
                >
                    {label}
                </UILabel>
            </Animated.View>
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
    inputWrapper: {
        position: 'relative',
        marginTop: 20,
        paddingBottom: 5,
        borderBottomWidth: 1,
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
