import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Portal,
    ColorVariants,
    useTheme,
    makeStyles,
} from '@tonlabs/uikit.hydrogen';
import Animated from 'react-native-reanimated';

const ALERT_WINDOW_MINIMUM_OFFSET = 48;
const ALERT_WINDOW_MAXIMUM_WIDTH = 350;

// eslint-disable-next-line no-shadow
enum DisplayState {
    VISIBLE = 1,
    HIDDEN = 0,
}

const useStyles = makeStyles((theme) => ({
    container: {
        ...StyleSheet.absoluteFillObject,
        padding: ALERT_WINDOW_MINIMUM_OFFSET,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundStyle: {
        flex: 1,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
    },
    windowStyles: {
        maxWidth: ALERT_WINDOW_MAXIMUM_WIDTH,
        flex: 1,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
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
        return Animated.withSpring(displayState.value);
    });

    const linearAnimatedState = Animated.useDerivedValue<number>(() => {
        return Animated.withTiming(
            displayState.value,
            { duration: 200 },
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

    return (
        <Portal absoluteFill>
            <Animated.View
                style={[styles.backgroundStyle, backgroundAnimatedStyle]}
            >
                <View style={styles.container} testID={testID}>
                    <Animated.View
                        style={[styles.windowStyles, windowAnimatedStyles]}
                    >
                        {children}
                    </Animated.View>
                </View>
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
     * ID for usage in tests
     */
    testID?: string;
    /**
     * Content of alert
     */
    children: React.ReactNode;
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
