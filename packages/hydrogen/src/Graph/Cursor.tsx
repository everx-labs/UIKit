import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    withDecay,
} from 'react-native-reanimated';

import type { Path } from './AnimatedHelpers';

import type { DataPoint } from './Label';

// const { width } = Dimensions.get("window");
const CURSOR = 100;
const styles = StyleSheet.create({
    cursorContainer: {
        width: CURSOR,
        height: CURSOR,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "rgba(100, 200, 300, 0.4)",
    },
    cursor: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: '#367be2',
        borderWidth: 4,
        backgroundColor: 'white',
    },
});

interface CursorProps {
    path: Path;
    length: Animated.SharedValue<number>;
    point: Animated.SharedValue<DataPoint>;
}

type Dimensions = {
  width: number;
  height: number;
};
const initialDimensions: Dimensions = {
  width: 10,
  height: 10,
};

const Cursor = ({ path, length, point }: CursorProps) => {

    const [dimensions, setDimensions] = React.useState<Dimensions>(
        initialDimensions,
    );
    const onLayout = (event: LayoutChangeEvent): void => {
        if (
            event.nativeEvent.layout.height !== dimensions.height ||
            event.nativeEvent.layout.width !== dimensions.width
        ) {
            setDimensions({
                height: event.nativeEvent.layout.height,
                width: event.nativeEvent.layout.width,
            });
        }
    };

    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {
            offsetX: number;
            offsetY: number;
        }
    >({
        onStart: (_event, ctx) => {
            ctx.offsetX = interpolate(
                length.value,
                [0, path.length],
                [0, dimensions.width],
                Extrapolate.CLAMP,
            );
        },
        onActive: (event, ctx) => {
            // eslint-disable-next-line no-param-reassign
            length.value = interpolate(
                ctx.offsetX + event.translationX,
                [0, dimensions.width],
                [0, path.length],
                Extrapolate.CLAMP,
            );
        },
        onEnd: ({ velocityX }) => {
            // eslint-disable-next-line no-param-reassign
            length.value = withDecay({
                velocity: velocityX,
                clamp: [0, path.length],
            });
        },
    });

    const style = useAnimatedStyle(() => {
        const { coord } = point.value;
        const translateX = coord.x - CURSOR / 2;
        const translateY = coord.y - CURSOR / 2;
        return {
            transform: [{ translateX }, { translateY }],
        };
    });

    return (
        <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
            <PanGestureHandler {...{ onGestureEvent }}>
                <Animated.View style={[styles.cursorContainer, style]}>
                    <View style={styles.cursor} />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

export default Cursor;
