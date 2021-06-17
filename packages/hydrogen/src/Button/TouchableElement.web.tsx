import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useHover } from '../useHover';

type TouchableElementProps = {
    disabled?: boolean;
    children: React.ReactNode;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    testID?: string;
}

export const TouchableElement = ({
    disabled,
    children,
    onPress,
    style,
    contentStyle,
    testID,
    ...props
}: TouchableElementProps) => {
    const {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    } = useHover();

    const handlePressIn = () => {
        // TODO: add pressIn animation
    };

    const handlePressOut = () => {
        // TODO: add pressOut animation
    };

    React.useEffect(
        () => {
            if (!disabled && isHovered) {
                // TODO: add hover animation/effect
            } else {
                // TODO: turn back to normal state
            }
        },
        [disabled, isHovered],
    );

    // const overlayStyle = Animated.useAnimatedStyle(() => {
    //     return {}
    // });

    return (
        <TouchableWithoutFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View style={style}>
                <Animated.View
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={[contentStyle, isHovered ? { backgroundColor: 'pink' } : null]}
                >
                    {React.Children.only(children)}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};
