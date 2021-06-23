import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { BUTTON_WITH_SPRING_CONFIG } from '../constants';

type TouchableElementProps = {
    animations?: any;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    testID?: string;
}

export const TouchableElement = ({
    animations,
    children,
    disabled,
    loading,
    onPress,
    style,
    contentStyle,
    testID,
    ...props
}: TouchableElementProps) => {
    const {
        animatedPress: {
            pressAnim,
            pressBackgroundStyle,
            pressOverlayStyle,
        },
        animatedTitle: {
            titleAnim,
        },
        animatedIcon: {
            iconAnim,
        },
    } = animations;

    const handlePressIn = () => {
        if (!loading) {
            pressAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            titleAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
            iconAnim.value = Animated.withSpring(1, BUTTON_WITH_SPRING_CONFIG);
        }
    };

    const handlePressOut = () => {
        if (!loading) {
            pressAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            titleAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
            iconAnim.value = Animated.withSpring(0, BUTTON_WITH_SPRING_CONFIG);
        }
    };

    return (
        <TouchableNativeFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[style, pressBackgroundStyle]}>
                <Animated.View
                    style={[
                        styles.overlayContainer,
                        contentStyle,
                        pressOverlayStyle,
                    ]}
                >
                    {React.Children.only(children)}
                </Animated.View>
            </Animated.View>
        </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        height: '100%',
        flexGrow: 1,
        justifyContent: 'center',
    },
});
