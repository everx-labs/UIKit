import * as React from 'react';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { I18nManager, StyleProp, ViewStyle } from 'react-native';

import { MessageStatus } from './constants';
import type { BubbleBaseT } from './types';
import { BubblePosition } from './useBubblePosition';

export const useBubbleRoundedCornerStyle = (
    message: BubbleBaseT,
    position: BubblePosition,
    borderRadius?: number, // @default UILayoutConstant.borderRadius
): StyleProp<ViewStyle> => {
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);
    if (position === BubblePosition.left && message.firstFromChain) {
        return {
            borderRadius: borderRadius !== undefined ? borderRadius : UILayoutConstant.borderRadius,
            ...(isRTL ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }),
        };
    }

    if (position === BubblePosition.right && message.lastFromChain) {
        return {
            borderRadius: borderRadius !== undefined ? borderRadius : UILayoutConstant.borderRadius,
            ...(isRTL ? { borderBottomLeftRadius: 0 } : { borderBottomRightRadius: 0 }),
        };
    }

    return {
        borderRadius: UILayoutConstant.borderRadius,
    };
};

export const useBubbleBackgroundColor = (message: BubbleBaseT): StyleProp<ViewStyle> => {
    const theme = useTheme();

    if (message.status === MessageStatus.Aborted) {
        return {
            backgroundColor: theme[ColorVariants.BackgroundNegative],
        };
    }

    if (message.status === MessageStatus.Received) {
        return {
            backgroundColor: theme[ColorVariants.BackgroundSecondary],
        };
    }

    if (message.status === MessageStatus.Sent) {
        return {
            backgroundColor: theme[ColorVariants.BackgroundAccent],
        };
    }

    if (message.status === MessageStatus.Pending) {
        return {
            backgroundColor: theme[ColorVariants.BackgroundAccent],
            opacity: 0.7,
        };
    }

    return null;
};
