import * as React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { UILabelAnimated, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIConstant } from '../constants';
import {
    UIMsgButtonType,
    UIMsgButtonVariant,
    UIMsgButtonIconPosition,
    ContentColors,
} from './constants';
import type { UIMsgButtonProps } from './types';
import { UIIndicator } from '../UIIndicator';
import { useColorValues, useCornerStyle } from './hooks';

export const MsgButtonContent = ({
    icon,
    iconPosition = UIMsgButtonIconPosition.Left,
    loading,
    title,
    caption,
    cornerPosition,
    type = UIMsgButtonType.Primary,
    variant = UIMsgButtonVariant.Neutral,
}: UIMsgButtonProps) => {
    const typeRef = React.useRef(type);
    const { backgroundColor, borderColor, contentColor, backgroundOverlayColor } = useColorValues(
        typeRef.current,
        variant,
    );

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColor ? backgroundColor.value : undefined,
            borderColor: borderColor ? borderColor.value : undefined,
            borderWidth: borderColor ? 1 : undefined,
        };
    });

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    const animatedBackgroundOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundOverlayColor ? backgroundOverlayColor.value : undefined,
        };
    });

    const image = React.useMemo(() => {
        if (icon == null) {
            return null;
        }
        const additionalStyles =
            iconPosition === UIMsgButtonIconPosition.Left && title ? styles.leftIcon : null;
        return (
            <UIAnimatedImage
                source={icon}
                style={[styles.icon, additionalStyles]}
                animatedProps={animatedImageProps}
            />
        );
    }, [animatedImageProps, icon, iconPosition, title]);

    const cornerStyle = useCornerStyle(cornerPosition);

    const isRightIconPosition = iconPosition === UIMsgButtonIconPosition.Right;

    return (
        <Animated.View style={[styles.container, cornerStyle, animatedContainerStyle]}>
            {type === UIMsgButtonType.Primary ? (
                <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundOverlayStyle]} />
            ) : null}
            {loading ? (
                <UIIndicator
                    style={styles.indicator}
                    color={ContentColors[type][variant].content.loadingColor}
                    size={UIConstant.loaderSize}
                />
            ) : (
                <View style={[styles.content, isRightIconPosition ? styles.extraPadding : null]}>
                    <View style={styles.centerContent}>
                        {iconPosition === UIMsgButtonIconPosition.Left ? image : null}
                        <View style={styles.textContainer}>
                            <View style={styles.actionContainer}>
                                {title ? (
                                    <UILabelAnimated
                                        role={UILabelRoles.Action}
                                        animatedProps={animatedLabelProps}
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                        selectable={false}
                                    >
                                        {title}
                                    </UILabelAnimated>
                                ) : null}
                                {iconPosition === UIMsgButtonIconPosition.Middle ? image : null}
                            </View>
                            {caption ? (
                                <UILabelAnimated
                                    animatedProps={animatedLabelProps}
                                    role={UILabelRoles.ActionLabel}
                                    selectable={false}
                                    style={styles.caption}
                                >
                                    {caption}
                                </UILabelAnimated>
                            ) : null}
                        </View>
                    </View>
                    {isRightIconPosition ? (
                        <View style={styles.rightIconContainer}>{image}</View>
                    ) : null}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: UIConstant.msgButtonHeight,
        borderRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: UILayoutConstant.normalContentOffset,
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    /**
     * Needed in order to leave space for icon in `UIMsgButtonIconPosition.Right` position
     */
    extraPadding: {
        paddingHorizontal:
            UILayoutConstant.normalContentOffset +
            UILayoutConstant.iconSize +
            UILayoutConstant.smallContentOffset,
    },
    centerContent: {
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        maxWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
    },
    caption: {
        textAlign: 'center',
    },
    indicator: {
        margin: UILayoutConstant.normalContentOffset,
    },
    icon: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    leftIcon: {
        marginRight: UILayoutConstant.smallContentOffset,
    },
    rightIconContainer: {
        ...StyleSheet.absoluteFillObject,
        paddingRight: UILayoutConstant.normalContentOffset,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});
