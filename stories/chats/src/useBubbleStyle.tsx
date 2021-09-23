import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import type { StyleProp, ViewStyle } from 'react-native';
import { BubbleBaseT, MessageStatus } from './types';
import { BubblePosition } from './useBubblePosition';

export const useBubbleRoundedCornerStyle = (
    message: BubbleBaseT,
    position: BubblePosition,
    borderRadius?: number, // @default UIConstant.borderRadius()
) => {
    if (position === BubblePosition.left && message.firstFromChain) {
        return {
            borderRadius: borderRadius !== undefined ? borderRadius : UIConstant.borderRadius(),
            borderTopLeftRadius: 0,
        };
    }

    if (position === BubblePosition.right && message.lastFromChain) {
        return {
            borderRadius: borderRadius !== undefined ? borderRadius : UIConstant.borderRadius(),
            borderBottomRightRadius: 0,
        };
    }

    return {
        borderRadius: UIConstant.borderRadius(),
    };
};

export const useBubbleBackgroundColor = (message: BubbleBaseT): StyleProp<ViewStyle> => {
    const theme = useTheme();

    if (message.status === MessageStatus.Aborted) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundNegative])];
    }

    if (message.status === MessageStatus.Received) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundSecondary])];
    }

    if (message.status === MessageStatus.Sent) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundAccent])];
    }

    if (message.status === MessageStatus.Pending) {
        return [
            UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundAccent]),
            UIStyle.common.opacity70(),
        ];
    }

    return null;
};
