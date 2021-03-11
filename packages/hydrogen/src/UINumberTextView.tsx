import * as React from 'react';
import type { TextInput } from 'react-native';

import { UITextView, UITextViewProps } from './UITextView';

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

const compareTexts = (
    currentText: string,
    lastText: string,
    selectionStart: number,
) => {
    if (currentText.length > lastText.length) {
        for (let i = selectionStart; i < currentText.length; i += 1) {
            if (currentText[i] !== lastText[i]) {
                return {
                    type: 'added',
                    symbol: currentText[i],
                    position: i,
                };
            }
        }
    } else {
        for (let i = selectionStart - 1; i < currentText.length; i += 1) {
            if (currentText[i] !== lastText[i]) {
                return {
                    type: 'deleted',
                    symbol: lastText[i],
                    position: i,
                };
            }
        }
    }
    return {
        type: 'none',
    };
};

export function useNumberFormatting(ref: React.Ref<TextInput> | null) {
    const selectionStart = React.useRef(0);
    const selectionEnd = React.useRef(0);

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

    const delimeter = '.'; // TODO
    const integerGroupSize = 3; // TODO
    const integerSeparator = ','; // TODO
    const fractionalGroupSize = 3; // TODO
    const fractionalSeparator = ' '; // TODO

    const lastText = React.useRef('');

    const onChangeText = React.useCallback(
        (rawNumber: string) => {
            const compared = compareTexts(
                rawNumber,
                lastText.current,
                selectionStart.current,
            );

            if (compared.type === 'deleted') {
                if (
                    compared.symbol === integerSeparator ||
                    compared.symbol === fractionalSeparator
                ) {
                    // eslint-disable-next-line no-param-reassign
                    rawNumber =
                        rawNumber.slice(0, compared.position - 1) +
                        rawNumber.slice(compared.position);
                }
            }

            const [integerPart, fractionalPart] = rawNumber.split(delimeter);
            const result: string[] = [];

            const notNumbersRegexp = /[^0-9]/g;

            const normalizedIntegerPart = integerPart.replace(
                notNumbersRegexp,
                '',
            );
            const groupedIntegerPart = groupReversed(
                normalizedIntegerPart,
                integerGroupSize,
                integerSeparator,
            );

            result.push(groupedIntegerPart);

            if (fractionalPart != null) {
                const normalizedFractionalPart = fractionalPart.replace(
                    notNumbersRegexp,
                    '',
                );
                const groupedFractionalPart = group(
                    normalizedFractionalPart,
                    fractionalGroupSize,
                    fractionalSeparator,
                );

                result.push(groupedFractionalPart);
            }

            const formattedNumber = result.join(delimeter);

            if (ref && 'current' in ref) {
                ref.current?.setNativeProps({
                    text: formattedNumber,
                });
            }
            lastText.current = formattedNumber;
        },
        [ref],
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
            {...props}
            onSelectionChange={onSelectionChange}
            onChangeText={onChangeText}
        />
    );
}
