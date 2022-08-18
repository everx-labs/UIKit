import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, ColorVariants } from '@tonlabs/uikit.themes';

// Note: Skeleton.tsx works slowly on Android,
// FPS is dropping from `60` to `12` on Samsung Galaxy S8.
// That's why we decided not to animate skeletons on Android,

import type { UISkeletonProps } from './types';

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
    const theme = useTheme();

    const visible = children == null || show;

    return (
        <View style={[styles.container, styleProp]}>
            {children}
            {visible && (
                <>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: theme[ColorVariants.BackgroundSecondary],
                        }}
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
