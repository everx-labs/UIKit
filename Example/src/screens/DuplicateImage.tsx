/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Image, ImageProps, requireNativeComponent } from 'react-native';

const DuplicateImageNative = requireNativeComponent('HDuplicateImageView');

export const DuplicateImage = ({
    source,
    ...rest
}: Omit<ImageProps, 'source'> & {
    source: React.RefObject<Image>;
}) => {
    if (source.current == null) {
        return null;
    }

    // @ts-ignore
    if (source.current._nativeTag == null) {
        return null;
    }

    return (
        <DuplicateImageNative
            // @ts-ignore
            originalViewRef={source.current._nativeTag}
            {...rest}
        />
    );
};
