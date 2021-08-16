import * as React from 'react';
import { View, Image } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import { Duplicate } from './Duplicate';
import { DuplicateImage } from '../DuplicateImage';

type ImageSize = {
    width: number;
    height: number;
};

type DemonstratorProps = {
    isOpen: boolean;
    onClose: () => void;
    imageRef: React.RefObject<Image>;
    imageSize: ImageSize | null;
    fullSizeImage: React.ReactElement;
    previewImage: React.ReactElement;
};

export const Demonstrator = (props: DemonstratorProps) => {
    const { onClose, previewImage, imageRef, imageSize } = props;
    const ref = useAnimatedRef<View>();

    const copyOfPreviewImage = React.useMemo(
        () => (
            <DuplicateImage source={imageRef} style={imageSize}>
                {previewImage}
            </DuplicateImage>
        ),
        [previewImage, imageRef, imageSize],
    );

    const styles = useStyles();

    return (
        <>
            <View ref={ref} style={styles.originalContainer}>
                {previewImage}
            </View>

            <Duplicate
                {...props}
                originalRef={ref}
                onClose={onClose}
                previewImage={copyOfPreviewImage}
            />
        </>
    );
};

const useStyles = makeStyles(() => ({
    originalContainer: {
        zIndex: -10,
    },
}));
