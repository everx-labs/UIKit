import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import BigNumber from 'bignumber.js';

import { UIInputAccessoryView } from '@tonlabs/uikit.keyboard';
import { ChatInputContainer } from '@tonlabs/uikit.chats';
import {
    UITextView,
    useUITextViewValue,
    ColorVariants,
    UILabel,
    UILabelRoles,
    useNumberFormatting,
    useAutogrowTextView,
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

function useValidation(decimalDivider: number, min: BigNumber | null, max: BigNumber | null) {
    const [validationStatus, setValidationStatus] = React.useState(ValidationStatus.None);

    const checkValidation = React.useCallback(
        (rawAmount: BigNumber | string) => {
            const amount = BigNumber.isBigNumber(rawAmount)
                ? rawAmount.dividedBy(decimalDivider)
                : getBigNumberFromRawString(rawAmount);

            if (max != null && amount.isGreaterThan(max)) {
                setValidationStatus(ValidationStatus.Bigger);

                return false;
            }

            if (min != null && amount.isLessThan(min)) {
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
        return undefined;
    }, [validationStatus, max, min]);

    return {
        validationStatus,
        validationString,
        setValidationStatus,
        checkValidation,
    };
}

const getHintColor = (status: ValidationStatus) => {
    if (status !== ValidationStatus.None) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextTertiary;
};

const getBigNumberFromRawString = (value: string) => {
    const { decimal } = uiLocalized.localeInfo.numbers;
    if (value[0] === decimal) {
        // eslint-disable-next-line no-param-reassign
        value = `0${value}`;
    }

    const clearedValue = value.replace(new RegExp(`[^0-9${decimal}]`, 'g'), '');

    return new BigNumber(clearedValue.replace(decimal, '.'));
};

function numberToSignsCount(number: string, count: number) {
    if (number.length < count) {
        return `${number}${'0'.repeat(count - number.length)}`;
    }

    if (number.length > count) {
        return number.slice(0, count);
    }

    return number;
}

type UIAmountInputHintProps = {
    validationText?: string;
    validationStatus: ValidationStatus;

    decimals: number;
    min: BigNumber | null;
    max: BigNumber | null;
};

const UIAmountInputHint = React.memo(function UIAmountInputHintMemoized({
    validationText,
    validationStatus,
    decimals: decimalsProp,
    min,
    max,
}: UIAmountInputHintProps) {
    const minMaxHint = React.useMemo(() => {
        if (min == null && max == null) {
            return null;
        }

        const fmt = {
            decimalSeparator: uiLocalized.localeInfo.numbers.decimal,
        };
        const minParts = min?.toFormat(fmt).split(fmt.decimalSeparator);
        const maxParts = max?.toFormat(fmt).split(fmt.decimalSeparator);

        let minInteger = null;
        let minDecimal = null;
        let maxInteger = null;
        let maxDecimal = null;

        if (minParts) {
            [minInteger, minDecimal] = minParts;
        }

        if (maxParts) {
            [maxInteger, maxDecimal] = maxParts;
        }

        const decimals = Math.min(
            Math.max(minDecimal?.length || 0, maxDecimal?.length || 0),
            decimalsProp,
        );

        if (minDecimal) {
            minDecimal = numberToSignsCount(minDecimal, decimals);
        }

        if (maxDecimal) {
            maxDecimal = numberToSignsCount(maxDecimal, decimals);
        }

        const minString = minParts
            ? [minInteger, minDecimal].filter(i => i != null).join(fmt.decimalSeparator)
            : null;
        const maxString = maxParts
            ? [maxInteger, maxDecimal].filter(i => i != null).join(fmt.decimalSeparator)
            : null;

        const hint = [
            minString != null ? `${uiLocalized.Browser.AmountInput.HintMin} ${minString}` : null,
            maxString != null ? `${maxString} ${uiLocalized.Browser.AmountInput.HintMax}` : null,
        ]
            .filter(i => i != null)
            .join(' – ');

        return hint;
    }, [decimalsProp, min, max]);

    if (validationText) {
        return (
            <UILabel
                role={UILabelRoles.ParagraphFootnote}
                color={getHintColor(validationStatus)}
                style={styles.hint}
                numberOfLines={1}
            >
                {validationText}
            </UILabel>
        );
    }

    if (minMaxHint) {
        return (
            <UILabel
                role={UILabelRoles.ParagraphFootnote}
                color={ColorVariants.TextTertiary}
                style={styles.hint}
            >
                {minMaxHint}
            </UILabel>
        );
    }

    return null;
});

type UIAmountInputInternalProps = {
    textInputRef: React.RefObject<TextInput>;
    placeholder?: string;

    decimals: number;
    min?: BigNumber;
    max?: BigNumber;

    onSendAmount: OnSendAmount;
    onHeightChange?: OnHeightChange;
};

function UIAmountInputInternal({
    textInputRef,
    placeholder: placeholderProp,
    decimals,
    min: minProp,
    max: maxProp,
    onHeightChange,
    onSendAmount: onSendAmountProp,
}: UIAmountInputInternalProps) {
    const { onChange, onContentSizeChange, numberOfLines, resetInputHeight, inputStyle } =
        useAutogrowTextView(textInputRef, onHeightChange, 1);

    const {
        inputHasValue,
        inputValue,
        clear: clearBase,
        onChangeText: onChangeTextBase,
        onKeyPress: onKeyPressBase,
    } = useUITextViewValue(textInputRef, true);

    const { decimalDivider, decimalPlaceholder, min, max } = React.useMemo(() => {
        const divider = 10 ** decimals;
        return {
            decimalDivider: divider,
            decimalPlaceholder: `.${new Array(decimals)
                .fill(null)
                .map(() => '0')
                .join('')}`,
            min: minProp != null ? minProp.dividedBy(divider) : null,
            max: maxProp != null ? maxProp.dividedBy(divider) : null,
        };
    }, [decimals, minProp, maxProp]);

    const { validationStatus, validationString, setValidationStatus, checkValidation } =
        useValidation(decimalDivider, min, max);

    const { onChangeText: onChangeTextFormatting, onSelectionChange } = useNumberFormatting(
        textInputRef,
        decimals,
    );

    const onChangeText = React.useCallback(
        (text: string) => {
            onChangeTextBase(onChangeTextFormatting(text));

            if (validationStatus !== ValidationStatus.None) {
                setValidationStatus(ValidationStatus.None);
            }
        },
        [onChangeTextBase, onChangeTextFormatting, setValidationStatus, validationStatus],
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
        const amount = getBigNumberFromRawString(inputValue.current).multipliedBy(decimalDivider);

        if (!checkValidation(amount)) {
            return;
        }

        onSendAmountProp(amount);
        clearBase();
    }, [onSendAmountProp, clearBase, inputValue, decimalDivider, checkValidation]);

    const clear = React.useCallback(() => {
        clearBase();

        textInputRef.current?.focus();

        setValidationStatus(ValidationStatus.None);
        resetInputHeight();
    }, [clearBase, setValidationStatus, textInputRef, resetInputHeight]);

    const onKeyPress = React.useCallback(
        (e: any) => {
            const wasClearedWithEnter = onKeyPressBase(e);

            if (wasClearedWithEnter) {
                onActionPress();
            }
        },
        [onActionPress, onKeyPressBase],
    );

    return (
        <ChatInputContainer
            numberOfLines={numberOfLines}
            right={
                <ActionButton
                    inputHasValue={inputHasValue}
                    hasError={validationStatus !== ValidationStatus.None}
                    onPress={onActionPress}
                    clear={clear}
                />
            }
        >
            <UIAmountInputHint
                validationText={validationString}
                validationStatus={validationStatus}
                decimals={decimals}
                min={min}
                max={max}
            />
            <UITextView
                ref={textInputRef}
                testID="browser_amount_input"
                autoCapitalize="sentences"
                autoCorrect={false}
                autoFocus
                clearButtonMode="never"
                keyboardType="decimal-pad"
                editable
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                onSelectionChange={onSelectionChange}
                onContentSizeChange={onContentSizeChange}
                onChange={onChange}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}
                style={inputStyle}
            />
        </ChatInputContainer>
    );
}

type UIAmountInputProps = {
    placeholder?: string;

    decimals: number;
    min?: BigNumber;
    max?: BigNumber;

    onSendAmount: OnSendAmount;
    onHeightChange?: OnHeightChange;
};

export function UIAmountInput(props: UIAmountInputProps) {
    const textInputRef = React.useRef<TextInput>(null);
    const { onHeightChange } = props;

    React.useEffect(
        () => () => {
            if (onHeightChange) {
                // If inputs is unmounted need to reset insets for list
                onHeightChange(0);
            }
        },
        [onHeightChange],
    );

    return (
        <UIInputAccessoryView managedScrollViewNativeID="browserList">
            <UIAmountInputInternal
                textInputRef={textInputRef}
                placeholder={props.placeholder}
                decimals={props.decimals}
                min={props.min}
                max={props.max}
                onSendAmount={props.onSendAmount}
                onHeightChange={Platform.OS === 'web' ? onHeightChange : undefined}
            />
        </UIInputAccessoryView>
    );
}

const styles = StyleSheet.create({
    hint: { marginBottom: 4 },
});
