import * as React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';
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
            <TouchableOpacity
                testID={testID}
                disabled={disabled}
                onPress={onPressWithHaptic}
                style={style}
                activeOpacity={1}
            >
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={style}>{children}</View>;
}
