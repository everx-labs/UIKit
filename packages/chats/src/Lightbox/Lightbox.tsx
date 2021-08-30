import * as React from 'react';
import { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import { Duplicate } from './Duplicate';
import { DuplicateImage } from '../DuplicateImage';
import type { LightboxProps } from './types';

const renderDuplicate = (
    isOpen: boolean,
    onClose: () => void,
    originalRef: React.RefObject<View>,
    fullSizeImage: React.ReactElement,
    previewImage: React.ReactElement,
) => {
    if (!isOpen) {
        return null;
    }

    return (
        <Duplicate
            onClose={onClose}
            originalRef={originalRef}
            fullSizeImage={fullSizeImage}
            previewImage={previewImage}
        />
    );
};

export const Lightbox = (props: LightboxProps) => {
    const { onClose, previewImage, imageRef, imageSize } = props;
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
            {renderDuplicate(props.isOpen, onClose, ref, props.fullSizeImage, copyOfPreviewImage)}
        </>
    );
};

const useStyles = makeStyles(() => ({
    originalContainer: {
        zIndex: -10,
    },
}));
