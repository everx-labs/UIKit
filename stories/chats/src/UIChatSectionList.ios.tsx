/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { DefaultSectionT, SectionList, SectionListProps, View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';

import type { ChatMessage } from './types';

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
            ...chatListProps
        }: Props<ItemT, SectionT>,
        forwardRef: React.Ref<SectionList<ItemT, SectionT>>,
    ) {
        return (
            <View style={UIStyle.common.flex()}>
                <SectionList
                    ref={forwardRef}
                    {...chatListProps}
                    automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                    // @ts-ignore
                    automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
                    contentInset={contentInset}
                />
            </View>
        );
    }),
);
