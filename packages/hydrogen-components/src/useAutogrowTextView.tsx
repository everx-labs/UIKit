import * as React from 'react';
import { Platform, TextInput } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';

export type OnHeightChange = (height: number) => void;

export function useAutogrowTextView(
    ref: React.Ref<TextInput> | null,
    onHeightChange?: OnHeightChange,
    constrainedNumberOfLines?: number,
) {
    const [inputHeight, setInputHeight] = React.useState<number>(
        UIConstant.smallCellHeight(),
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
                        UIConstant.smallCellHeight() * constrainedNumberOfLines,
                    );
                    setInputHeight(constrainedHeight);
                } else {
                    setInputHeight(height);
                }
            }
        },
        [inputHeight],
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
    }, [onContentSizeChange]);

    const resetInputHeight = React.useCallback(() => {
        setInputHeight(UIConstant.smallCellHeight());

        if (Platform.OS === 'web' && ref && 'current' in ref && ref.current) {
            // eslint-disable-next-line no-param-reassign
            const elem = (ref.current as unknown) as HTMLTextAreaElement;
            elem.style.height = `${UIConstant.smallCellHeight()}px`;
        }
    }, []);

    const numberOfLines = Math.round(
        inputHeight / UIConstant.smallCellHeight(),
    );
    const numberOfLinesProp = Platform.select({
        ios: numberOfLines,
        default: undefined,
    });

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
    };
}
