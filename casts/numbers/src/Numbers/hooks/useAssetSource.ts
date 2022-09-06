import * as React from 'react';
import { ImageSourcePropType, ImageResolvedAssetSource, Image as RNImage } from 'react-native';

export function useAssetSource(
    signIcon?: ImageSourcePropType,
): (ImageResolvedAssetSource & { aspectRatio: number }) | null {
    return React.useMemo(() => {
        if (signIcon == null) {
            return null;
        }

        // For web we are to `resolveAssetsSource` manually until `react-native-web` supports it
        // Check out the following PR: https://github.com/necolas/react-native-web/pull/2144
        // @ts-ignore (Working with AdaptiveImage instance)
        const { width, height, uri, data } = signIcon ?? {};
        if (width != null && width > 0 && height != null && height > 0) {
            // Find the asset scale
            let scale = 1.0;
            if (data != null && uri != null) {
                if (data['uri@2x'] === uri) {
                    scale = 2.0;
                } else if (data['uri@3x'] === uri) {
                    scale = 3.0;
                }
            }
            // Return the ImageResolvedAssetSource & { aspectRatio: number } instance
            return {
                width,
                height,
                aspectRatio: (1.0 * width) / height,
                scale,
                uri,
            };
        }

        const source = RNImage.resolveAssetSource(signIcon);
        let aspectRatio = 1;

        if (source.height > 0 && source.width > 0) {
            aspectRatio = source.width / source.height;
        }

        return {
            ...source,
            aspectRatio,
        };
    }, [signIcon]);
}
