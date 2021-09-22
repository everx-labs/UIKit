import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { Typography, TypographyVariants } from '@tonlabs/uikit.themes';

export type OnHeightChange = (height: number) => void;

const textViewHeight =
    StyleSheet.flatten(Typography[TypographyVariants.ParagraphText]).lineHeight ??
    UILayoutConstant.smallCellHeight;

export function calculateWebInputHeight(elem: HTMLTextAreaElement) {
    // To get real height of a textarea
    // (that is used under the hood of TextInput in rn-web)
    // eslint-disable-next-line no-param-reassign
    elem.style.height = 'auto';

    const height = elem.scrollHeight;

    // Remove it to apply again styles we pass in props
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    elem.style.height = `${height}px`;

    return height;
}

export function useAutogrowTextView(
    ref: React.Ref<TextInput> | null,
    onHeightChange?: OnHeightChange,
    constrainedNumberOfLines?: number,
) {
    const [inputHeight, setInputHeight] = React.useState<number>(textViewHeight);

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

    const onChangeOnWeb = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_event: any) => {
            if (ref && 'current' in ref && ref.current) {
                // eslint-disable-next-line no-param-reassign
                const elem = ref.current as unknown as HTMLTextAreaElement;
                const height = calculateWebInputHeight(elem);

                onContentSizeChange({
                    nativeEvent: {
                        contentSize: {
                            height,
                        },
                    },
                });
            }
        },
        [ref, onContentSizeChange],
    );

    React.useLayoutEffect(() => {
        // When the default value is too long that it should be multiline
        // we have to force a height measurement to draw it correctly
        if (Platform.OS === 'web') {
            requestAnimationFrame(() => onChangeOnWeb(null));
        }
    }, [onChangeOnWeb]);

    const resetInputHeight = React.useCallback(() => {
        setInputHeight(textViewHeight);

        if (Platform.OS === 'web' && ref && 'current' in ref && ref.current) {
            // eslint-disable-next-line no-param-reassign
            const elem = ref.current as unknown as HTMLTextAreaElement;
            elem.style.height = `${textViewHeight}px`;
        }
    }, [ref]);

    const numberOfLines = Math.round(inputHeight / textViewHeight);
    const numberOfLinesProp = Platform.select({
        ios: numberOfLines,
        default: undefined,
    });

    const inputStyle = React.useMemo(
        () => ({
            padding: 0,
            flex: undefined,
            ...(constrainedNumberOfLines
                ? {
                      maxHeight:
                          (StyleSheet.flatten(Typography[TypographyVariants.ParagraphText])
                              .lineHeight ?? 0) * constrainedNumberOfLines,
                  }
                : null),
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
