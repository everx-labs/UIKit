import * as React from 'react';
import { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import { Duplicate } from './Duplicate';

type DemonstratorProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
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
                {children}
            </Duplicate>
        </>
    );
};

const useStyles = makeStyles(() => ({
    originalContainer: {
        zIndex: -10,
    },
}));
