import * as React from 'react';
import { ImageStyle, Platform, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { TouchableElement } from './TouchableElement';
import { UIIndicator } from '../UIIndicator';

import {
    ButtonContent,
    ButtonContentDirection,
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

type BackgroundParams = {
    animationParam: Animated.SharedValue<number>;
    backgroundStyle?: Animated.AnimatedStyleProp<ViewStyle>;
    overlayStyle?: Animated.AnimatedStyleProp<ViewStyle>;
};

type ContentParams = {
    animationParam: Animated.SharedValue<number>;
    style: Animated.AnimatedStyleProp<TextStyle | ImageStyle>;
    initialColor?: ColorVariants;
    activeColor?: ColorVariants;
};

export type ButtonAnimations = {
    hover?: BackgroundParams,
    press?: BackgroundParams,
    title?: ContentParams,
    icon?: ContentParams,
};

type ButtonProps = {
    animations: ButtonAnimations;
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
        animations,
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
            animations={animations}
            disabled={disabled}
            loading={loading}
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
                ) : processedChildren}
            </View>
        </TouchableElement>
    );
});

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
        flexShrink: 1
    },
});
