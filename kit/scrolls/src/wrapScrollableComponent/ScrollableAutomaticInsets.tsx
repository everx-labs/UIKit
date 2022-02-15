/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { requireNativeComponent, ScrollViewProps } from 'react-native';

const UIKitScrollViewInsets = requireNativeComponent('UIKitScrollViewInsets');

export function ScrollableAutomaticInsets({
    automaticallyAdjustContentInsets = false,
    automaticallyAdjustKeyboardInsets = false,
    contentInset,
}: {
    automaticallyAdjustContentInsets?: boolean;
    automaticallyAdjustKeyboardInsets?: boolean;
    contentInset: ScrollViewProps['contentInset'];
}) {
    return (
        <UIKitScrollViewInsets
            // @ts-ignore
            automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
            automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
            contentInset={contentInset}
            style={{ display: 'none' }}
        />
    );
}
