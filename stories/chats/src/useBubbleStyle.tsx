import * as React from 'react';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { I18nManager, StyleProp, ViewStyle } from 'react-native';

import { MessageStatus } from './constants';
import type { BubbleBaseT } from './types';
import { BubblePosition } from './useBubblePosition';

export const useBubbleRoundedCornerStyle = (
    message: BubbleBaseT,
    position: BubblePosition,
    borderRadius?: number, // @default UIConstant.borderRadius()
) => {
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);
    if (position === BubblePosition.left && message.firstFromChain) {
        return {
            borderRadius: borderRadius !== undefined ? borderRadius : UIConstant.borderRadius(),
            ...(isRTL ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }),
        };
    }

    if (position === BubblePosition.right && message.lastFromChain) {
        return {
            borderRadius: borderRadius !== undefined ? borderRadius : UIConstant.borderRadius(),
            ...(isRTL ? { borderBottomLeftRadius: 0 } : { borderBottomRightRadius: 0 }),
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
