import * as React from 'react';
import { Image, View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.themes';
import { UISkeleton } from '@tonlabs/uikit.layout';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { Duplicate } from './Duplicate';
import type { UILightboxProps } from './types';
import { useImages } from './hooks/useImages';
import { useImageSize } from './hooks/useImageSize';
import { UIConstant } from '../constants';

export const UILightbox = ({
    image,
    preview,
    prompt,
    isLoading,
    originalSize,
    maxHeight = UIConstant.lightbox.defaultMaxSize,
    maxWidth,
    testID,
}: UILightboxProps) => {
    const ref = useAnimatedRef<View>();
    const previewRef = React.useRef<Image>(null);
    const [isImageOpen, setImageOpen] = React.useState<boolean>(false);
    const [imageLoading, setImageLoading] = React.useState<boolean>(true);
    // TODO ошибки внутри
    const [loadError, setLoadError] = React.useState<boolean>(false);
    loadError;

    const imageSize = useImageSize(image, originalSize, maxHeight, maxWidth);

    const onLoadCallback = React.useCallback(function onLoadCallback() {
        setImageLoading(false);
    }, []);
    const onErrorCallback = React.useCallback(function onErrorCallback() {
        setLoadError(true);
    }, []);
    const onPress = React.useCallback(function onPress() {
        setImageOpen(prevIsOpen => !prevIsOpen);
    }, []);
    const onClose = React.useCallback(function onClose() {
        setImageOpen(false);
    }, []);

    const { fullSizeImage, previewImage, duplicateOfPreviewImage } = useImages(
        image,
        preview,
        previewRef,
        imageSize,
        onErrorCallback,
        onLoadCallback,
    );

    const styles = useStyles(maxHeight, maxWidth);

    return (
        <View>
            <UISkeleton show={isLoading || imageLoading} style={styles.skeleton}>
                <TouchableOpacity testID={testID} activeOpacity={1} onPress={onPress}>
                    <View ref={ref} style={styles.originalContainer}>
                        {previewImage}
                    </View>
                </TouchableOpacity>
            </UISkeleton>
            <Duplicate
                isOpen={isImageOpen}
                onClose={onClose}
                forwardedRef={ref}
                fullSizeImage={fullSizeImage}
                previewImage={duplicateOfPreviewImage}
                prompt={prompt}
            />
        </View>
    );
};

const useStyles = makeStyles((maxHeight: number, maxWidth: number | undefined) => ({
    skeleton: {
        maxHeight,
        maxWidth,
        alignItems: 'center',
    },
    originalContainer: {
        /**
         * It is not clear for what reason, but if you do not set
         * somekind of appearance-changing style, then measurement of the original image
         * in the Duplicate component does not work properly on Android.
         */
        backgroundColor: 'transparent',
    },
}));
