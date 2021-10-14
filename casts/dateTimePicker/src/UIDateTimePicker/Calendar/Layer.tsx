import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { Portal } from '@tonlabs/uikit.layout';

import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

export function Layer({
    visible,
    children,
}: {
    visible: boolean;
    children: () => React.ReactNode;
}) {
    const [isVisible, setIsVisible] = React.useState(false);

    const dismiss = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    const opacity = useSharedValue(0);

    React.useEffect(() => {
        if (visible === isVisible) {
            return;
        }

        if (!visible) {
            opacity.value = withTiming(
                0,
                {
                    duration: 100,
                    easing: Easing.in(Easing.ease),
                },
                isFinished => {
                    if (isFinished) {
                        runOnJS(dismiss)();
                    }
                },
            );
            return;
        }

        setIsVisible(true);
        opacity.value = withSpring(1, {
            overshootClamping: true,
        });
    }, [visible, dismiss, opacity, isVisible]);

    const theme = useTheme();
    const bgColor = theme[ColorVariants.BackgroundPrimary];
    const style = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            backgroundColor: bgColor,
        };
    });

    if (!isVisible) {
        return null;
    }

    return (
        <Portal absoluteFill forId="calendar">
            <Animated.View style={[styles.layerContainer, style]}>{children()}</Animated.View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    layerContainer: {
        flex: 1,
    },
});
