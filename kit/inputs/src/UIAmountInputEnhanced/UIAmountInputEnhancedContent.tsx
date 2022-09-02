import * as React from 'react';
import Animated, {
    interpolate,
    runOnUI,
    useAnimatedProps,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { LayoutChangeEvent, NativeModules, Platform, TextStyle, View } from 'react-native';
import { makeStyles, Theme, ColorVariants, useTheme, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { BigNumber } from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import type { UIAmountInputEnhancedRef, UIAmountInputEnhancedProps } from './types';
import { AmountInputContext, withSpringConfig } from './constants';
import {
    useAmountInputHandlers,
    useAmountInputHover,
    useExtendedRef,
    usePlaceholderColors,
    useFormatAndSetText,
    useApplyDefaultValue,
} from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';
import { TapHandler } from './TapHandler';
import { InputMessage } from '../InputMessage';
import { usePlaceholderVisibility } from './hooks/usePlaceholderVisibility';
import { useExpandingValue } from './hooks/useExpandingValue';
import { FloatingLabel } from './FloatingLabel';
import { useInputChildren } from '../useInputChildren';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

NativeModules.UIKitInputModule?.install();

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;
/**
 * Expanded position vertical offset of the Label
 * It was calculated as (UILayoutConstant.contentOffset - UILayoutConstant.contentInsetVerticalX2)
 */
// @inline
const EXPANDED_INPUT_OFFSET: number = 8;

const decimalSeparator = uiLocalized.localeInfo.numbers.decimal;

export const UIAmountInputEnhancedContent = React.forwardRef<
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps
>(function UIAmountInputEnhancedContent(
    { children, placeholder, defaultAmount, ...props }: UIAmountInputEnhancedProps,
    forwardedRef: React.Ref<UIAmountInputEnhancedRef>,
) {
    const {
        editable = true,
        onFocus,
        onBlur,
        onHover,
        onSelectionChange,
        onChangeAmount: onChangeAmountProp,
        onLayout: onLayoutProp,
        decimalAspect,
        multiline,
        message,
        messageType,
        label,
    } = props;
    // @ts-ignore
    const ref = useAnimatedRef<UITextViewRef>();

    const { isFocused, formattedText, isHovered, selectionEndPosition } =
        React.useContext(AmountInputContext);

    // /**
    //  * TODO Remove
    //  */
    // useDerivedValue(() => {
    //     console.log({
    //         isHovered: isHovered.value,
    //         isFocused: isFocused.value,
    //         selectionEndPosition: selectionEndPosition.value,
    //         normalizedText: normalizedText.value,
    //         formattedText: formattedText.value,
    //     });
    // });

    const prevCaretPosition = useSharedValue(selectionEndPosition.value);

    const formatAndSetText = useFormatAndSetText(
        ref,
        decimalAspect,
        multiline,
        prevCaretPosition,
        onChangeAmountProp,
    );

    const applyDefaultValue = useApplyDefaultValue(
        defaultAmount,
        formatAndSetText,
        decimalSeparator,
    );

    const onLayout = React.useCallback(
        (e: LayoutChangeEvent) => {
            onLayoutProp?.(e);
            /**
             * Setup default value should be done only after the first layout.
             * Otherwise, it will lead to strange bugs, especially on iOS.
             */
            applyDefaultValue();
        },
        [applyDefaultValue, onLayoutProp],
    );
    const textViewHandlers = useAmountInputHandlers(
        editable,
        onFocus,
        onBlur,
        onSelectionChange,
        formatAndSetText,
        prevCaretPosition,
    );

    const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

    const theme = useTheme();
    const styles = useStyles(theme, editable);

    /** Label is immutable */
    const labelRef = React.useRef(label);
    /** The `hasLabel` can't change because it derived from immutable ref */
    const hasLabel = React.useMemo(() => !!labelRef.current, []);

    const isExpanded = useDerivedValue(() => isFocused.value || !!formattedText.value);

    const { isPlaceholderVisible, showPlacehoder } = usePlaceholderVisibility(isExpanded, hasLabel);

    const expandingValue: Readonly<Animated.SharedValue<number>> = useExpandingValue(
        hasLabel,
        isExpanded,
        showPlacehoder,
    );

    const inputStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        expandingValue.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [0, EXPANDED_INPUT_OFFSET],
                    ),
                },
            ],
        };
    });

    const placeholderColors = usePlaceholderColors(theme);
    const placeholderTextColor = useDerivedValue(() => {
        if (!isPlaceholderVisible.value || formattedText.value) {
            return placeholderColors.value.transparent;
        }
        return isHovered.value && editable
            ? placeholderColors.value.hover
            : placeholderColors.value.default;
    }, [editable]);

    const animatedPlaceholderProps = useAnimatedProps(() => {
        return {
            color: withSpring(placeholderTextColor.value, withSpringConfig) as any as string,
        };
    });

    const childrenProcessed = useInputChildren(children);

    const changeAmount = React.useCallback(
        function changeAmount(amount: BigNumber | undefined, callOnChangeProp?: boolean) {
            runOnUI(formatAndSetText)(amount ? amount.toFormat({ decimalSeparator }) : '', {
                callOnChangeProp,
            });

            if (callOnChangeProp) {
                onChangeAmountProp(amount);
            }
        },
        [formatAndSetText, onChangeAmountProp],
    );
    useExtendedRef(forwardedRef, ref, changeAmount);

    return (
        <InputMessage type={messageType} text={message}>
            <TapHandler inputRef={ref}>
                <Animated.View
                    style={styles.container}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <Animated.View style={[styles.inputContainer, inputStyle]}>
                        <View style={{ flex: 1 }}>
                            <UITextViewAnimated
                                ref={ref}
                                onLayout={onLayout}
                                {...props}
                                {...textViewHandlers}
                                style={styles.input}
                            />
                            <UILabelAnimated
                                animatedProps={animatedPlaceholderProps}
                                style={styles.placeholder}
                            >
                                {placeholder}
                            </UILabelAnimated>
                        </View>

                        <FloatingLabel
                            expandingValue={expandingValue}
                            isHovered={isHovered}
                            editable={editable}
                            colors={placeholderColors}
                        >
                            {label}
                        </FloatingLabel>
                    </Animated.View>
                    {childrenProcessed}
                </Animated.View>
            </TapHandler>
        </InputMessage>
    );
});

const useStyles = makeStyles((theme: Theme, editable: boolean = true) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor: editable
            ? theme[ColorVariants.BackgroundBW]
            : theme[ColorVariants.BackgroundNeutral],
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.smallContentOffset,
    },
    input: {
        ...Platform.select({
            web: {
                ...(!editable ? ({ cursor: 'default' } as TextStyle) : null),
            },
        }),
    },
    placeholder: {
        position: 'absolute',
    },
}));
