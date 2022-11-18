import * as React from 'react';
import { LayoutChangeEvent, I18nManager, View } from 'react-native';
import type { UIHighlightsContentInset } from './types';

export function useCards(
    children: React.ReactNode,
    contentInset: UIHighlightsContentInset,
    spaceBetween: number,
    onItemLayout: (index: number, value: number) => void,
) {
    const getOnChildLayout = React.useCallback(
        (itemIndex: number) =>
            ({
                nativeEvent: {
                    layout: { x, width },
                },
            }: LayoutChangeEvent) => {
                // To have a visual feedback that
                // there are some items to the left
                // decrease the `x` coord by the `contentInset`
                // if it's present
                //
                // Math.trunc here is to eliminate float coords,
                // that due to IEEE 754 implementation in JS
                // can lead to errors

                const value = I18nManager.getConstants().isRTL
                    ? Math.trunc(x + width + (contentInset.left ?? 0))
                    : Math.trunc(x - (contentInset.left ?? 0));

                onItemLayout(itemIndex, value);
            },
        [contentInset, onItemLayout],
    );

    return React.useMemo(() => {
        return React.Children.map(children, (child, itemIndex) => {
            if (!React.isValidElement(child)) {
                return null;
            }

            return (
                <View
                    key={child.key}
                    style={
                        itemIndex !== 0
                            ? {
                                  paddingLeft: spaceBetween,
                              }
                            : null
                    }
                    onLayout={getOnChildLayout(itemIndex)}
                >
                    {child}
                </View>
            );
        });
    }, [children, getOnChildLayout, spaceBetween]);
}
