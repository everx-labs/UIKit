import * as React from 'react';
import {
    ColorValue,
    ImageSourcePropType,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

import { ColorVariants, useTheme, TypographyVariants, makeStyles } from '@tonlabs/uikit.themes';

import { UIConstant } from '../constants';
import { ActionButtonIcon } from './ActionButtonIcon';
import { ButtonTitle } from '../Button/useButtonChildren';
import { TouchableElement } from '../Button/TouchableElement';
import { ActionButtonAnimations, ContentAnimations, UIActionButtonType } from './types';
import { useContentAnimatedStyles } from './hooks';
import { runUIGetTransparentColor } from './runUIGetTransparentColor';

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
     * - `UIActionButtonType.Primary` - button with current theme accent background color (default)
     * - `UIActionButtonType.Secondary` - button with current theme primary inverted background color
     * - `UIActionButtonType.Tertiary` - button with 1 px border style
     * - `UIActionButtonType.Nulled` - button without visible borders and background color
     */
    type?: UIActionButtonType;
};

const getButtonStates = (type: UIActionButtonType) => {
    switch (type) {
        case UIActionButtonType.Primary:
            return {
                hoverOverlayColor: ColorVariants.BackgroundPrimary,
                pressOverlayColor: ColorVariants.BackgroundPrimary,
                hoverContentColor: ColorVariants.SpecialAccentLight,
                pressContentColor: ColorVariants.SpecialAccentDark,
            };
        case UIActionButtonType.Accent:
        default:
            return {
                hoverOverlayColor: ColorVariants.SpecialAccentLight,
                pressOverlayColor: ColorVariants.SpecialAccentDark,
                hoverContentColor: ColorVariants.TextPrimary,
                pressContentColor: ColorVariants.TextPrimary,
            };
    }
};

function useButtonAnimations(
    hoverOverlayColor: ColorVariants,
    pressOverlayColor: ColorVariants,
): ActionButtonAnimations {
    const theme = useTheme();

    const hoverAnim = useSharedValue(0);
    const hoverOverlayValue = useDerivedValue(() => {
        return interpolateColor(
            hoverAnim.value,
            [0, 1],
            [
                runUIGetTransparentColor(theme[ColorVariants[hoverOverlayColor]] as string),
                theme[ColorVariants[hoverOverlayColor]] as string,
            ],
        );
    });
    const hoverOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: hoverOverlayValue.value,
        };
    });

    const pressAnim = useSharedValue(0);
    const pressOverlayValue = useDerivedValue(() => {
        return interpolateColor(
            pressAnim.value,
            [0, 1],
            [
                runUIGetTransparentColor(theme[ColorVariants[pressOverlayColor]] as string),
                theme[ColorVariants[pressOverlayColor]] as string,
            ],
        );
    });
    const pressOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: pressOverlayValue.value,
        };
    });

    return {
        hover: {
            animationParam: hoverAnim,
            backgroundStyle: undefined,
            overlayStyle: hoverOverlayStyle,
        },
        press: {
            animationParam: pressAnim,
            backgroundStyle: undefined,
            overlayStyle: pressOverlayStyle,
        },
    };
}

function useButtonStyles(type: UIActionButtonType, disabled?: boolean) {
    let backgroundColor: ColorVariants = ColorVariants.Transparent;
    let contentColor: ColorVariants = ColorVariants.TextAccent;

    if (type === UIActionButtonType.Primary) {
        // primary background color
        backgroundColor = ColorVariants.BackgroundPrimary;

        // primary content color (title, icons)
        if (disabled) {
            contentColor = ColorVariants.TextTertiary;
        } else {
            contentColor = ColorVariants.TextAccent;
        }
    } else if (type === UIActionButtonType.Accent) {
        // secondary background color
        if (disabled) {
            backgroundColor = ColorVariants.BackgroundNeutral;
        } else {
            backgroundColor = ColorVariants.BackgroundAccent;
        }

        // secondary content color (title, icons)
        if (disabled) {
            contentColor = ColorVariants.TextTertiary;
        } else {
            contentColor = ColorVariants.TextPrimary;
        }
    }

    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme[ColorVariants[backgroundColor]] as ColorValue,
        borderRadius: UIConstant.alertBorderRadius,
    };

    return {
        buttonStyle,
        contentColor,
    };
}

export const UIActionButton = React.forwardRef<TouchableWithoutFeedback, UIActionButtonProps>(
    (
        {
            disabled,
            icon,
            loading,
            onPress,
            testID,
            title,
            type = UIActionButtonType.Primary,
        }: UIActionButtonProps,
        ref,
    ) => {
        const { buttonStyle, contentColor } = useButtonStyles(type, disabled);
        const { hoverOverlayColor, pressOverlayColor, hoverContentColor, pressContentColor } =
            getButtonStates(type);

        const buttonAnimations: ActionButtonAnimations = useButtonAnimations(
            hoverOverlayColor,
            pressOverlayColor,
        );

        const сontentAnimations: ContentAnimations = useContentAnimatedStyles(
            contentColor,
            buttonAnimations.hover.animationParam,
            buttonAnimations.press.animationParam,
            hoverContentColor,
            pressContentColor,
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
                style={[styles.container, buttonStyle]}
                testID={testID}
            >
                <View style={styles.content}>
                    <View style={styles.actionButtonIcon}>
                        <ActionButtonIcon
                            icon={icon}
                            loading={loading}
                            animStyles={сontentAnimations.icon}
                            initialColor={contentColor}
                        />
                    </View>
                    {title != null ? (
                        <ButtonTitle
                            style={styles.title}
                            titleRole={TypographyVariants.NarrowActionNote}
                            titleColor={contentColor}
                            titleAnimStyle={сontentAnimations.titleStyle}
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
        borderWidth: StyleSheet.hairlineWidth,
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
