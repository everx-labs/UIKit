import * as React from 'react';
import Animated, { runOnUI, useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import { NativeModules, Platform, TextStyle, View } from 'react-native';
import { makeStyles, Theme, useTheme, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { BigNumber } from 'bignumber.js';
import { uiLocalized } from '@tonlabs/localization';
import {
    UIAmountInputRef,
    UIAmountInputProps,
    UIAmountInputMessageType,
    UIAmountInputDecimalAspect,
    BackgroundColors,
    UIAmountInputColorScheme,
} from './types';
import { AmountInputContext, defaultBackgroundColors } from './constants';
import {
    useAmountInputHandlers,
    useAmountInputHover,
    useExpandingValue,
    useExtendedRef,
    useDefaultValue,
    useFormatText,
    useSetText,
    useInputVerticalMovementStyle,
    usePlaceholderAttributes,
    useInputMessageType,
    useInputMessageColorScheme,
    useInputChildrenColorScheme,
} from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';
import { TapHandler } from './TapHandler';
import { InputMessage } from '../InputMessage';
import { FloatingLabel } from './FloatingLabel';
import { useInputChildren } from '../InputChildren';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

NativeModules.UIKitInputModule?.install();

const decimalSeparator = uiLocalized.localeInfo.numbers.decimal;

export const UIAmountInputContent = React.forwardRef<UIAmountInputRef, UIAmountInputProps>(
    function UIAmountInputContent(
        {
            children,
            placeholder = '',
            defaultAmount,
            onMessagePress,
            backgroundColors = defaultBackgroundColors,
            colorScheme = UIAmountInputColorScheme.Default,
            ...props
        }: UIAmountInputProps,
        forwardedRef: React.Ref<UIAmountInputRef>,
    ) {
        const {
            editable = true,
            onFocus,
            onBlur,
            onHover,
            onSelectionChange,
            onChangeAmount: onChangeAmountProp,
            decimalAspect = UIAmountInputDecimalAspect.Precision,
            multiline,
            message,
            messageType = UIAmountInputMessageType.Info,
            label,
        } = props;
        // @ts-ignore
        const ref = useAnimatedRef<UITextViewRef>();

        const { isFocused, formattedText, isHovered, selectionEndPosition } =
            React.useContext(AmountInputContext);

        const prevCaretPosition = useSharedValue(selectionEndPosition.value);

        /**
         * Format the text according to the "mask" of the amount input.
         */
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

        /**
         * Set a new text value in the input.
         */
        const setText = useSetText(ref, onChangeAmountProp);

        /**
         * Handlers to process the input events:
         * `onFocus`, `onBlur`, `onChange`, `onSelectionChange`.
         * Synchronize the input state.
         */
        const textViewHandlers = useAmountInputHandlers(
            editable,
            onFocus,
            onBlur,
            onSelectionChange,
            formatText,
            setText,
            prevCaretPosition,
        );

        /**
         * Handlers to process the input event `isHovered`
         * Synchronize the input `isHovered` state.
         */
        const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

        /** Label is immutable */
        const hasLabel = React.useRef(!!label).current;

        const { expansionState, expandingValue } = useExpandingValue(
            isFocused,
            formattedText,
            defaultAmount,
            hasLabel,
        );

        const inputVerticalMovementStyle = useInputVerticalMovementStyle(expandingValue);

        const { placeholderColors, animatedPlaceholderProps } = usePlaceholderAttributes(
            expansionState,
            hasLabel,
            editable,
            colorScheme,
        );

        const inputChildrenColorScheme = useInputChildrenColorScheme(colorScheme);
        const childrenProcessed = useInputChildren(children, inputChildrenColorScheme);

        /**
         * Setup the AmountInput ref.
         */
        useExtendedRef(forwardedRef, ref, formatAmount, setText);

        const defaultValue = useDefaultValue(defaultAmount, formatAmount);
        /**
         * Make the input state consistent with defaultValue.
         */
        React.useEffect(() => {
            defaultValue &&
                runOnUI(setText)(defaultValue, {
                    callOnChangeProp: false,
                    shouldSetText: false,
                });
        }, [defaultValue, setText]);

        const inputMessageType = useInputMessageType(messageType);

        const inputMessageColorScheme = useInputMessageColorScheme(colorScheme);

        const hasChildren = React.useMemo(() => {
            return React.Children.count(childrenProcessed) > 0;
        }, [childrenProcessed]);
        const theme = useTheme();
        const styles = useStyles(theme, editable, hasChildren, backgroundColors);

        return (
            <>
                <View
                    style={styles.container}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <TapHandler inputRef={ref}>
                        <Animated.View style={styles.inputArea}>
                            <Animated.View
                                style={[styles.inputContainer, inputVerticalMovementStyle]}
                            >
                                <UITextViewAnimated
                                    ref={ref}
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
                <InputMessage
                    type={inputMessageType}
                    onPress={onMessagePress}
                    colorScheme={inputMessageColorScheme}
                >
                    {message}
                </InputMessage>
            </>
        );
    },
);

const useStyles = makeStyles(
    (
        theme: Theme,
        editable: boolean,
        hasChildren: boolean,
        backgroundColors: BackgroundColors,
    ) => ({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: UILayoutConstant.input.borderRadius,
            backgroundColor: editable
                ? theme[backgroundColors.regular]
                : theme[backgroundColors.disabled],
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
    }),
);
