import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { Video } from './Video';
import type { Dimensions, UIVideoProps } from './types';

const defaultDimensions: Dimensions = {
    width: 0,
    height: 0,
};

function UIVideoImpl(props: UIVideoProps) {
    const [dimensions, setDimensions] = React.useState<Dimensions>(defaultDimensions);
    const onLayout = React.useCallback(
        (event: LayoutChangeEvent): void => {
            if (
                event.nativeEvent.layout.width !== dimensions.width ||
                event.nativeEvent.layout.height !== dimensions.height
            ) {
                setDimensions({
                    width: event.nativeEvent.layout.width,
                    height: event.nativeEvent.layout.height,
                });
            }
        },
        [dimensions],
    );

    return (
        <View style={styles.container} onLayout={onLayout}>
            <Video {...props} {...dimensions} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
    },
});

export const UIVideo = React.memo(UIVideoImpl);
