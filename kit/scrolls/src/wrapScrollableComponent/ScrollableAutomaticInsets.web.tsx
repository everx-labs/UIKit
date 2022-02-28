/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import type { Insets, ScrollViewProps } from 'react-native';

export const ScrollableAutomaticInsets = React.memo(function ScrollableAutomaticInsets(_props: {
    automaticallyAdjustContentInsets?: boolean;
    automaticallyAdjustKeyboardInsets?: boolean;
    keyboardInsetAdjustmentBehavior?: 'inclusive' | 'exclusive';
    contentInset: ScrollViewProps['contentInset'];
    onInsetsChange?: (insets: Insets) => void;
}) {
    return null;
});
