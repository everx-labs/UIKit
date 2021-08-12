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
    children: React.ReactElement;
};

export const Demonstrator = (props: DemonstratorProps) => {
    const { onClose, children } = props;
    const ref = useAnimatedRef<View>();

    const styles = useStyles();

    return (
        <>
            <View ref={ref} style={styles.originalContainer}>
                {children}
            </View>

            <Duplicate {...props} originalRef={ref} onClose={onClose}>
                <DuplicateImage source={props.imageRef} style={props.imageSize}>
                    {children}
                </DuplicateImage>
            </Duplicate>
        </>
    );
};

const useStyles = makeStyles(() => ({
    originalContainer: {
        zIndex: -10,
    },
}));
