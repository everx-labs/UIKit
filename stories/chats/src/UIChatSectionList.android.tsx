/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import {
    Insets,
    SectionList,
    SectionListProps,
    DefaultSectionT,
    StyleSheet,
    ViewStyle,
    View,
} from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { ScrollableAutomaticInsets } from '@tonlabs/uikit.scrolls';

import type { ChatMessage } from './types';

const emptyInsets: Insets = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
};

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
        const automaticInsets =
            automaticallyAdjustContentInsets || automaticallyAdjustKeyboardInsets;

        const [internalContentInset, setInternalContentInset] = React.useState<Insets>(
            contentInset || emptyInsets,
        );

        const contentContainerStyle: ViewStyle = React.useMemo(() => {
            const style = StyleSheet.flatten(contentContainerStyleProp) || {};

            return {
                ...style,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
                paddingLeft: getContentContainerPadding(
                    style.paddingLeft || style.paddingHorizontal,
                    internalContentInset.left,
                ),
                // As the scrollable is inverted
                // it's actually a top inset
                paddingBottom: getContentContainerPadding(
                    style.paddingTop || style.paddingVertical,
                    internalContentInset.top,
                ),
                paddingRight: getContentContainerPadding(
                    style.paddingRight || style.paddingHorizontal,
                    internalContentInset.right,
                ),
                // As the scrollable is inverted
                // it's actually a bottom inset
                paddingTop: getContentContainerPadding(
                    style.paddingBottom || style.paddingVertical,
                    internalContentInset.bottom,
                ),
            };
        }, [internalContentInset, contentContainerStyleProp]);

        return (
            <View style={UIStyle.common.flex()}>
                <SectionList
                    ref={forwardRef}
                    {...chatListProps}
                    contentContainerStyle={contentContainerStyle}
                />
                {automaticInsets ? (
                    <ScrollableAutomaticInsets
                        automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                        automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                        keyboardInsetAdjustmentBehavior="inclusive"
                        contentInset={contentInset}
                        onInsetsChange={setInternalContentInset}
                    />
                ) : null}
            </View>
        );
    }),
);
