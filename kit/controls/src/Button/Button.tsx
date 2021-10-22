import * as React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableElement } from './TouchableElement';
import { UIIndicator } from '../UIIndicator';

import {
    ButtonContent,
    ButtonContentDirection,
    ButtonIcon,
    ButtonTitle,
    useButtonChildren,
} from './useButtonChildren';
import { UIConstant } from '../constants';
import type { ButtonAnimations } from './types';

export type UILayout = {
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
};

type ButtonProps = {
    animations: ButtonAnimations;
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
    onLongPress?: () => void | Promise<void>;
    onPress?: () => void | Promise<void>;
    testID?: string;
};

const ButtonForward = React.forwardRef<typeof TouchableElement, ButtonProps>(
    function ButtonForwarded(
        {
            animations,
            children,
            containerStyle,
            contentStyle,
            disabled,
            loading,
            onLongPress,
            onPress,
            testID,
            ...props
        }: ButtonProps,
        ref,
    ) {
        const handleOnLongPress = React.useCallback(() => {
            if (!loading && onLongPress != null) {
                onLongPress();
            }
        }, [loading, onLongPress]);

        const handleOnPress = React.useCallback(() => {
            if (!loading && onPress != null) {
                onPress();
            }
        }, [loading, onPress]);

        const processedChildren = useButtonChildren(children);

        return (
            <TouchableElement
                ref={ref}
                {...props}
                animations={animations}
                disabled={disabled}
                loading={loading}
                onLongPress={handleOnLongPress}
                onPress={handleOnPress}
                style={[styles.container, containerStyle]}
                contentStyle={[styles.content, contentStyle]}
                testID={testID}
            >
                <View style={Platform.OS === 'web' ? styles.content : null}>
                    {loading ? (
                        <UIIndicator
                            color={ColorVariants.LineNeutral}
                            size={UIConstant.loaderSize}
                        />
                    ) : (
                        processedChildren
                    )}
                </View>
            </TouchableElement>
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Content|Icon|Title] later, and want to see it right away
export const Button: typeof ButtonForward & {
    Content: typeof ButtonContent;
    ContentDirection: typeof ButtonContentDirection;
    Icon: typeof ButtonIcon;
    Title: typeof ButtonTitle;
} = ButtonForward;

Button.Content = ButtonContent;
Button.ContentDirection = ButtonContentDirection;
Button.Icon = ButtonIcon;
Button.Title = ButtonTitle;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    content: {
        flexShrink: 1,
    },
});
