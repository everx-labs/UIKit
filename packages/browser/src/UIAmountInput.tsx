import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import BigNumber from 'bignumber.js';

import { UICustomKeyboard } from '@tonlabs/uikit.keyboard';
import { useBackHandler, ChatInputContainer } from '@tonlabs/uikit.chats';
import {
    UITextView,
    useUITextViewValue,
    ColorVariants,
    UILabel,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';
import type { OnHeightChange, OnSendAmount } from './types';
import { ActionButton } from './ActionButton';

// eslint-disable-next-line no-shadow
enum ValidationStatus {
    None = 'None',
    Bigger = 'Bigger',
    Less = 'Less',
}

function useValidation(
    decimalDivider: number,
    min: number | null,
    max: number | null,
) {
    const [validationStatus, setValidationStatus] = React.useState(
        ValidationStatus.None,
    );

    const checkValidation = React.useCallback(
        (rawAmount: BigNumber | string) => {
            const amount = BigNumber.isBigNumber(rawAmount)
                ? rawAmount.dividedBy(decimalDivider)
                : getBigNumberFromRawString(rawAmount);

            if (max != null && amount.isGreaterThanOrEqualTo(max)) {
                setValidationStatus(ValidationStatus.Bigger);

                return false;
            }

            if (min != null && amount.isLessThanOrEqualTo(min)) {
                setValidationStatus(ValidationStatus.Less);

                return false;
            }

            return true;
        },
        [decimalDivider, max, min, setValidationStatus],
    );

    const validationString = React.useMemo(() => {
        if (validationStatus === ValidationStatus.Bigger) {
            return uiLocalized.formatString(
                uiLocalized.Browser.AmountInput.ErrorBigger,
                uiLocalized.amountToLocale(max),
            );
        }
        if (validationStatus === ValidationStatus.Less) {
            return uiLocalized.formatString(
                uiLocalized.Browser.AmountInput.ErrorLess,
                uiLocalized.amountToLocale(min),
            );
        }
        return null;
    }, [validationStatus, max, min]);

    return {
        validationStatus,
        validationString,
        setValidationStatus,
        checkValidation,
    };
}

const getBigNumberFromRawString = (value: string) => {
    return new BigNumber(value.replace(',', '.'));
};

type UIAmountInputInternalProps = {
    textInputRef: React.RefObject<TextInput>;
    placeholder?: string;

    decimal: number;
    min?: number;
    max?: number;

    onSendAmount: OnSendAmount;
    onHeightChange?: OnHeightChange;
};

function UIAmountInputInternal({
    textInputRef,
    placeholder: placeholderProp,
    decimal,
    min: minProp,
    max: maxProp,
    onHeightChange,
    onSendAmount: onSendAmountProp,
}: UIAmountInputInternalProps) {
    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (event && event.nativeEvent) {
                const { contentSize } = event.nativeEvent;
                const height = contentSize?.height || 0;

                if (height <= 0) {
                    return;
                }

                if (onHeightChange) {
                    onHeightChange(height);
                }
            }
        },
        [onHeightChange],
    );

    const {
        inputHasValue,
        inputValue,
        clear: clearBase,
        onChangeText: onChangeTextBase,
        onKeyPress,
    } = useUITextViewValue(textInputRef);

    const {
        decimalDivider,
        decimalPlaceholder,
        min,
        max,
    } = React.useMemo(() => {
        const divider = 10 ** decimal;
        return {
            decimalDivider: divider,
            decimalPlaceholder: `.${new Array(decimal)
                .fill(null)
                .map(() => '0')
                .join('')}`,
            min: minProp != null ? minProp / divider : null,
            max: maxProp != null ? maxProp / divider : null,
        };
    }, [decimal, minProp, maxProp]);

    const {
        validationStatus,
        validationString,
        setValidationStatus,
        checkValidation,
    } = useValidation(decimalDivider, min, max);

    const onChangeText = React.useCallback(
        (text: string) => {
            const hasNotValidCharsRegExp = /[^0-9,.]/g;

            const validatedText = text
                .replace(hasNotValidCharsRegExp, '')
                .split(/[,.]/)
                .slice(0, 2)
                .map((part, index) => {
                    if (index === 1) {
                        return part.slice(0, decimal);
                    }
                    return part;
                })
                .join(uiLocalized.localeInfo.decimal);

            if (text !== validatedText) {
                textInputRef.current?.setNativeProps({
                    text: validatedText,
                });
            }

            onChangeTextBase(validatedText);

            if (validationStatus !== ValidationStatus.None) {
                setValidationStatus(ValidationStatus.None);
            }
        },
        [
            textInputRef,
            onChangeTextBase,
            decimal,
            validationStatus,
            setValidationStatus,
        ],
    );

    const [isFocused, setIsFocused] = React.useState(true);

    const onFocus = React.useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const onBlur = React.useCallback(() => {
        setIsFocused(false);

        checkValidation(inputValue.current);
    }, [setIsFocused, inputValue, checkValidation]);

    const placeholder = React.useMemo(() => {
        if (isFocused) {
            return decimalPlaceholder;
        }

        if (placeholderProp) {
            return placeholderProp;
        }

        return uiLocalized.Browser.AmountInput.Placeholder;
    }, [placeholderProp, isFocused, decimalPlaceholder]);

    const placeholderColor = React.useMemo(() => {
        if (isFocused) {
            return ColorVariants.TextTertiary;
        }

        return undefined;
    }, [isFocused]);

    const onActionPress = React.useCallback(() => {
        const amount = getBigNumberFromRawString(
            inputValue.current,
        ).multipliedBy(decimalDivider);

        if (!checkValidation(amount)) {
            return;
        }

        onSendAmountProp(amount);
        clearBase();
    }, [
        onSendAmountProp,
        clearBase,
        inputValue,
        decimalDivider,
        checkValidation,
    ]);

    const clear = React.useCallback(() => {
        clearBase();

        textInputRef.current?.focus();

        setValidationStatus(ValidationStatus.None);
    }, [clearBase, setValidationStatus, textInputRef]);

    return (
        <ChatInputContainer
            numberOfLines={1}
            right={
                <ActionButton
                    inputHasValue={inputHasValue}
                    hasError={validationStatus !== ValidationStatus.None}
                    onPress={onActionPress}
                    clear={clear}
                />
            }
        >
            {validationString != null ? (
                <UILabel
                    role={UILabelRoles.ParagraphFootnote}
                    color={ColorVariants.TextNegative}
                    style={styles.hint}
                    numberOfLines={1}
                >
                    {validationString}
                </UILabel>
            ) : null}
            <UITextView
                ref={textInputRef}
                testID="browser_input"
                autoCapitalize="sentences"
                autoCorrect={false}
                autoFocus
                clearButtonMode="never"
                keyboardType="decimal-pad"
                editable
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                onContentSizeChange={onContentSizeChange}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </ChatInputContainer>
    );
}

type UIAmountInputProps = {
    placeholder?: string;

    decimal: number;
    min?: number;
    max?: number;

    onSendAmount: OnSendAmount;
    onHeightChange?: OnHeightChange;
};

export function UIAmountInput(props: UIAmountInputProps) {
    const textInputRef = React.useRef<TextInput>(null);
    const { onHeightChange } = props;

    useBackHandler(textInputRef);

    React.useEffect(
        () => () => {
            if (onHeightChange) {
                // If inputs is unmounted need to reset insets for list
                onHeightChange(0);
            }
        },
        [onHeightChange],
    );

    const input = (
        <UIAmountInputInternal
            textInputRef={textInputRef}
            placeholder={props.placeholder}
            decimal={props.decimal}
            min={props.min}
            max={props.max}
            onSendAmount={props.onSendAmount}
            onHeightChange={Platform.OS === 'web' ? onHeightChange : undefined}
        />
    );

    return (
        <UICustomKeyboard
            renderContent={() => input}
            kbInputRef={textInputRef}
            onHeightChange={props.onHeightChange}
            customKeyboardVisible={false}
        />
    );
}

const styles = StyleSheet.create({
    hint: { marginBottom: 4 },
});
