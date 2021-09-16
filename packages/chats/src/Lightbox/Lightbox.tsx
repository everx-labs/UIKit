import * as React from 'react';
import { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import { Duplicate } from './Duplicate';
import { DuplicateImage } from '../DuplicateImage';
import type { LightboxProps } from './types';

export const Lightbox = ({
    onClose,
    previewImage,
    imageRef,
    imageSize,
    isOpen,
    fullSizeImage,
    prompt,
}: LightboxProps) => {
    const ref = useAnimatedRef<View>();

    const copyOfPreviewImage = React.useMemo(() => {
        return (
            <DuplicateImage source={imageRef} style={imageSize}>
                {previewImage}
            </DuplicateImage>
        );
    }, [previewImage, imageRef, imageSize]);

    const styles = useStyles();

    return (
        <>
            <View ref={ref} style={styles.originalContainer}>
                {previewImage}
            </View>
            <Duplicate
                isOpen={isOpen}
                onClose={onClose}
                forwardedRef={ref}
                fullSizeImage={fullSizeImage}
                previewImage={copyOfPreviewImage}
                prompt={prompt}
            />
        </>
    );
};

const useStyles = makeStyles(() => ({
    originalContainer: {
        zIndex: -10,
    },
}));
