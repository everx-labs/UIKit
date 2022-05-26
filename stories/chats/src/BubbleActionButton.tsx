import * as React from 'react';
import { View } from 'react-native';

import {
    UIMsgButton,
    UIMsgButtonType,
    UIMsgButtonVariant,
    UIMsgButtonCornerPosition,
    UIMsgButtonIconPosition,
} from '@tonlabs/uikit.controls';

import { BubblePosition, useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';

import { ActionButtonVariant } from './constants';
import { ActionButtonMessage, ActionButtonMessageIconPosition } from './types';

const getButtonRadius = (options: ActionButtonMessage, position: BubblePosition) => {
    if (position === BubblePosition.left && options.firstFromChain) {
        return UIMsgButtonCornerPosition.TopLeft;
    }
    if (position === BubblePosition.right && options.lastFromChain) {
        return UIMsgButtonCornerPosition.BottomRight;
    }
    return undefined;
};

export function BubbleActionButton(message: ActionButtonMessage) {
    const {
        status,
        text,
        disabled,
        onPress,
        variant,
        onLayout,
        icon,
        iconPosition: iconPositionProp,
    } = message; // textMode = 'ellipsize',
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);

    const msgVariant = React.useMemo<UIMsgButtonVariant>(() => {
        if (variant === ActionButtonVariant.Negative) {
            return UIMsgButtonVariant.Negative;
        }
        if (variant === ActionButtonVariant.Neutral) {
            return UIMsgButtonVariant.Neutral;
        }
        if (variant === ActionButtonVariant.Positive) {
            return UIMsgButtonVariant.Positive;
        }
        return UIMsgButtonVariant.Neutral;
    }, [variant]);

    const iconPosition = React.useMemo<UIMsgButtonIconPosition | undefined>(() => {
        switch (iconPositionProp) {
            case ActionButtonMessageIconPosition.Left:
                return UIMsgButtonIconPosition.Left;
            case ActionButtonMessageIconPosition.Right:
                return UIMsgButtonIconPosition.Middle;
            default:
                return undefined;
        }
    }, [iconPositionProp]);

    return (
        <View style={containerStyle} onLayout={onLayout}>
            <UIMsgButton
                disabled={disabled}
                onPress={onPress}
                testID={`chat_action_cell_${text}`}
                title={text}
                icon={icon}
                iconPosition={iconPosition}
                type={UIMsgButtonType.Secondary}
                variant={msgVariant}
                cornerPosition={getButtonRadius(message, position)}
            />
        </View>
    );
}
