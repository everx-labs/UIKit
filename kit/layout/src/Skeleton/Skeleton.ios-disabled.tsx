import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

// Note: UIKitSkeletonNativeView works for iOS, but it consumes a lot of memory,
// hereby making iOS devices hang and crash due to "Out of Memory" error!
// TODO: Rename `Skeleton.ios-disabled.tsx` into `Skeleton.ios.tsx` once the issue is resolved.
import { UIKitSkeleton, UIKitSkeletonNativeView } from './UIKitSkeletonView';

import type { UISkeletonProps } from './types';

function UIKitSkeletonConfig() {
    const theme = useTheme();
    const prevThemeRef = React.useRef<typeof theme>();

    if (prevThemeRef.current !== theme) {
        UIKitSkeleton.configure({
            gradientWidth: 300,
            skewDegrees: 10,
            shimmerDuration: 800,
            skeletonDuration: 2000,
            backgroundColor: theme[ColorVariants.BackgroundSecondary],
            accentColor: theme[ColorVariants.BackgroundTertiary],
        });
        prevThemeRef.current = theme;
    }

    return null;
}

/**
 * Use it to show boundaries of content that will be shown
 * after loading is over.
 *
 * Sources of inspiration:
 * https://github.com/Juanpe/SkeletonView
 * https://github.com/nandorojo/moti/blob/master/packages/skeleton/src/skeleton.tsx
 * @returns
 */
export function UISkeleton({ children, show, style: styleProp }: UISkeletonProps) {
    const visible = children == null || show;

    return (
        <View style={[styles.container, styleProp]}>
            {children}
            {visible && (
                <>
                    <UIKitSkeletonConfig />
                    <UIKitSkeletonNativeView
                        // @ts-ignore
                        style={StyleSheet.absoluteFill}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
});
