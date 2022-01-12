import * as React from 'react';
import { Image, LayoutChangeEvent, View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.themes';
import { UISkeleton } from '@tonlabs/uikit.layout';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { Duplicate } from './Duplicate';
import type { UILightboxProps } from './types';
import { useImages } from './hooks/useImages';
import { useImageSize } from './hooks/useImageSize';

export const UILightbox = ({
    image,
    preview,
    prompt,
    isLoading,
    originalSize,
    testID,
}: UILightboxProps) => {
    const ref = useAnimatedRef<View>();
    const previewRef = React.useRef<Image>(null);
    const [isImageOpen, setImageOpen] = React.useState<boolean>(false);
    const [imageLoading, setImageLoading] = React.useState<boolean>(true);
    // TODO ошибки внутри
    const [loadError, setLoadError] = React.useState<boolean>(false);
    loadError;

    const [containerWidth, setContainerWidth] = React.useState<number>(0);
    const imageSize = useImageSize(image, originalSize, containerWidth);

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

    const styles = useStyles();

    const onLayout = React.useCallback(function onLayout(event: LayoutChangeEvent) {
        setContainerWidth(event.nativeEvent.layout.width);
    }, []);

    return (
        <View onLayout={onLayout}>
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

const useStyles = makeStyles(() => ({
    skeleton: {
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
