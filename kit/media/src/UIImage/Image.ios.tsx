import * as React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, StyleSheet, ImageStyle } from 'react-native';
// @ts-expect-error
import ImageViewNativeComponent from 'react-native/Libraries/Image/ImageViewNativeComponent';

type ImageProps = RNImageProps & {
    tintColor?: ImageStyle['tintColor'];
};

/**
 * Copied from RN repo and adapted
 *
 * A React component for displaying different types of images,
 * including network images, static resources, temporary local images, and
 * images from local disk, such as the camera roll.
 *
 * See https://reactnative.dev/docs/image.html
 */
export const Image = React.forwardRef<any, ImageProps>(function Image(
    props: ImageProps,
    forwardedRef: any,
) {
    const source = RNImage.resolveAssetSource(props.source) || {
        uri: undefined,
        width: undefined,
        height: undefined,
    };

    let sources;
    let style: ImageStyle;
    if (Array.isArray(source)) {
        style = StyleSheet.flatten([styles.base, props.style]) || {};
        sources = source;
    } else {
        const { width, height, uri } = source;
        style = StyleSheet.flatten([{ width, height }, styles.base, props.style]) || {};
        sources = [source];

        if (uri === '') {
            console.warn('source.uri should not be an empty string');
        }
    }

    const resizeMode = props.resizeMode || style.resizeMode || 'cover';

    return (
        <ImageViewNativeComponent
            {...props}
            ref={forwardedRef}
            style={style}
            resizeMode={resizeMode}
            tintColor={props.tintColor}
            source={sources}
        />
    );
});

const styles = StyleSheet.create({
    base: {
        overflow: 'hidden',
    },
});
