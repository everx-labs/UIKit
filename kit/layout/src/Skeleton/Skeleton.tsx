import * as React from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
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

import { UILayoutConstant } from '../UILayoutConstant';

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
export function UISkeleton({
    children,
    show,
    style: styleProp,
}: {
    /**
     * Your content will be wrapped with a View,
     * so you will probably want to give some dimensions to your content
     * or provide some default value for a text,
     * that will be approximately of the same size as the real content
     *
     * ```ts
     * // skeleton will hide when data exists
     * <Skeleton>
     *   {data ? <Data /> : null}
     * </Skeleton>
     * ```
     */
    children: React.ReactNode;
    /**
     * Flag to control behavior of skeleton
     * ```ts
     * // even though data is rendered, show skeleton anyway
     * <Skeleton show>
     *   <Data />
     * </Skeleton>
     * ```
     *
     * Useful when you want to control skeleton visibility
     * during loading, i.e.
     * ```ts
     * const [isLoading, setIsLoading] = React.useState(true);
     * <Skeleton show={isLoading}>
     *   <UIImage source={...} onLoadEnd={() => setIsLoading(false)} />
     * </Skeleton>
     * ```
     */
    show: boolean;
    /**
     * Since your content will be wrapped with <View />,
     * you might want to provide some additional styles
     */
    style?: StyleProp<ViewStyle>;
}) {
    const visible = children == null || show;

    const width = useSharedValue(0);

    const onLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { width: lWidth },
            },
        }: LayoutChangeEvent) => {
            if (width.value !== lWidth) {
                width.value = lWidth;
            }
        },
        [width],
    );

    const { isVisible, crossDissolveProgress } = useCrossDissolve(visible);

    const skeletonBorderRadius = React.useMemo(() => {
        if (styleProp) {
            const { borderRadius: stylePropBorderRadius } = StyleSheet.flatten(styleProp ?? {});
            if (stylePropBorderRadius !== undefined) {
                return stylePropBorderRadius;
            }
        }
        return UILayoutConstant.alertBorderRadius;
    }, [styleProp]);

    return (
        <View style={[styles.container, styleProp]} onLayout={onLayout}>
            {children}
            {isVisible && (
                <SkeletonAnimatable
                    width={width}
                    borderRadius={skeletonBorderRadius}
                    crossDissolveProgress={crossDissolveProgress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
