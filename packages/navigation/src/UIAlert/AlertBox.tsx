import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
    Portal,
    ColorVariants,
    useTheme,
    makeStyles,
} from '@tonlabs/uikit.hydrogen';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { UIConstant } from '../constants';

// eslint-disable-next-line no-shadow
enum DisplayState {
    VISIBLE = 1,
    HIDDEN = 0,
}

const DURATION_OF_LINEAR_ANIMATION = 150;
const springConfig: Animated.WithSpringConfig = {
    damping: 20,
    stiffness: 300,
};

const useStyles = makeStyles((theme) => ({
    container: {
        ...StyleSheet.absoluteFillObject,
        padding: UIConstant.alertWindowMinimumHorizontalOffset,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundStyle: {
        flex: 1,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
    },
    windowStyles: {
        maxWidth: UIConstant.alertWindowMaximumWidth,
        flex: 1,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        borderRadius: UIConstant.alertBorderRadius,
        overflow: 'hidden',
    },
}));

type ContentProps = AlertBoxProps & {
    onDisappeared: () => void;
};

const Content: React.FC<ContentProps> = ({
    children,
    testID,
    visible,
    onDisappeared,
    onTapUnderlay,
}: ContentProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const displayState = Animated.useSharedValue<DisplayState>(
        DisplayState.HIDDEN,
    );

    React.useEffect(() => {
        const newDisplayState = visible
            ? DisplayState.VISIBLE
            : DisplayState.HIDDEN;
        if (newDisplayState !== displayState.value) {
            displayState.value = newDisplayState;
        }
    }, [visible, displayState]);

    const onAnimationEnd = React.useCallback(() => {
        if (!visible) {
            onDisappeared();
        }
    }, [visible, onDisappeared]);

    const springAnimatedState = Animated.useDerivedValue<number>(() => {
        return Animated.withSpring(displayState.value, springConfig);
    });

    const linearAnimatedState = Animated.useDerivedValue<number>(() => {
        /**
         * Used linear animation because there is no bouncing effect on transparency.
         * Linear animation in this case will be sufficient because there will be no animation interruption
         * */
        return Animated.withTiming(
            displayState.value,
            { duration: DURATION_OF_LINEAR_ANIMATION },
            (isFinished: boolean) => {
                if (isFinished) {
                    Animated.runOnJS(onAnimationEnd)();
                }
            },
        );
    });

    const windowAnimatedStyles = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: Animated.interpolate(
                        springAnimatedState.value,
                        [DisplayState.HIDDEN, DisplayState.VISIBLE],
                        [0.8, 1],
                    ),
                },
            ],
        };
    });

    const backgroundAnimatedStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: Animated.interpolate(
                linearAnimatedState.value,
                [DisplayState.HIDDEN, DisplayState.VISIBLE],
                [0, 1],
            ),
        };
    });

    const containerAnimatedStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: Animated.interpolate(
                linearAnimatedState.value,
                [DisplayState.HIDDEN, DisplayState.VISIBLE],
                [0, 1],
            ),
        };
    });

    const onEnded = React.useCallback(() => {
        if (onTapUnderlay) {
            onTapUnderlay();
        }
    }, [onTapUnderlay]);

    return (
        <Portal absoluteFill>
            <TapGestureHandler
                enabled={!!onTapUnderlay}
                onEnded={onEnded}
                maxDist={UIConstant.maxSlideDistanceOfTap}
            >
                <Animated.View
                    style={[styles.backgroundStyle, backgroundAnimatedStyle]}
                />
            </TapGestureHandler>

            <Animated.View
                style={[styles.container, containerAnimatedStyle]}
                testID={testID}
                pointerEvents="box-none"
            >
                <Animated.View
                    style={[styles.windowStyles, windowAnimatedStyles]}
                >
                    {children}
                </Animated.View>
            </Animated.View>
        </Portal>
    );
};

export type AlertBoxProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * Content of alert
     */
    children: React.ReactNode;
    /**
     * The callback that is called when tapping on the underlay
     */
    onTapUnderlay?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export const AlertBox: React.FC<AlertBoxProps> = (props: AlertBoxProps) => {
    const { visible } = props;
    /** It is needed to see how the alert disappears animatedly */
    const [isComponentVisible, setIsComponentVisible] = React.useState<boolean>(
        false,
    );

    React.useEffect(() => {
        if (visible && !isComponentVisible) {
            setIsComponentVisible(true);
        }
    }, [visible, isComponentVisible]);

    const onDisappeared = React.useCallback(() => {
        setIsComponentVisible(false);
    }, []);

    if (!isComponentVisible) {
        return null;
    }
    return <Content {...props} onDisappeared={onDisappeared} />;
};
