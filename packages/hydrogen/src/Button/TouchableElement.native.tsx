import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

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
    return (
        <TouchableNativeFeedback
            {...props}
            disabled={disabled}
            testID={testID}
            onPress={onPress}
        >
            <View style={style}>
                <View style={contentStyle}>
                    {React.Children.only(children)}
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};
