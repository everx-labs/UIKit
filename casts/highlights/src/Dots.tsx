import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

function rotateDots(slots: number[], activeIndex: number, direction: number) {
    'worklet';

    const tempDots = [...slots];
    let index = activeIndex;

    if (direction < 0) {
        index -= 1;
        if (index < 1) {
            index = 1;
            const last = tempDots.pop();
            tempDots.unshift(last as number);
        }
    } else {
        index += 1;
        if (index > tempDots.length - 2) {
            index = tempDots.length - 2;
            const first = tempDots.shift();
            tempDots.push(first as number);
        }
    }

    return {
        slots: tempDots,
        activeIndex: index,
    };
}

type DotsContext = {
    slots: number[];
    activeIndex: number;
};

function Dot({
    id,
    activeDotId,
    dotProgress,
    dotsContext,
}: {
    id: number;
    activeDotId: SharedValue<number>;
    dotProgress: SharedValue<number>;
    dotsContext: SharedValue<DotsContext>;
}) {
    const wrapperStyle = useAnimatedStyle(() => {
        const placement = dotsContext.value.slots.findIndex(it => it === id) + 1;

        return {
            transform: [
                {
                    translateX: interpolate(
                        placement - dotProgress.value,
                        // TODO
                        [0, 1, 2, 3, 4, 5, 6],
                        // TODO
                        [-32, -16, 0, 16, 32, 48, 64],
                        Extrapolate.CLAMP,
                    ),
                },
            ],
        };
    });
    const dotStyle = useAnimatedStyle(() => {
        return {
            // TODO
            backgroundColor: activeDotId.value === id ? 'white' : 'rgba(0,0,0,.2)',
        };
    });

    return (
        <Animated.View style={[styles.dotWrapper, wrapperStyle]}>
            <Animated.View style={[styles.dot, dotStyle]} />
        </Animated.View>
    );
}

export const Dots = React.memo(function Dots({
    currentGravityPosition,
    currentProgress,
}: {
    currentGravityPosition: SharedValue<number>;
    currentProgress: SharedValue<number>;
}) {
    const dotsContext = useSharedValue({
        // TODO
        slots: [1, 2, 3, 4, 5],
        activeIndex: 1,
    });
    const dotProgress = useDerivedValue(() => {
        let progress = 0;

        // TODO
        if (dotsContext.value.activeIndex === 1 && currentProgress.value < 0) {
            progress = currentProgress.value;
        }
        // TODO
        if (dotsContext.value.activeIndex === 3 && currentProgress.value > 0) {
            progress = currentProgress.value;
        }

        return progress;
    });

    useAnimatedReaction(
        () => currentGravityPosition.value,
        (cur, prev) => {
            if (cur === prev || prev == null) {
                return;
            }
            const direction = cur - prev;
            const newDotsContext = rotateDots(
                dotsContext.value.slots,
                dotsContext.value.activeIndex,
                direction,
            );
            dotsContext.value = newDotsContext;
        },
    );

    const activeDotId = useDerivedValue(() => {
        return dotsContext.value.slots[dotsContext.value.activeIndex];
    });

    return (
        <View
            style={{
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 12,
                // TODO
                backgroundColor: 'grey',
                // TODO
                width: 16 * 3 + 6 * 2,
                height: 24,
                paddingHorizontal: 6,
                flexDirection: 'row',
            }}
        >
            <Dot
                id={1}
                activeDotId={activeDotId}
                dotProgress={dotProgress}
                dotsContext={dotsContext}
            />
            <Dot
                id={2}
                activeDotId={activeDotId}
                dotProgress={dotProgress}
                dotsContext={dotsContext}
            />
            <Dot
                id={3}
                activeDotId={activeDotId}
                dotProgress={dotProgress}
                dotsContext={dotsContext}
            />
            <Dot
                id={4}
                activeDotId={activeDotId}
                dotProgress={dotProgress}
                dotsContext={dotsContext}
            />
            <Dot
                id={5}
                activeDotId={activeDotId}
                dotProgress={dotProgress}
                dotsContext={dotsContext}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    dotWrapper: {
        width: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
