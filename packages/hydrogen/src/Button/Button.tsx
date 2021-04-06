import * as React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
    ButtonContent,
    ButtonIcon,
    ButtonTitle,
    useButtonChildren,
} from './useButtonChildren';

type ButtonProps = {
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
    onPress: () => void;
    testID?: string;
}

const ButtonForward = React.forwardRef<
    TouchableOpacity,
    ButtonProps
    >(function ButtonForwarded(
    {
        children,
        containerStyle,
        disabled,
        loading,
        onPress,
        testID,
        ...props
    }: ButtonProps,
    ref,
) {
    const processedChildren = useButtonChildren(children);
    return (
        <TouchableOpacity
            ref={ref}
            {...props}
            disabled={disabled}
            onPress={onPress}
            testID={testID}
        >
            <View style={[styles.content, containerStyle]}>
                {loading ? (
                    <ActivityIndicator />
                ) : processedChildren}
            </View>
        </TouchableOpacity>
    );
});

// @ts-expect-error
// ts doesn't understand that we assign [Content|Icon|Title] later, and want to see it right away
export const Button: typeof ButtonForward & {
    Content: typeof ButtonContent;
    Icon: typeof ButtonIcon;
    Title: typeof ButtonTitle;
} = ButtonForward;

Button.Content = ButtonContent;
Button.Icon = ButtonIcon;
Button.Title = ButtonTitle;

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
    },
});
