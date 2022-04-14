import * as React from 'react';
import { ImageSourcePropType, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { TypographyVariants, makeStyles } from '@tonlabs/uikit.themes';

import { UIConstant } from '../constants';
import { ActionButtonIcon } from './ActionButtonIcon';
import { ButtonTitle } from '../Button/useButtonChildren';
import { TouchableElement } from '../Button/TouchableElement';
import { ActionButtonAnimations, ContentAnimations, UIActionButtonType } from './types';
import {
    useButtonAnimations,
    useButtonColorScheme,
    useButtonColors,
    useContentAnimatedStyles,
} from './hooks';
import type { UILayout } from '../types';

export type UIActionButtonProps = {
    /**
     * Whether the button is disabled or not; if true a button is grayed out and `onPress` does no response
     */
    disabled?: boolean;
    /**
     * Source for the button icon
     */
    icon?: ImageSourcePropType;
    /**
     * Allows to set top, right, bottom and left margins to the button container
     */
    layout?: UILayout;
    /**
     * Whether to display a loading indicator instead of button content or not
     */
    loading?: boolean;
    /**
     * Function will be called on button press
     */
    onPress?: () => void | Promise<void>;
    /**
     * ID for usage in tests
     */
    testID?: string;
    /**
     * Text displayed on the button
     */
    title?: string;
    /**
     * Type of the button; specific type allows to set the corresponding accent
     * - `UIActionButtonType.Primary` - button with current theme background BW color (default)
     * - `UIActionButtonType.Accent` - button with current theme background accent color
     */
    type?: UIActionButtonType;
};

export const UIActionButton = React.forwardRef<TouchableWithoutFeedback, UIActionButtonProps>(
    function UIActionButton(
        {
            disabled,
            icon,
            layout,
            loading,
            onPress,
            testID,
            title,
            type = UIActionButtonType.Primary,
        }: UIActionButtonProps,
        ref,
    ) {
        const { overlay, content } = useButtonColorScheme(type);
        const { contentColor, backgroundColor } = useButtonColors(disabled, overlay, content);

        const buttonAnimations: ActionButtonAnimations = useButtonAnimations(
            backgroundColor,
            overlay.hover,
            overlay.pressed,
        );

        const contentAnimations: ContentAnimations = useContentAnimatedStyles(
            buttonAnimations.hover.animationParam,
            buttonAnimations.press.animationParam,
            content.hover,
            content.pressed,
            contentColor,
        );

        const styles = useStyles(icon, loading);

        const handleOnPress = React.useCallback(() => {
            if (!loading && onPress != null) {
                onPress();
            }
        }, [loading, onPress]);

        return (
            <TouchableElement
                ref={ref}
                onPress={handleOnPress}
                animations={buttonAnimations}
                disabled={disabled || loading}
                loading={loading}
                style={[styles.container, layout]}
                testID={testID}
            >
                <View style={styles.content}>
                    <View style={styles.actionButtonIcon}>
                        <ActionButtonIcon
                            icon={icon}
                            loading={loading}
                            animatedProps={contentAnimations.iconProps}
                            initialColor={contentColor}
                        />
                    </View>
                    {title != null ? (
                        <ButtonTitle
                            style={styles.title}
                            titleRole={TypographyVariants.NarrowActionNote}
                            titleColor={contentColor}
                            titleAnimStyle={contentAnimations.titleStyle}
                        >
                            {title}
                        </ButtonTitle>
                    ) : null}
                </View>
            </TouchableElement>
        );
    },
);

const useStyles = makeStyles((icon: ImageSourcePropType | undefined, loading: boolean) => ({
    container: {
        height: UIConstant.actionButtonHeight,
        minWidth: UIConstant.actionButtonHeight,
        borderRadius: UIConstant.alertBorderRadius,
        overflow: 'hidden',
    },
    content: {
        paddingHorizontal: UIConstant.normalContentOffset,
        flexDirection: 'row',
    },
    leftIcon: {
        marginRight: UIConstant.smallContentOffset,
        height: UIConstant.actionButtonIconSize,
        width: UIConstant.actionButtonIconSize,
    },
    title: {
        paddingLeft: icon ? UIConstant.smallContentOffset : 0,
        opacity: loading && !icon ? 0 : 1,
    },
    actionButtonIcon: {
        ...(icon ? null : StyleSheet.absoluteFillObject),
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
