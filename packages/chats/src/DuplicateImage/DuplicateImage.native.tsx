/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { requireNativeComponent } from 'react-native';
import type { DuplicateImageProps } from './types';

const DuplicateImageNative = requireNativeComponent('HDuplicateImageView');

export const DuplicateImage: React.FC<DuplicateImageProps> = ({
    source,
    children,
    ...rest
}: DuplicateImageProps) => {
    if (source.current == null) {
        return children;
    }

    // @ts-ignore
    if (source.current._nativeTag == null) {
        return children;
    }

    return (
        <DuplicateImageNative
            // @ts-ignore
            originalViewRef={source.current._nativeTag}
            {...rest}
        />
    );
};
