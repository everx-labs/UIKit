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

import { ColorVariants, useTheme } from '../Colors';
import { Typography, TypographyVariants } from '../Typography';
import {
    UITextView,
    UITextViewProps,
    useFocused,
    useUITextViewValue,
} from '../UITextView';
import { useHover } from '../useHover';
import { UILabel, UILabelColors } from '../UILabel';

import {
    useMaterialTextViewChildren,
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';

export type UIMaterialTextViewCommonProps = UITextViewProps & {
    label: string;
    helperText?: string;
    error?: boolean;
    success?: boolean;
    onLayout?: Pick<UITextViewProps, 'onLayout'>;
    borderViewRef?: React.Ref<View>;
    children?: React.ReactNode;
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

// eslint-disable-next-line no-shadow
enum ShowStates {
    FOLD = 0,
    FOLDING = 1,
    OPEN = 2,
    OPENING = 3,
    RESET = 5,
}

const getScale = (
    isFolded: boolean,
    show: Animated.Value<ShowStates>,
    onFolded: () => void,
) => {
    const {
        block,
        cond,
        eq,
        and,
        set,
        spring,
        startClock,
        stopClock,
        clockRunning,
        call,
    } = Animated;

    const clock = new Animated.Clock();

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
            mass: new Animated.Value(1),
            restSpeedThreshold: new Animated.Value(0.001),
            restDisplacementThreshold: new Animated.Value(0.001),
            toValue: new Animated.Value(0),
        }),
    };

    return block([
        cond(eq(show, ShowStates.OPEN), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.restSpeedThreshold, 0.001),
            // @ts-ignore
            set(config.restDisplacementThreshold, 0.001),
            // @ts-ignore
            set(config.toValue, 1),
            set(show, ShowStates.OPENING),
            startClock(clock),
        ]),
        cond(eq(show, ShowStates.FOLD), [
            set(state.finished, 0),
            // This two were "accurately" taken out by "eye" testing
            // to have no delay to show a placeholder
            // after label was folded :D
            // @ts-ignore
            set(config.restSpeedThreshold, 1),
            // @ts-ignore
            set(config.restDisplacementThreshold, 0.1),
            // @ts-ignore
            set(config.toValue, FOLDED_FLOATING_LABEL_SCALE),
            set(show, ShowStates.FOLDING),
            startClock(clock),
        ]),
        spring(clock, state, config),
        cond(and(state.finished, clockRunning(clock)), [
            stopClock(clock),
            cond(eq(show, ShowStates.FOLDING), [call([], onFolded)]),
        ]),
        state.position,
    ]);
};

function useFloatLabelTransform(
    props: UIMaterialTextViewCommonProps,
    inputHasValue: boolean,
) {
    const { value } = props;
    const isFolded = isLabelFolded(props);

    const { isFocused, onFocus, onBlur } = useFocused(
        props.onFocus,
        props.onBlur,
    );

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
        },
        [isLabelReady, setIsLabelReady, foldedHeight, foldedWidth],
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
        },
        [isLabelReady, setIsLabelReady, fullHeight, fullWidth],
    );

    const [
        isDefaultPlaceholderVisible,
        setDefaultPlaceholderVisible,
    ] = React.useState(isFolded);

    const markDefaultPlacehoderAsVisible = React.useCallback(() => {
        setDefaultPlaceholderVisible(true);
    }, []);

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

        if (isFoldedNow) {
            show.setValue(ShowStates.FOLD);

            return;
        }

        show.setValue(ShowStates.OPEN);
        setDefaultPlaceholderVisible(false);
    }, [isFocused, inputHasValue, value, show, isLabelReady]);

    const pseudoLabelStyle = React.useMemo(() => {
        const isFoldedNow = getIsFolded(isFocused, inputHasValue, value);
        const isHidden = isLabelReady || !isFoldedNow;
        return {
            opacity: isHidden ? 0 : 1,
        };
    }, [isLabelReady, isFocused, inputHasValue, value]);

    const scale = React.useRef(
        getScale(isFolded, show, markDefaultPlacehoderAsVisible),
    ).current;

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
        isDefaultPlaceholderVisible,
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
            ref={props.borderViewRef}
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
    passedRef,
) {
    const localRef = React.useRef<TextInput>(null);
    const ref = passedRef || localRef;

    const { label, onLayout, children, ...rest } = props;
    const theme = useTheme();
    const {
        inputHasValue,
        clear,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    const {
        isFocused,
        pseudoLabelStyle,
        labelContainerStyle,
        labelStyle,
        onFocus,
        onBlur,
        onPseudoLabelLayout,
        onActualLabelLayout,
        isDefaultPlaceholderVisible,
    } = useFloatLabelTransform(props, inputHasValue);
    const processedChildren = useMaterialTextViewChildren(
        children,
        inputHasValue,
        clear,
    );

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
                        placeholder={
                            isDefaultPlaceholderVisible
                                ? props.placeholder
                                : undefined
                        }
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeTextProp}
                        style={styles.input}
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
                    {processedChildren}
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
    passedRef,
) {
    const localRef = React.useRef<TextInput>(null);
    const ref = passedRef || localRef;

    const { label, onLayout, children, ...rest } = props;
    const {
        inputHasValue,
        clear,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    const { isFocused, onFocus, onBlur } = useFocused(
        props.onFocus,
        props.onBlur,
    );
    const processedChildren = useMaterialTextViewChildren(
        children,
        inputHasValue,
        clear,
    );

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
                        style={styles.input}
                    />
                    {processedChildren}
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

const UIMaterialTextViewForward = React.forwardRef<
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

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof UIMaterialTextViewIcon;
    Action: typeof UIMaterialTextViewAction;
    Text: typeof UIMaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = UIMaterialTextViewIcon;
UIMaterialTextView.Action = UIMaterialTextViewAction;
UIMaterialTextView.Text = UIMaterialTextViewText;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    input: {
        minHeight: 24, // At least size of right icons to not jump
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
