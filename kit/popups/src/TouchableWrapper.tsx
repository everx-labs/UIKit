import * as React from 'react';
import { StyleProp, ViewStyle, View, Pressable } from 'react-native';
import { hapticSelection } from '@tonlabs/uikit.controls';
import { runOnUI } from 'react-native-reanimated';

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
    const onPressWithHaptic = React.useCallback(() => {
        if (onPress) {
            runOnUI(hapticSelection)();
            onPress();
        }
    }, [onPress]);
    if (onPress) {
        return (
            <Pressable
                testID={testID}
                disabled={disabled}
                onPress={onPressWithHaptic}
                style={style}
            >
                {children}
            </Pressable>
        );
    }
    return <View style={style}>{children}</View>;
}
