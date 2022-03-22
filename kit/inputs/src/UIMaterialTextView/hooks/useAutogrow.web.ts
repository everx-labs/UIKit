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
    elem.style.height = `${height}px`;

    return height;
}

const measureInputHeight = (ref: React.Ref<TextInput> | null) => {
    if (ref && 'current' in ref && ref.current) {
        // eslint-disable-next-line no-param-reassign
        const elem = ref.current as unknown as HTMLTextAreaElement;
        return calculateWebInputHeight(elem);
    }
    return 0;
};

export function useAutogrowTextView(
    ref: React.Ref<TextInput> | null,
    onHeightChange: UIMaterialTextViewProps['onHeightChange'],
    multiline: boolean | undefined,
    constrainedNumberOfLines: number | undefined,
    isHovered: boolean,
    isFocused: boolean,
) {
    const [inputHeight, setInputHeight] = React.useState<number>(0);

    const onContentSizeChange = React.useCallback(
        (height: number) => {
            if (height <= 0) {
                return;
            }

            if (height === inputHeight) {
                return;
            }

            if (onHeightChange) {
                onHeightChange(height);
            }

            if (constrainedNumberOfLines) {
                const constrainedHeight = Math.min(
                    height,
                    textViewHeight * constrainedNumberOfLines,
                );
                setInputHeight(constrainedHeight);
            } else {
                setInputHeight(height);
            }
        },
        [inputHeight, constrainedNumberOfLines, onHeightChange],
    );

    const onChange = React.useCallback(
        (_event: any) => {
            if (multiline) {
                const height = measureInputHeight(ref);
                onContentSizeChange(height);
            }
        },
        [ref, onContentSizeChange, multiline],
    );

    React.useLayoutEffect(() => {
        /**
         * We have to force a height measurement to draw it correctly
         * at the first render and after the `Hover` state has changed
         */
        if (multiline) {
            requestAnimationFrame(() => onChange(null));
        }
    }, [onChange, isHovered, multiline, isFocused]);

    const resetInputHeight = React.useCallback(() => {
        if (multiline) {
            onChange(null);
        }
    }, [onChange, multiline]);

    const numberOfLines = Math.round(inputHeight / textViewHeight);

    return {
        onChange,
        resetInputHeight,
        numberOfLines,
    };
}

export function useAutogrow(
    ref: React.Ref<TextInput>,
    onContentSizeChangeProp: UIMaterialTextViewProps['onContentSizeChange'],
    onChangeProp: UIMaterialTextViewProps['onChange'],
    multiline: UIMaterialTextViewProps['multiline'],
    numberOfLinesProp: UIMaterialTextViewProps['numberOfLines'],
    onHeightChange: UIMaterialTextViewProps['onHeightChange'],
    isHovered: boolean,
    isFocused: boolean,
): AutogrowAttributes {
    const {
        onChange: onAutogrowChange,
        numberOfLines,
        resetInputHeight,
    } = useAutogrowTextView(
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
                onAutogrowChange(event);
            }

            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [onAutogrowChange, onChangeProp, multiline],
    );

    if (!multiline) {
        return {
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            resetInputHeight,
            numberOfLines: numberOfLinesProp,
        };
    }

    return {
        onContentSizeChange: onContentSizeChangeProp,
        onChange,
        resetInputHeight,
        numberOfLines,
    };
}
