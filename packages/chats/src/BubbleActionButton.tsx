import * as React from 'react';
import { View } from 'react-native';

import {
    UIMsgButton,
    UIMsgButtonType,
} from '@tonlabs/uikit.hydrogen';
import { useBubbleContainerStyle } from './useBubblePosition';
import type { ActionButtonMessage } from './types';

export function BubbleActionButton(message: ActionButtonMessage) {
    const { text, disabled, onPress } = message; // textMode = 'ellipsize',
    const containerStyle = useBubbleContainerStyle(message);

    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <UIMsgButton
                disabled={disabled}
                onPress={onPress}
                testID={`chat_action_cell_${text}`}
                title={text}
                type={UIMsgButtonType.Secondary}
            />
        </View>
    );
    // TODO: add textMode processing to UIMsgButton if needed
    // <TouchableOpacity
    //     style={[
    //         textMode !== 'fit' && styles.buttonFixedHeight,
    //     ]}
    // >
    //     <UILabel
    //         numberOfLines={textMode === 'ellipsize' ? 1 : undefined}
    //     >
    //         {text}
    //     </UILabel>
    // </TouchableOpacity>
}
