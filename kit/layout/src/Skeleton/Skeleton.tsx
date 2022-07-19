import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';
import { SkeletonProgress, useSkeletonProgress } from './useSkeletonProgress';
import type { UISkeletonProps } from './types';
import { UIKitSkeletonNativeView } from './UIKitSkeletonView';

enum CrossDissolveProgress {
    Visible = 1,
    Hidden = 0,
}

/**
 * A *cross dissolve* is a post-production video editing technique
 * in which you gently increase the opacity of one scene over the previous one.
 */
function useCrossDissolve(visible: boolean) {
    const crossDissolveProgress = useSharedValue(
        visible ? CrossDissolveProgress.Visible : CrossDissolveProgress.Hidden,
    );

    const isMounted = React.useRef<boolean>(false);
    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const [isVisible, setIsVisible] = React.useState(visible);

    const turnOff = React.useCallback(() => {
        if (!isMounted.current) {
            return;
        }

        setIsVisible(false);
    }, []);

    React.useEffect(() => {
        if (!isMounted.current) {
            return;
        }

        if (visible === isVisible) {
            return;
        }

        if (visible) {
            setIsVisible(true);
            crossDissolveProgress.value = withSpring(CrossDissolveProgress.Visible, {
                overshootClamping: true,
            });
            return;
        }

        crossDissolveProgress.value = withSpring(
            CrossDissolveProgress.Hidden,
            { overshootClamping: true },
            () => {
                runOnJS(turnOff)();
            },
        );
    }, [visible, crossDissolveProgress, isVisible, turnOff]);

    return {
        isVisible,
        crossDissolveProgress,
    };
}

function SkeletonAnimatable({
    width,
    borderRadius,
    crossDissolveProgress,
}: {
    width: Animated.SharedValue<number>;
    borderRadius: number;
    crossDissolveProgress: Animated.SharedValue<number>;
}) {
    const theme = useTheme();
    const progress = useSkeletonProgress();

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        progress.value,
                        [SkeletonProgress.Start, SkeletonProgress.End],
                        [-width.value, width.value],
                    ),
                },
            ],
        };
    }, []);

    const backdropStyle = useAnimatedStyle(() => {
        return {
            opacity: crossDissolveProgress.value,
        };
    });

    return (
        <Animated.View
            style={[
                styles.skeletonContainer,
                {
                    backgroundColor: theme[ColorVariants.BackgroundSecondary] as string,
                    borderRadius,
                },
                backdropStyle,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: theme[ColorVariants.BackgroundSecondary] as string },
                    style,
                ]}
            >
                {/** Make it faster by rasterizing the View with its content */}
                <View shouldRasterizeIOS renderToHardwareTextureAndroid style={styles.gradient}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[
                            theme[ColorVariants.BackgroundSecondary] as string,
                            theme[ColorVariants.BackgroundNeutral] as string,
                            theme[ColorVariants.BackgroundSecondary] as string,
                        ]}
                        style={styles.gradient}
                    />
                </View>
            </Animated.View>
        </Animated.View>
    );
}

/**
 * Use it to show boundaries of content that will be shown
 * after loading is over.
 *
 * Sources of inspiraton:
 * https://github.com/Juanpe/SkeletonView
 * https://github.com/nandorojo/moti/blob/master/packages/skeleton/src/skeleton.tsx
 * @returns
 */
export function UISkeleton({ children, show, style: styleProp }: UISkeletonProps) {
    const visible = children == null || show;

    // const { isVisible, crossDissolveProgress } = useCrossDissolve(visible);

    // const skeletonBorderRadius = React.useMemo(() => {
    //     if (styleProp) {
    //         const { borderRadius: stylePropBorderRadius } = StyleSheet.flatten(styleProp ?? {});
    //         if (stylePropBorderRadius !== undefined) {
    //             return stylePropBorderRadius;
    //         }
    //     }
    //     return 0;
    // }, [styleProp]);

    return (
        <View style={[styles.container, styleProp]}>
            {children}
            {visible && <UIKitSkeletonNativeView style={StyleSheet.absoluteFill} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    skeletonContainer: {
        overflow: 'hidden',
        position: 'absolute',
        /**
         * There is a bug with the render when the underlying component
         * is visible from under the overlying component
         * if they have the same size or are cut off by `overflow: 'hidden'`.
         * To avoid this, it is necessary to slightly increase the size of the overlying component
         */
        top: -StyleSheet.hairlineWidth,
        left: -StyleSheet.hairlineWidth,
        bottom: -StyleSheet.hairlineWidth,
        right: -StyleSheet.hairlineWidth,
    },
    gradient: { flex: 1 },
});
