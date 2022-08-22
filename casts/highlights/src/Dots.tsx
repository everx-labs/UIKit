import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

import { ColorVariants, UIBackgroundView, useTheme } from '@tonlabs/uikit.themes';
import { UIHighlightsConstants } from './constants';

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
    initialPlacement,
    dotsTranslations,
}: {
    id: number;
    activeDotId: SharedValue<number>;
    dotProgress: SharedValue<number>;
    dotsContext: SharedValue<DotsContext>;
    initialPlacement: SharedValue<number[]>;
    dotsTranslations: SharedValue<number[]>;
}) {
    const theme = useTheme();

    const activeColor = theme[ColorVariants.GraphPrimary];
    const nonActiveColor = theme[ColorVariants.GraphNeutral];

    const wrapperStyle = useAnimatedStyle(() => {
        const placement = dotsContext.value.slots.findIndex(it => it === id) + 1;

        return {
            transform: [
                {
                    translateX: interpolate(
                        placement - dotProgress.value,
                        initialPlacement.value,
                        dotsTranslations.value,
                        Animated.Extrapolate.CLAMP,
                    ),
                },
            ],
        };
    });
    const dotStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: activeDotId.value === id ? activeColor : nonActiveColor,
        };
    });

    return (
        <Animated.View style={[styles.dotWrapper, wrapperStyle]}>
            <Animated.View style={[styles.dot, dotStyle]} />
        </Animated.View>
    );
}

function useInitialPlacement() {
    const tPlacement = React.useRef<number[]>();
    const tTranslations = React.useRef<number[]>();

    // Since it's static use refs
    // to not create array on re-renders
    if (tPlacement.current == null || tTranslations.current == null) {
        // We use two additional dots for sliding animation
        tPlacement.current = new Array(UIHighlightsConstants.dotsCount + 2)
            .fill(null)
            .map((_, i) => i + 1);
        // the first item going to be 1
        // and we want the first dot to be hidden to the left
        // (as it's for animation)
        tTranslations.current = tPlacement.current.map(
            it => (it - 2) * UIHighlightsConstants.dotWrapperWidth,
        );
    }

    return {
        initialPlacement: useSharedValue(tPlacement.current),
        dotsTranslations: useSharedValue(tTranslations.current),
    };
}

export const Dots = React.memo(function Dots({
    currentGravityPosition,
    currentProgress,
}: {
    currentGravityPosition: SharedValue<number>;
    currentProgress: SharedValue<number>;
}) {
    const { initialPlacement, dotsTranslations } = useInitialPlacement();
    const rightEdgeDotIndex = useDerivedValue(() => {
        // 1 is for last index (array.length - 1)
        // and 1 more to get the item before last
        return initialPlacement.value.length - 2;
    });
    const dotsContext = useSharedValue({
        slots: initialPlacement.value,
        activeIndex: 1,
    });
    const dotProgress = useDerivedValue(() => {
        let progress = 0;

        // left edge index is always 1
        if (dotsContext.value.activeIndex === 1 && currentProgress.value < 0) {
            progress = currentProgress.value;
        }
        if (
            dotsContext.value.activeIndex === rightEdgeDotIndex.value &&
            currentProgress.value > 0
        ) {
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
        <UIBackgroundView color={ColorVariants.BackgroundBW} style={styles.container}>
            {initialPlacement.value.map(it => (
                <Dot
                    key={it}
                    id={it}
                    activeDotId={activeDotId}
                    dotProgress={dotProgress}
                    dotsContext={dotsContext}
                    initialPlacement={initialPlacement}
                    dotsTranslations={dotsTranslations}
                />
            ))}
        </UIBackgroundView>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
        flexDirection: 'row',
        borderRadius: UIHighlightsConstants.controlItemHeight / 2,
        width:
            UIHighlightsConstants.dotWrapperWidth * UIHighlightsConstants.dotsCount +
            // 2 because it's from both left and right side
            UIHighlightsConstants.dotLeftOffset * 2,
        height: UIHighlightsConstants.controlItemHeight,
    },
    dotWrapper: {
        width: UIHighlightsConstants.dotWrapperWidth,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: UIHighlightsConstants.dotVerticalOffset,
        bottom: UIHighlightsConstants.dotVerticalOffset,
        left: UIHighlightsConstants.dotLeftOffset,
    },
    dot: {
        width: UIHighlightsConstants.dotSize,
        height: UIHighlightsConstants.dotSize,
        borderRadius: UIHighlightsConstants.dotSize / 2,
    },
});
