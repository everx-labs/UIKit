import * as React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { TouchableElement } from './TouchableElement';

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
    typeof TouchableElement,
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
) {
    const handleOnPress = React.useCallback(
        () => {
            if (!loading) {
                onPress();
            }
        },
        [loading, onPress],
    );

    const processedChildren = useButtonChildren(children);

    return (
        <TouchableElement
            {...props}
            disabled={disabled}
            onPress={handleOnPress}
            style={[containerStyle, styles.content]}
            testID={testID}
        >
            <View>
                {loading ? (
                    <ActivityIndicator />
                ) : processedChildren}
            </View>
        </TouchableElement>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
