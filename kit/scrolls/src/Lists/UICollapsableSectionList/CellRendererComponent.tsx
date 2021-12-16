import * as React from 'react';
import { View, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';

export function CellRendererComponent({
    onLayout,
    style,
    children,
    index,
}: {
    index: number;
    onLayout: (event: LayoutChangeEvent) => void;
    style: StyleProp<ViewStyle>;
    children: React.ReactNode;
}) {
    const wrapperRef = React.useRef<View>(null);
    const prevIndex = React.useRef<number>(index);

    /**
     * Unfortunatelly `ResizeObserver`
     * (that is used in RNW for onLayout events
     *  https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/modules/useElementLayout/index.js#L81)
     * doesn't fire updates when a position in a scrollable view
     * changes, therefore it doesn't change a frame info properly.
     * Hence fire it manually.
     */
    React.useEffect(() => {
        if (index === prevIndex.current) {
            return;
        }
        if (wrapperRef.current == null) {
            return;
        }
        wrapperRef.current.measure((x, y, width, height) => {
            const event: Partial<LayoutChangeEvent> = {
                nativeEvent: {
                    layout: { x, y, width, height },
                },
                timeStamp: Date.now(),
            };
            Object.defineProperty(event.nativeEvent, 'target', {
                enumerable: true,
                get: () => wrapperRef.current,
            });
            // @ts-expect-error
            onLayout(event);
        });
        prevIndex.current = index;
    }, [index, onLayout]);

    return (
        <View ref={wrapperRef} style={style} onLayout={onLayout}>
            {children}
        </View>
    );
}
