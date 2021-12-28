import * as React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, StyleSheet } from 'react-native';
import type { ImageStyle } from 'react-native-fast-image';
// @ts-expect-error
import ImageViewNativeComponent from 'react-native/Libraries/Image/ImageViewNativeComponent';
// @ts-expect-error
import TextInlineImageNativeComponent from 'react-native/Libraries/Image/TextInlineImageNativeComponent';
// @ts-expect-error
import TextAncestor from 'react-native/Libraries/Text/TextAncestor';

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
    const {
        source: sourceProp,
        defaultSource: defaultSourceProp,
        loadingIndicatorSource: loadingIndicatorSourceProp,
    } = props;
    let source: ReturnType<typeof RNImage.resolveAssetSource> | null =
        RNImage.resolveAssetSource(sourceProp);
    // @ts-ignore
    const defaultSource = RNImage.resolveAssetSource(defaultSourceProp);
    // @ts-ignore
    const loadingIndicatorSource = RNImage.resolveAssetSource(loadingIndicatorSourceProp);

    if (source) {
        const { uri } = source;
        if (uri === '') {
            console.warn('source.uri should not be an empty string');
        }
    }

    if (defaultSourceProp && loadingIndicatorSourceProp) {
        throw new Error(
            'The <Image> component cannot have defaultSource and loadingIndicatorSource at the same time. Please use either defaultSource or loadingIndicatorSource.',
        );
    }

    if (source && !source.uri && !Array.isArray(source)) {
        source = null;
    }

    let style;
    let sources;
    if (source?.uri != null) {
        const { width, height } = source;
        style = StyleSheet.flatten([{ width, height }, styles.base, props.style]);
        sources = [{ uri: source.uri }];
    } else {
        style = StyleSheet.flatten([styles.base, props.style]);
        sources = source;
    }

    const { onLoadStart, onLoad, onLoadEnd, onError } = props;
    const nativeProps = {
        ...props,
        style,
        shouldNotifyLoadEvents: !!(onLoadStart || onLoad || onLoadEnd || onError),
        src: sources,
        // @ts-ignore
        headers: source?.headers,
        defaultSrc: defaultSource ? defaultSource.uri : null,
        loadingIndicatorSrc: loadingIndicatorSource ? loadingIndicatorSource.uri : null,
        ref: forwardedRef,
    };

    return (
        <TextAncestor.Consumer>
            {(hasTextAncestor: boolean) => {
                if (hasTextAncestor) {
                    return <TextInlineImageNativeComponent {...nativeProps} />;
                }
                return <ImageViewNativeComponent {...nativeProps} />;
            }}
        </TextAncestor.Consumer>
    );
});

const styles = StyleSheet.create({
    base: {
        overflow: 'hidden',
    },
});
