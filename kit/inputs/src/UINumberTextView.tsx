import * as React from 'react';
import { uiLocalized } from '@tonlabs/localization';
import { UITextView, UITextViewProps, UITextViewRef } from './UITextView';
import { moveCarret } from './moveCarret';

const groupReversed = (rawString: string, groupSize: number, groupSeparator: string) => {
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
const group = (rawString: string, groupSize: number, groupSeparator: string) => {
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

function getCarretNormalizedPosition(
    carretPosition: number,
    previousText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    let carretNormalizedPosition = carretPosition;

    for (let i = 0; i < carretPosition; i += 1) {
        if (previousText[i] === integerSeparator || previousText[i] === fractionalSeparator) {
            carretNormalizedPosition -= 1;
        }
    }

    return carretNormalizedPosition;
}

function getNewCarretPosition(
    startPosition: number,
    endPosition: number,
    text: string,
    normalizedText: string,
    previousText: string,
    previousNormalizedText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    if (normalizedText.length === previousNormalizedText.length) {
        return startPosition;
    }

    // At first we should get a carret position
    // in normalized value (ie without separators)
    const startCarretNormalizedPosition = getCarretNormalizedPosition(
        startPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );
    const endCarretNormalizedPosition = getCarretNormalizedPosition(
        endPosition,
        previousText,
        integerSeparator,
        fractionalSeparator,
    );

    let newCarretPosition = startCarretNormalizedPosition;

    // We calculated normalized position exactly for this
    // as we could easily understand how many symbols
    // were put, but we can do it only with normalized values
    // as it hard to count proper value with any amount of separators in it

    newCarretPosition += normalizedText.length - previousNormalizedText.length;

    if (startCarretNormalizedPosition !== endCarretNormalizedPosition) {
        newCarretPosition += endCarretNormalizedPosition - startCarretNormalizedPosition;
    }

    // Afrer we got carret position in normalized value
    // we can get through formatted value from left position
    // and count every separator that we find on our way to the
    // carret position, that's how we shift carret from normalized
    // to position in formatted string
    for (let i = 0; i < newCarretPosition; i += 1) {
        if (text[i] === integerSeparator || text[i] === fractionalSeparator) {
            newCarretPosition += 1;
        }
    }

    return newCarretPosition;
}

export function useNumberFormatting(
    ref: React.Ref<UITextViewRef> | null,
    decimals: number = Infinity,
) {
    const selectionStart = React.useRef(0);
    const selectionEnd = React.useRef(0);

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
                selection: { start, end },
            },
        }) => {
            selectionStart.current = start;
            selectionEnd.current = end;
        },
        [],
    );

    const onChangeText = React.useCallback(
        (rawNumber: string) => {
            const [integerPart, decimalPart] = rawNumber.split(delimeter);
            let normalizedText = '';
            const result: string[] = [];
            const notNumbersRegexp = /[^0-9]/g;

            // Normalize and group integer part
            const normalizedIntegerPart = integerPart.replace(notNumbersRegexp, '');

            normalizedText += normalizedIntegerPart;

            const groupedIntegerPart = groupReversed(
                normalizedIntegerPart,
                integerGroupSize,
                integerSeparator,
            );

            result.push(groupedIntegerPart);

            // Normalize and group fractional part
            if (decimals > 0 && decimalPart != null) {
                let normalizedDecimalPart = decimalPart.replace(notNumbersRegexp, '');

                normalizedDecimalPart = normalizedDecimalPart.slice(0, decimals);

                normalizedText += delimeter;
                normalizedText += normalizedDecimalPart;

                const groupedDecimalPart = group(
                    normalizedDecimalPart,
                    fractionalGroupSize,
                    fractionalSeparator,
                );

                result.push(groupedDecimalPart);
            }

            const formattedNumber = result.join(delimeter);

            // Adjust carret (calculation)
            const carretPosition = getNewCarretPosition(
                selectionStart.current,
                selectionEnd.current,
                formattedNumber,
                normalizedText,
                lastText.current,
                lastNormalizedText.current,
                integerSeparator,
                fractionalSeparator,
            );

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
    const textViewRef = React.useRef<UITextViewRef>(null);

    const { onSelectionChange, onChangeText } = useNumberFormatting(textViewRef);

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
