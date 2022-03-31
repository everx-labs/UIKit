import * as React from 'react';
import {
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    StyleSheet,
} from 'react-native';
import { Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIMaterialTextViewProps, AutogrowAttributes } from '../types';

const textViewHeight =
    StyleSheet.flatten(Typography[TypographyVariants.ParagraphText]).lineHeight ??
    UILayoutConstant.smallCellHeight;

export function calculateWebInputHeight(elem: HTMLTextAreaElement) {
    // To get real height of a textarea
    // (that is used under the hood of TextInput in rn-web)
    // eslint-disable-next-line no-param-reassign
    elem.style.height = `${0}px`;

    const height = elem.scrollHeight;

    // Remove it to apply again styles we pass in props
    // eslint-disable-next-line no-param-reassign
    elem.style.height = `auto`;

    return height;
}

const measureInputHeight = (ref: React.Ref<TextInput> | null) => {
    if (ref && 'current' in ref && ref.current) {
        // eslint-disable-next-line no-param-reassign
        const elem = ref.current as unknown as HTMLTextAreaElement;
        return calculateWebInputHeight(elem) || textViewHeight;
    }
    return 0;
};

export function useMeasureAutogrowTextView(
    ref: React.Ref<TextInput> | null,
    onHeightChange: UIMaterialTextViewProps['onHeightChange'],
    multiline: boolean | undefined,
    constrainedNumberOfLines: number | undefined,
    isHovered: boolean,
    isFocused: boolean,
) {
    const [numberOfLines, setNumberOfLines] = React.useState<number>(1);
    const prevNumberOfLinesRef = React.useRef(1);
    const inputHeightRef = React.useRef(0);

    const onContentSizeChange = React.useCallback(
        (height: number) => {
            if (height <= 0) {
                return;
            }

            if (height === inputHeightRef.current) {
                return;
            }

            if (constrainedNumberOfLines) {
                const constrainedHeight = Math.min(
                    height,
                    textViewHeight * constrainedNumberOfLines,
                );
                inputHeightRef.current = constrainedHeight;
                onHeightChange?.(constrainedHeight);
            } else {
                inputHeightRef.current = height;
                onHeightChange?.(height);
            }

            const newNumberOfLines = Math.round(inputHeightRef.current / textViewHeight);
            if (prevNumberOfLinesRef.current !== newNumberOfLines) {
                prevNumberOfLinesRef.current = newNumberOfLines;
                setNumberOfLines(newNumberOfLines);
            }
        },
        [constrainedNumberOfLines, onHeightChange],
    );

    const remeasureInputHeight = React.useCallback(
        function remeasureInputHeight() {
            if (multiline) {
                const height = measureInputHeight(ref);
                onContentSizeChange(height);
            }
        },
        [ref, onContentSizeChange, multiline],
    );

    React.useEffect(() => {
        /**
         * We have to force a height measurement to draw it correctly
         * at the first render and after the `Hover` and `isFocused` state has changed
         */
        requestAnimationFrame(() => remeasureInputHeight());
    }, [remeasureInputHeight, isHovered, isFocused]);

    return {
        numberOfLines,
        remeasureInputHeight,
    };
}

export function useAutogrow(
    ref: React.Ref<TextInput>,
    onContentSizeChange: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    multiline: UIMaterialTextViewProps['multiline'],
    numberOfLinesProp: UIMaterialTextViewProps['numberOfLines'],
    onHeightChange: UIMaterialTextViewProps['onHeightChange'],
    isHovered: boolean,
    isFocused: boolean,
): AutogrowAttributes {
    const { numberOfLines, remeasureInputHeight } = useMeasureAutogrowTextView(
        ref,
        onHeightChange,
        multiline,
        numberOfLinesProp,
        isHovered,
        isFocused,
    );

    const onChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            if (multiline) {
                remeasureInputHeight();
            }

            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [remeasureInputHeight, onChangeProp, multiline],
    );

    if (!multiline) {
        return {
            onContentSizeChange,
            onChange: onChangeProp,
            remeasureInputHeight: () => null,
            numberOfLines: numberOfLinesProp,
        };
    }

    return {
        onContentSizeChange,
        onChange,
        remeasureInputHeight,
        numberOfLines,
    };
}
