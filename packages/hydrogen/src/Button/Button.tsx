import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { TouchableElement } from './TouchableElement';
import { UIIndicator } from '../UIIndicator';

import {
    ButtonContent,
    ButtonIcon,
    ButtonTitle,
    useButtonChildren,
} from './useButtonChildren';
import { ColorVariants } from '../Colors';
import { UIConstant } from '../constants';

export type UILayout = {
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
}

type ButtonProps = {
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
    onPress?: () => void | Promise<void>;
    testID?: string;
}

const ButtonForward = React.forwardRef<
    typeof TouchableElement,
    ButtonProps
>(function ButtonForwarded(
    {
        children,
        containerStyle,
        contentStyle,
        disabled,
        loading,
        onPress,
        testID,
        ...props
    }: ButtonProps,
    ref,
) {
    const handleOnPress = React.useCallback(
        () => {
            if (!loading && onPress) {
                onPress();
            }
        },
        [loading, onPress],
    );

    const processedChildren = useButtonChildren(children);

    return (
        <TouchableElement
            ref={ref}
            {...props}
            disabled={disabled}
            onPress={handleOnPress}
            style={[styles.container, containerStyle]}
            contentStyle={[styles.content, contentStyle]}
            testID={testID}
        >
            <View>
                {loading ? (
                    <UIIndicator
                        color={ColorVariants.StaticIconPrimaryDark}
                        size={UIConstant.iconSize}
                    />
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
    container: {
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});
