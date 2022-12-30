/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import {
    SectionList,
    SectionListProps,
    DefaultSectionT,
    StyleSheet,
    ViewStyle,
    View,
} from 'react-native';

import type { ChatMessage } from './types';

function getContentContainerPadding(padding: ViewStyle['padding'], inset: number | undefined) {
    if (padding == null) {
        return inset ?? 0;
    }

    if (typeof padding === 'string') {
        return padding;
    }

    return padding + (inset ?? 0);
}

type Props<ItemT, SectionT> = SectionListProps<ItemT, SectionT> & {
    automaticallyAdjustContentInsets: boolean;
    automaticallyAdjustKeyboardInsets: boolean;
};

export const UIChatSectionList = React.memo(
    React.forwardRef<SectionList, Props<any, any>>(function UIChatSectionList<
        ItemT extends ChatMessage,
        SectionT extends DefaultSectionT,
    >(
        {
            automaticallyAdjustContentInsets,
            automaticallyAdjustKeyboardInsets,
            contentInset,
            contentContainerStyle: contentContainerStyleProp,
            ...chatListProps
        }: Props<ItemT, SectionT>,
        forwardRef: React.Ref<SectionList<ItemT, SectionT>>,
    ) {
        const contentContainerStyle: ViewStyle = React.useMemo(() => {
            const style = StyleSheet.flatten(contentContainerStyleProp) || {};

            return {
                ...style,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
                paddingLeft: getContentContainerPadding(
                    style.paddingLeft || style.paddingHorizontal,
                    contentInset?.left,
                ),
                // As the scrollable is inverted
                // it's actually a top inset
                paddingBottom: getContentContainerPadding(
                    style.paddingTop || style.paddingVertical,
                    contentInset?.top,
                ),
                paddingRight: getContentContainerPadding(
                    style.paddingRight || style.paddingHorizontal,
                    contentInset?.right,
                ),
                // As the scrollable is inverted
                // it's actually a bottom inset
                paddingTop: getContentContainerPadding(
                    style.paddingBottom || style.paddingVertical,
                    contentInset?.bottom,
                ),
            };
        }, [contentInset, contentContainerStyleProp]);

        return (
            <View style={styles.container}>
                <SectionList
                    ref={forwardRef}
                    {...chatListProps}
                    contentContainerStyle={contentContainerStyle}
                    automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                    // @ts-ignore
                    automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                    // @ts-ignore
                    keyboardInsetAdjustmentBehavior="inclusive"
                />
            </View>
        );
    }),
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
