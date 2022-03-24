import * as React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';

type TouchableWrapperProps = {
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    testID?: string;
};

export function TouchableWrapper({
    children,
    onPress,
    disabled,
    style,
    testID,
}: TouchableWrapperProps) {
    if (onPress) {
        return (
            <TouchableOpacity testID={testID} style={style} disabled={disabled} onPress={onPress}>
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={style}>{children}</View>;
}
