import * as React from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    useSharedValue,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { useTheme, ColorVariants, UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import { SkeletonProgress, useSkeletonProgress } from './useSkeletonProgress';

enum CrossDisolveProgress {
    Visible = 1,
    Hidden = 0,
}

/**
 * A *cross dissolve* is a post-production video editing technique
 * in which you gently increase the opacity of one scene over the previous one.
 */
function useCrossDissolve(visible: boolean) {
    const crossDisolveProgress = useSharedValue(
        visible ? CrossDisolveProgress.Visible : CrossDisolveProgress.Hidden,
    );

    const [isVisible, setIsVisible] = React.useState(visible);
    const turnOff = React.useCallback(() => {
        setIsVisible(false);
    }, []);
    React.useEffect(() => {
        if (visible === isVisible) {
            return;
        }

        if (visible) {
            setIsVisible(true);
            crossDisolveProgress.value = withSpring(CrossDisolveProgress.Visible, {
                overshootClamping: true,
            });
            return;
        }

        crossDisolveProgress.value = withSpring(
            CrossDisolveProgress.Hidden,
            { overshootClamping: true },
            () => {
                runOnJS(turnOff)();
            },
        );
    }, [visible, crossDisolveProgress, isVisible, turnOff]);

    return {
        isVisible,
        crossDisolveProgress,
    };
}

function SkeletonAnimatable({
    width,
    crossDisolveProgress,
}: {
    width: Animated.SharedValue<number>;
    crossDisolveProgress: Animated.SharedValue<number>;
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

    const crossDissolveStyle1 = useAnimatedStyle(() => {
        return {
            opacity: crossDisolveProgress.value,
        };
    });

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFill,
                { backgroundColor: theme[ColorVariants.BackgroundSecondary] as string },
                crossDissolveStyle1,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: theme[ColorVariants.BackgroundSecondary] as string },
                    style,
                ]}
            >
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
     * Your content will be wrapped with View,
     * so you probably want to give to your content some
     * dimensions, or if it a text, provide some default one
     * that is aproximatelly will be the size of real content
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
     * Flag to controll behavior of skeleton
     * ```ts
     * // even though data is rendered, show skeleton anyway
     * <Skeleton show>
     *   <Data />
     * </Skeleton>
     * ```
     *
     * Usefull when you want to controll skeleton visibility
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

    const { isVisible, crossDisolveProgress } = useCrossDissolve(visible);

    return (
        <UIBackgroundView style={[styles.container, styleProp]} onLayout={onLayout}>
            {children}
            {isVisible && (
                <SkeletonAnimatable width={width} crossDisolveProgress={crossDisolveProgress} />
            )}
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative', overflow: 'hidden' },
    gradient: { flex: 1 },
});
