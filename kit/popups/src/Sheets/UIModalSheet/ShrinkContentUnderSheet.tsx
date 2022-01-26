import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

const ShrinkContentUnderSheetContext = React.createContext<
    Animated.SharedValue<number> | undefined
>(undefined);

export function useShrinkContentUnderSheetContextProgress() {
    return React.useContext(ShrinkContentUnderSheetContext);
}

// @inline
const SCALE_FACTOR = 0.9;
// @inline
const SHRINKED_CONTENT_BR = 12; // UILayoutConstant.alertBorderRadius

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

        return Math.max(insets.top, UILayoutConstant.contentInsetVerticalX4) - scaledTopInset;
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
            borderRadius: progress.value > 0 ? SHRINKED_CONTENT_BR : 0,
        };
    });

    const theme = useTheme();

    return (
        <>
            <View
                style={[
                    styles.contentBackdrop,
                    {
                        backgroundColor: theme[ColorVariants.StaticBlack],
                    },
                ]}
            >
                <Animated.View style={[styles.contentAnimated, style]}>{children}</Animated.View>
            </View>
            <ShrinkContentUnderSheetContext.Provider value={progress}>
                {portals}
            </ShrinkContentUnderSheetContext.Provider>
        </>
    );
}

const styles = StyleSheet.create({
    contentBackdrop: {
        flex: 1,
    },
    contentAnimated: { flex: 1, overflow: 'hidden' },
});
