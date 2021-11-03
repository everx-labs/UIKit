import * as React from 'react';
import { View } from 'react-native';

import {
    UIMsgButton,
    UIMsgButtonType,
    UIMsgButtonVariant,
    UIMsgButtonCornerPosition,
} from '@tonlabs/uikit.controls';

import { BubblePosition, useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';

import { ActionButtonVariant } from './constants';
import type { ActionButtonMessage } from './types';

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
    const { status, text, disabled, onPress, variant } = message; // textMode = 'ellipsize',
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

    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <UIMsgButton
                disabled={disabled}
                onPress={onPress}
                testID={`chat_action_cell_${text}`}
                title={text}
                type={UIMsgButtonType.Secondary}
                variant={msgVariant}
                cornerPosition={getButtonRadius(message, position)}
            />
        </View>
    );
}
