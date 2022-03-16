import * as React from 'react';
import {
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    StyleSheet,
} from 'react-native';
import { Typography, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIMaterialTextViewProps } from './types';

export type OnHeightChange = (height: number) => void;

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
    // @ts-ignore
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
    onHeightChange: OnHeightChange | undefined,
    constrainedNumberOfLines: number | undefined,
    isHovered: boolean,
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
            const height = measureInputHeight(ref);
            onContentSizeChange(height);
        },
        [ref, onContentSizeChange],
    );

    React.useLayoutEffect(() => {
        /**
         * We have to force a height measurement to draw it correctly
         * at the first render and after the `Hover` state has changed
         */
        requestAnimationFrame(() => onChange(null));
    }, [onChange, isHovered]);

    const resetInputHeight = React.useCallback(() => {
        onChange(null);
    }, [onChange]);

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
    onHeightChange: OnHeightChange | undefined,
    isHovered: boolean,
) {
    const {
        onChange: onAutogrowChange,
        numberOfLines,
        resetInputHeight,
    } = useAutogrowTextView(ref, onHeightChange, multiline ? numberOfLinesProp : 1, isHovered);

    const onChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            if (onAutogrowChange) {
                onAutogrowChange(event);
            }

            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [onAutogrowChange, onChangeProp],
    );

    if (!multiline) {
        return {
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            resetInputHeight,
            numberOfLinesProp,
            style: undefined,
        };
    }

    console.log({ numberOfLines });

    return {
        onContentSizeChange: onContentSizeChangeProp,
        onChange,
        resetInputHeight,
        numberOfLines,
        style: {
            borderWidth: 1,
            flex: undefined,
            flexShrink: 1,
            outlineStyle: 'none',
        },
    };
}

// const styles = StyleSheet.create({
//     input: {
//         minHeight: 24, // At least size of right icons to not jump
//     },
// });
