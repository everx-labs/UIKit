/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Insets, requireNativeComponent, ScrollViewProps } from 'react-native';

const UIKitScrollViewInsets = requireNativeComponent('UIKitScrollViewInsets');

export const ScrollableAutomaticInsets = React.memo(function ScrollableAutomaticInsets({
    automaticallyAdjustContentInsets = false,
    automaticallyAdjustKeyboardInsets = false,
    contentInset,
    onInsetsChange: onInsetsChangeProp,
}: {
    automaticallyAdjustContentInsets?: boolean;
    automaticallyAdjustKeyboardInsets?: boolean;
    contentInset: ScrollViewProps['contentInset'];
    onInsetsChange?: (insets: Insets) => void;
}) {
    return (
        <UIKitScrollViewInsets
            // @ts-ignore
            automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
            automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
            contentInset={contentInset}
            onScrollViewInsetsChange={
                onInsetsChangeProp != null
                    ? ({ nativeEvent }: { nativeEvent: Insets }) => {
                          if (!onInsetsChangeProp) {
                              return;
                          }

                          onInsetsChangeProp(nativeEvent);
                      }
                    : undefined
            }
            style={{ display: 'none' }}
        />
    );
});
