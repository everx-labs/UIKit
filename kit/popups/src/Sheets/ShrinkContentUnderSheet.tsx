import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShrinkContentUnderSheetContext = React.createContext<
    Animated.SharedValue<number> | undefined
>(undefined);

export function useShrinkContentUnderSheetContextProgress() {
    return React.useContext(ShrinkContentUnderSheetContext);
}

// @inline
const SCALE_FACTOR = 0.9;

export function ShrinkContentUnderSheet({
    children,
    portals,
}: {
    children: React.ReactNode;
    portals: React.ReactNode;
}) {
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const progress = useSharedValue(0);

    const topModifier = React.useMemo(() => {
        const scaledHeight = height * SCALE_FACTOR;

        const scaledTopInset = (height - scaledHeight) / 2;

        return insets.top - scaledTopInset;
    }, [height, insets.top]);

    const style = useAnimatedStyle(() => {
        const options = {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.CLAMP,
        };
        return {
            transform: [
                {
                    scale: interpolate(progress.value, [0, 1], [1, SCALE_FACTOR], options),
                },
                {
                    translateY: interpolate(progress.value, [0, 1], [0, topModifier], options),
                },
            ],
            // TODO: decide whether to apply `interpolate` here or not
            borderRadius: progress.value > 0 ? 10 : 0,
            // borderRadius: interpolate(
            //     progress.value,
            //     [0, 1],
            //     [0, Math.round(10 + 10 * (1 - SCALE_FACTOR))],
            //     options,
            // ),
        };
    });

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
                    {children}
                </Animated.View>
            </View>
            <ShrinkContentUnderSheetContext.Provider value={progress}>
                {portals}
            </ShrinkContentUnderSheetContext.Provider>
        </>
    );
}
