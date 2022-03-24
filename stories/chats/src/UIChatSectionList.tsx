/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { SectionList, SectionListProps, DefaultSectionT } from 'react-native';

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            automaticallyAdjustContentInsets,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            automaticallyAdjustKeyboardInsets,
            ...chatListProps
        }: Props<ItemT, SectionT>,
        forwardRef: React.Ref<SectionList<ItemT, SectionT>>,
    ) {
        return <SectionList ref={forwardRef} {...chatListProps} />;
    }),
);
