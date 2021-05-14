import * as React from 'react';
import {
    View,
    // StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedScrollHandler,
    scrollTo,
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
    useAnimatedRef,
} from 'react-native-reanimated';

export function ReanimatedScreen() {
    const blockShift = useSharedValue(-50);

    const scrollRef = useAnimatedRef();

    const invertedBlockShift = useDerivedValue(() => {
        return blockShift.value + 50;
    });

    const scrollHandler = useAnimatedScrollHandler((event) => {
        const { y } = event.contentOffset;

        if (y <= 0) {
            blockShift.value = Math.min(blockShift.value - y, 0);
            scrollTo(scrollRef, 0, 0, false);
        } else if (blockShift.value !== -50) {
            blockShift.value = Math.max(blockShift.value - y, -50);
            scrollTo(scrollRef, 0, 0, false);
        }
    });

    const style = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: blockShift.value,
            },
        ],
    }));

    const sstyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: invertedBlockShift.value,
            },
        ],
    }));

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
            <Animated.View
                style={[
                    {
                        backgroundColor: 'blue',
                        height: 50,
                    },
                    style,
                ]}
            />
            <Animated.ScrollView
                ref={scrollRef}
                style={[{ flex: 1 }, sstyle]}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                {new Array(10)
                    .fill(null)
                    .map((_el, i) => i / 10)
                    .reverse()
                    .map((opacity) => (
                        <View
                            style={{
                                height: 100,
                                backgroundColor: `rgba(255,0,0,${opacity})`,
                            }}
                        />
                    ))}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

// const styles = StyleSheet.create({
//     verticallyInverted: {
//         transform: [{ scaleY: -1 }],
//     },
// });
