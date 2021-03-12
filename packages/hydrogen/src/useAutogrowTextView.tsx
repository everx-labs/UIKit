import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { UIConstant } from './constants';
import { Typography, TypographyVariants } from './Typography';

export type OnHeightChange = (height: number) => void;

const textViewHeight =
    StyleSheet.flatten(Typography[TypographyVariants.ParagraphText])
        .lineHeight ?? UIConstant.smallCellHeight;

export function useAutogrowTextView(
    ref: React.Ref<TextInput> | null,
    onHeightChange?: OnHeightChange,
    constrainedNumberOfLines: number = 1,
) {
    const [inputHeight, setInputHeight] = React.useState<number>(
        UIConstant.smallCellHeight,
    );

    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (event && event.nativeEvent) {
                const { contentSize } = event.nativeEvent;
                const height = contentSize?.height || 0;

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
            }
        },
        [inputHeight, constrainedNumberOfLines, onHeightChange],
    );

    const onChangeOnWeb = React.useCallback(() => {
        if (ref && 'current' in ref && ref.current) {
            // eslint-disable-next-line no-param-reassign
            const elem = (ref.current as unknown) as HTMLTextAreaElement;
            // To get real height of a textarea
            // (that is used under the hood of TextInput in rn-web)
            elem.style.height = 'auto';
            onContentSizeChange({
                nativeEvent: {
                    contentSize: {
                        height: elem.scrollHeight,
                    },
                },
            });
            // Remove it to apply again styles we pass in props
            // @ts-ignore
            elem.style.height = `${elem.scrollHeight}px`;
        }
    }, [ref, onContentSizeChange]);

    const resetInputHeight = React.useCallback(() => {
        setInputHeight(UIConstant.smallCellHeight);

        if (Platform.OS === 'web' && ref && 'current' in ref && ref.current) {
            // eslint-disable-next-line no-param-reassign
            const elem = (ref.current as unknown) as HTMLTextAreaElement;
            elem.style.height = `${UIConstant.smallCellHeight}px`;
        }
    }, [ref]);

    const numberOfLines = Math.round(inputHeight / UIConstant.smallCellHeight);
    const numberOfLinesProp = Platform.select({
        ios: numberOfLines,
        default: undefined,
    });

    const inputStyle = React.useMemo(
        () => ({
            padding: 0,
            flex: undefined,
            maxHeight:
                (StyleSheet.flatten(
                    Typography[TypographyVariants.ParagraphText],
                ).lineHeight ?? 0) * constrainedNumberOfLines,
            ...Platform.select({
                web: {
                    outlineStyle: 'none',
                },
            }),
        }),
        [constrainedNumberOfLines],
    );

    return {
        onContentSizeChange: Platform.select({
            web: undefined, // All the work is done in onChangeOnWeb
            default: onContentSizeChange,
        }),
        onChange: Platform.select({
            web: onChangeOnWeb,
            default: undefined,
        }),
        resetInputHeight,
        inputHeight,
        numberOfLines,
        numberOfLinesProp,
        inputStyle,
    };
}
