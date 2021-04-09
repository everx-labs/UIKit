import * as React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useHover } from '../useHover';

type TouchableElementProps = {
    disabled?: boolean;
    children: React.ReactNode;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}

export const TouchableElement = ({
    disabled,
    children,
    onPress,
    style,
    testID,
    ...props
}: TouchableElementProps) => {
    const handlePressIn = () => {
        // empty
    };

    const handlePressOut = () => {
        // empty
    };

    const {
        // isHovered,
        onMouseEnter,
        onMouseLeave,
    } = useHover();

    return (
        <TouchableWithoutFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={[styles.touchable, style]}
            >
                {React.Children.only(children)}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    touchable: {
        position: 'relative',
        ...(Platform.OS === 'web' && { cursor: 'pointer' }),
    }
});
