import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
    useDerivedValue,
    withSpring,
    useAnimatedStyle,
    // useAnimatedReaction,
    interpolate,
    useSharedValue,
    runOnJS,
    measure,
} from 'react-native-reanimated';
import { makeStyles, Portal } from '@tonlabs/uikit.hydrogen';
import type { Dimensions } from './types';
import { VisibilityState } from './constants';

const useDimensions = (
    originalRef: React.RefObject<Animated.View>,
    visibilityState: Animated.SharedValue<VisibilityState>,
): Dimensions => {
    const width = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const pageX = useSharedValue<number>(0);
    const pageY = useSharedValue<number>(0);

    try {
        useDerivedValue(() => {
            // console.log('useDerivedValue', visibilityState.value)
            if (visibilityState.value === VisibilityState.Opened) {
                    const measurements = measure(originalRef);
    
                    console.log('measurements', measurements)
    
                    height.value = measurements.height
                    width.value = measurements.width
                    pageX.value = measurements.pageX
                    pageY.value = measurements.pageY
    
                    // height.value = 72
                    // width.value = 72
                    // pageX.value = 302.00001525878906
                    // pageY.value = 217
    
                    // if (height.value !== measurements.height) {
                    //     height.value = measurements.height
                    // }
                    // if (width.value !== measurements.width) {
                    //     width.value = measurements.width
                    // }
                    // if (pageX.value !== measurements.pageX) {
                    //     pageX.value = measurements.pageX
                    // }
                    // if (pageY.value !== measurements.pageY) {
                    //     pageY.value = measurements.pageY
                    // }
            }
        })
    } catch (e) {
        console.log('Demonstrator: Fail of measurements');
    }

    // useAnimatedReaction(
    //     () => {
    //         return { ref: originalRef };
    //     },
    //     (state) => {
    //         if (visibilityState.value === VisibilityState.Opened) {
    //             try {
    //                 const measurements = measure(state.ref);

    //                 // console.log('useAnimatedReaction', measurements)

    //                 if (height.value !== measurements.height) {
    //                     height.value = measurements.height;
    //                 }
    //                 if (width.value !== measurements.width) {
    //                     width.value = measurements.width;
    //                 }
    //                 if (pageX.value !== measurements.pageX) {
    //                     pageX.value = measurements.pageX;
    //                 }
    //                 if (pageY.value !== measurements.pageY) {
    //                     pageY.value = measurements.pageY;
    //                 }
    //             } catch (e) {
    //                 // console.log('Demonstrator: Fail of measurements');
    //             }
    //         }
    //     }
    // );

    return {
        width,
        height,
        pageX,
        pageY,
    };
};

const useOpenTransitionStyle = (
    visibilityState: Animated.SharedValue<VisibilityState>,
    onClose: () => void,
) => {
    const openProgress = useDerivedValue(() => {
        const callback = (isFinished: boolean) => {
            if (
                isFinished &&
                visibilityState.value === VisibilityState.Closed
            ) {
                runOnJS(onClose)();
            }
        };
        return withSpring(
            visibilityState.value,
            {
                overshootClamping: true,
            },
            callback,
        );
    });

    const openTransitionStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        openProgress.value,
                        [VisibilityState.Closed, VisibilityState.Opened],
                        [1, 2],
                    ),
                },
            ],
        };
    });

    return {
        openTransitionStyle,
    };
};

const getVisibilityState = (isOpen: boolean): VisibilityState => {
    return isOpen ? VisibilityState.Opened : VisibilityState.Closed;
};

const useVisibilityState = (isOpen: boolean) => {
    const visibilityState = useSharedValue<VisibilityState>(
        getVisibilityState(isOpen),
    );

    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                visibilityState.value = getVisibilityState(true);
            });
        }
    }, [isOpen, visibilityState]);

    const onPressUnderlay = React.useCallback(() => {
        visibilityState.value = getVisibilityState(false);
    }, [visibilityState]);

    return {
        visibilityState,
        onPressUnderlay,
    };
};

type DuplicateProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    originalRef: React.RefObject<Animated.View>;
    // visibilityState: Animated.SharedValue<VisibilityState>;
};

export const Duplicate = ({
    isOpen,
    children,
    onClose,
    originalRef,
}: DuplicateProps) => {
    const { visibilityState, onPressUnderlay } = useVisibilityState(isOpen);
    const { pageY, pageX, width, height } = useDimensions(
        originalRef,
        visibilityState,
    );

    const duplicateContainerDimensionsStyle = useAnimatedStyle(() => {
        console.log('duplicateContainerDimensionsStyle', {
            pageY: pageY.value,
            pageX: pageX.value,
            width: width.value,
            height: height.value,
        });
        visibilityState;
        // return {
        //     top: pageY.value,
        //     left: pageX.value,
        //     width: width.value,
        //     height: height.value,
        // };
        // console.log('pageY.value', pageY.value)
        return {
            transform: [
                {
                    translateY: pageY.value,
                },
                {
                    translateX: pageX.value,
                },
            ],
            // top: pageY.value,
            // left: pageX.value,
            // top: 217,
            // left: 302,
            width: 72,
            height: 72,
        };
    }, []);

    const { openTransitionStyle } = useOpenTransitionStyle(
        visibilityState,
        onClose,
    );

    const styles = useStyles();

    if (!isOpen) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <Animated.View style={styles.duplicateContainer}>
                <TouchableWithoutFeedback onPress={onPressUnderlay}>
                    <Animated.View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: '#00000099',
                            zIndex: -10,
                        }}
                    />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.duplicateContent,
                        duplicateContainerDimensionsStyle,
                    ]}
                >
                    <Animated.View style={[openTransitionStyle]}>
                        <Animated.View style={{ borderWidth: 1, opacity: 0.5 }}>
                            {children}
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </Portal>
    );
};

const useStyles = makeStyles(() => ({
    duplicateContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    duplicateContent: {
        position: 'absolute',
    },
}));
