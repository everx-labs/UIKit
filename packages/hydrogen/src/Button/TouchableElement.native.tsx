import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

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
    return (
        <TouchableNativeFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
        >
            <View style={[styles.overflowHidden, style]}>
                {React.Children.only(children)}
            </View>
        </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    overflowHidden: {
        overflow: 'hidden',
    },
});
