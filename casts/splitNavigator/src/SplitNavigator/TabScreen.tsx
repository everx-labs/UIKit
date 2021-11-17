import * as React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Freeze } from 'react-freeze';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ResourceSavingScene } from './ResourceSavingScene';

type TabScreenProps = {
    isVisible: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};
export function TabScreen({ isVisible, style, children }: TabScreenProps) {
    const visible = useSharedValue(false);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        if (visible.value === false && isVisible === true) {
            opacity.value = withSpring(1, { overshootClamping: true });
            visible.value = true;
            return;
        }
        if (visible.value === true && isVisible === false) {
            opacity.value = withSpring(0, { overshootClamping: true }, isFinished => {
                if (isFinished) {
                    visible.value = false;
                }
            });
        }
    }, [isVisible, visible, opacity]);

    const fadeStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <ResourceSavingScene isVisible={isVisible} style={style}>
            <Freeze freeze={!isVisible}>
                <Animated.View style={[styles.container, fadeStyle]}>{children}</Animated.View>
            </Freeze>
        </ResourceSavingScene>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
