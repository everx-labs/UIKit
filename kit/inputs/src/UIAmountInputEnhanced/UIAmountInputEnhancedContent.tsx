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
import {
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps,
    UIAmountInputEnhancedMessageType,
} from './types';
import { AmountInputContext, withSpringConfig } from './constants';
import {
    useAmountInputHandlers,
    useAmountInputHover,
    useExtendedRef,
    usePlaceholderColors,
    useDefaultValue,
    useFormatText,
    useSetText,
} from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';
import { TapHandler } from './TapHandler';
import { InputMessage, InputMessageType } from '../InputMessage';
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

    // const formatAndSetText = useFormatAndSetText(
    //     ref,
    //     decimalAspect,
    //     multiline,
    //     prevCaretPosition,
    //     onChangeAmountProp,
    // );

    const formatText = useFormatText(decimalAspect, multiline, prevCaretPosition);
    const formatAmount = React.useCallback(
        (amount: BigNumber | undefined) => {
            if (!amount) {
                return {
                    formattedText: '',
                    normalizedText: '',
                    caretPosition: 0,
                };
            }
            const value = amount.toFormat({ decimalSeparator });
            return formatText(value);
        },
        [formatText],
    );

    const setText = useSetText(ref, onChangeAmountProp);

    const onLayout = React.useCallback(
        (e: LayoutChangeEvent) => {
            onLayoutProp?.(e);
        },
        [onLayoutProp],
    );
    const textViewHandlers = useAmountInputHandlers(
        editable,
        onFocus,
        onBlur,
        onSelectionChange,
        formatText,
        setText,
        prevCaretPosition,
    );

    const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

    const theme = useTheme();

    /** Label is immutable */
    const labelRef = React.useRef(label);
    /** The `hasLabel` can't change because it derived from immutable ref */
    const hasLabel = React.useMemo(() => !!labelRef.current, []);

    const { expansionState, expandingValue } = useExpandingValue(
        isFocused,
        formattedText,
        defaultAmount,
        hasLabel,
    );

    const isPlaceholderVisible = usePlaceholderVisibility(expansionState, hasLabel, formattedText);

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
        if (!isPlaceholderVisible.value) {
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
    const hasChildren = React.useMemo(() => {
        return React.Children.count(childrenProcessed) > 0;
    }, [childrenProcessed]);

    const changeAmount = React.useCallback(
        function changeAmount(amount: BigNumber | undefined, callOnChangeProp?: boolean) {
            const textAttributes = formatAmount(amount);
            runOnUI(setText)(textAttributes, {
                callOnChangeProp,
            });
        },
        [formatAmount, setText],
    );
    useExtendedRef(forwardedRef, ref, changeAmount);

    const defaultValue = useDefaultValue(defaultAmount, formatAmount);
    React.useEffect(() => {
        defaultValue &&
            runOnUI(setText)(defaultValue, {
                callOnChangeProp: false,
                shouldSetText: false,
            });
    }, [defaultValue, setText]);

    const inputMessageType: InputMessageType | undefined = React.useMemo(() => {
        switch (messageType) {
            case UIAmountInputEnhancedMessageType.Error:
                return InputMessageType.Error;
            case UIAmountInputEnhancedMessageType.Success:
                return InputMessageType.Success;
            case UIAmountInputEnhancedMessageType.Warning:
                return InputMessageType.Warning;
            case UIAmountInputEnhancedMessageType.Info:
            default:
                return InputMessageType.Info;
        }
    }, [messageType]);

    const styles = useStyles(theme, editable, hasChildren);

    return (
        <InputMessage type={inputMessageType} text={message}>
            <View
                style={styles.container}
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <TapHandler inputRef={ref}>
                    <Animated.View style={styles.inputArea}>
                        <Animated.View style={[styles.inputContainer, inputStyle]}>
                            <UITextViewAnimated
                                ref={ref}
                                onLayout={onLayout}
                                {...props}
                                {...textViewHandlers}
                                style={styles.input}
                                defaultValue={defaultValue?.formattedText}
                            />
                            <UILabelAnimated
                                animatedProps={animatedPlaceholderProps}
                                style={styles.placeholder}
                            >
                                {placeholder}
                            </UILabelAnimated>

                            <FloatingLabel
                                expandingValue={expandingValue}
                                isHovered={isHovered}
                                editable={editable}
                                colors={placeholderColors}
                            >
                                {label}
                            </FloatingLabel>
                        </Animated.View>
                    </Animated.View>
                </TapHandler>
                {childrenProcessed}
            </View>
        </InputMessage>
    );
});

const useStyles = makeStyles((theme: Theme, editable: boolean, hasChildren: boolean) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor: editable
            ? theme[ColorVariants.BackgroundBW]
            : theme[ColorVariants.BackgroundTertiary],
    },
    inputArea: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: UILayoutConstant.contentOffset,
        paddingRight: hasChildren
            ? UILayoutConstant.smallContentOffset
            : UILayoutConstant.contentOffset,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    input: {
        ...Platform.select({
            web: {
                ...(!editable ? ({ cursor: 'default' } as TextStyle) : null),
                zIndex: 100,
            },
        }),
    },
    placeholder: {
        position: 'absolute',
        alignSelf: 'center',
    },
}));
