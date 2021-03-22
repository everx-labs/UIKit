import * as React from 'react';
import type { TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';

import { UITextView, UITextViewProps } from './UITextView';
import { moveCarret } from './moveCarret';

const groupReversed = (
    rawString: string,
    groupSize: number,
    groupSeparator: string,
) => {
    let groupedPart = '';

    let i = rawString.length;
    while (i > 0) {
        if (groupSize < i) {
            for (let j = 0; j < groupSize; j += 1) {
                groupedPart = rawString[i - j - 1] + groupedPart;
            }

            groupedPart = groupSeparator + groupedPart;
            i -= groupSize;
        } else {
            groupedPart = rawString[i - 1] + groupedPart;
            i -= 1;
        }
    }

    return groupedPart;
};

/**
 * Anton (@sertony) also suggested cool oneliner for this:
 *
 * rawString.match(new RegExp(`\.{1,${groupSize}}`, 'gi')).join(groupSeparator);
 *
 * But it's turned out that it's 70% slower
 * https://jsbench.me/dckm6ihdfj/1
 */
const group = (
    rawString: string,
    groupSize: number,
    groupSeparator: string,
) => {
    let groupedPart = '';

    let i = 0;
    while (i < rawString.length) {
        if (groupSize < rawString.length - i) {
            for (let j = 0; j < groupSize; j += 1) {
                groupedPart += rawString[i + j];
            }

            groupedPart += groupSeparator;
            i += groupSize;
        } else {
            groupedPart += rawString[i];
            i += 1;
        }
    }

    return groupedPart;
};

export function useNumberFormatting(
    ref: React.Ref<TextInput> | null,
    decimals?: number,
) {
    const selectionStart = React.useRef(0);

    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
    } = uiLocalized.localeInfo.numbers;

    // uiLocalized for now doesn't have such configuration
    // but I think it's good to keep it here configurable
    const integerGroupSize = 3;
    const fractionalGroupSize = 3;

    const lastNormalizedText = React.useRef('');
    const lastText = React.useRef('');

    const onSelectionChange = React.useCallback(
        ({
            nativeEvent: {
                selection: { start },
            },
        }) => {
            selectionStart.current = start;
        },
        [],
    );

    const onChangeText = React.useCallback(
        (rawNumber: string) => {
            const [integerPart, fractionalPart] = rawNumber.split(delimeter);
            let normalizedText = '';
            const result: string[] = [];
            const notNumbersRegexp = /[^0-9]/g;

            // Normalize and group integer part
            const normalizedIntegerPart = integerPart.replace(
                notNumbersRegexp,
                '',
            );

            normalizedText += normalizedIntegerPart;

            const groupedIntegerPart = groupReversed(
                normalizedIntegerPart,
                integerGroupSize,
                integerSeparator,
            );

            result.push(groupedIntegerPart);

            // Normalize and group fractional part
            if (fractionalPart != null) {
                let normalizedFractionalPart = fractionalPart.replace(
                    notNumbersRegexp,
                    '',
                );

                if (decimals) {
                    normalizedFractionalPart = normalizedFractionalPart.slice(
                        0,
                        decimals,
                    );
                }

                normalizedText += delimeter;
                normalizedText += normalizedFractionalPart;

                const groupedFractionalPart = group(
                    normalizedFractionalPart,
                    fractionalGroupSize,
                    fractionalSeparator,
                );

                result.push(groupedFractionalPart);
            }

            const formattedNumber = result.join(delimeter);

            // Adjust carret (calculation)
            let carretPosition = selectionStart.current;

            if (normalizedText.length !== lastNormalizedText.current.length) {
                let carretNormalizedPosition = carretPosition;

                // At first we should get a carret position
                // in normalized value (ie without separators)
                for (let i = 0; i < carretPosition; i += 1) {
                    if (
                        lastText.current[i] === integerSeparator ||
                        lastText.current[i] === fractionalSeparator
                    ) {
                        carretNormalizedPosition -= 1;
                    }
                }

                // We calculated normalized position exactly for this
                // as we could easily understand how many symbols
                // were put, but we can do it only with normalized values
                // as it hard to count proper value with any amount of separators in it
                carretNormalizedPosition +=
                    normalizedText.length - lastNormalizedText.current.length;

                // Afrer we got carret position in normalized value
                // we can get through formatted value from left position
                // and count every separator that we find on our way to the
                // carret position, that's how we shift carret from normalized
                // to position in formatted string
                for (let i = 0; i < carretNormalizedPosition; i += 1) {
                    if (
                        formattedNumber[i] === integerSeparator ||
                        formattedNumber[i] === fractionalSeparator
                    ) {
                        carretNormalizedPosition += 1;
                    }
                }

                carretPosition = carretNormalizedPosition;
            }

            // Set it to text input
            // To avoid re-rendering
            if (ref && 'current' in ref && ref.current) {
                ref.current?.setNativeProps({
                    text: formattedNumber,
                });
                moveCarret(ref, carretPosition, formattedNumber.length);
            }

            selectionStart.current = carretPosition;
            lastText.current = formattedNumber;
            lastNormalizedText.current = normalizedText;

            return formattedNumber;
        },
        [ref, delimeter, integerSeparator, fractionalSeparator, decimals],
    );

    return {
        onSelectionChange,
        onChangeText,
    };
}

export function UINumberTextView(props: UITextViewProps) {
    const textViewRef = React.useRef<TextInput>(null);

    const { onSelectionChange, onChangeText } = useNumberFormatting(
        textViewRef,
    );

    return (
        <UITextView
            ref={textViewRef}
            keyboardType="decimal-pad"
            {...props}
            onSelectionChange={onSelectionChange}
            onChangeText={onChangeText}
        />
    );
}
