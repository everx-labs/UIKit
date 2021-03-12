import * as React from 'react';
import { Platform, TextInput } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';

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

const moveWebCaret = (input: HTMLInputElement, position: number) => {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(position, position);

        return;
    }
    if ((input as any).createTextRange) {
        const range = (input as any).createTextRange();
        range.collapse(true);
        range.moveEnd(position);
        range.moveStart(position);
        range.select();
    }
};

export function useNumberFormatting(ref: React.Ref<TextInput> | null) {
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

            for (let i = 0; i < start; i += 1) {
                if (
                    lastText.current[i] === integerSeparator ||
                    lastText.current[i] === fractionalSeparator
                ) {
                    selectionStart.current -= 1;
                }
            }
        },
        [fractionalSeparator, integerSeparator],
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
                const normalizedFractionalPart = fractionalPart.replace(
                    notNumbersRegexp,
                    '',
                );

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
                carretPosition +=
                    normalizedText.length - lastNormalizedText.current.length;

                for (let i = 0; i < carretPosition; i += 1) {
                    if (
                        formattedNumber[i] === integerSeparator ||
                        formattedNumber[i] === fractionalSeparator
                    ) {
                        carretPosition += 1;
                    }
                }

                selectionStart.current = carretPosition;
            }

            // Set it to text input
            // To avoid re-rendering
            if (ref && 'current' in ref && ref.current) {
                ref.current?.setNativeProps({
                    text: formattedNumber,
                    ...Platform.select({
                        default: {
                            selection: {
                                start: carretPosition,
                                end: carretPosition,
                            },
                        },
                        web: null,
                    }),
                });
                if (Platform.OS === 'web') {
                    moveWebCaret(
                        // @ts-ignore
                        ref.current as HTMLInputElement,
                        carretPosition,
                    );
                }
            }

            lastText.current = formattedNumber;
            lastNormalizedText.current = normalizedText;
        },
        [ref, delimeter, integerSeparator, fractionalSeparator],
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
