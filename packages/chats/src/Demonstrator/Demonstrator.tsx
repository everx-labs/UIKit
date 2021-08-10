import * as React from 'react';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import { Duplicate } from './Duplicate';

type DemonstratorProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export const Demonstrator = (props: DemonstratorProps) => {
    const { onClose, children } = props;
    const ref = useAnimatedRef<Animated.View>();

    const styles = useStyles();

    return (
        <>
            <Animated.View ref={ref} style={styles.originalContainer}>
                {children}
            </Animated.View>

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
