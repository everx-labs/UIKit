import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

import type { ActionButtonMessage } from './types';
import {
    useBubblePosition,
    BubblePosition,
    useBubbleContainerStyle,
} from './useBubblePosition';

const getButtonRadius = (
    options: ActionButtonMessage,
    position: BubblePosition,
) => {
    if (position === BubblePosition.left && options.firstFromChain) {
        return styles.buttonLeft;
    } else if (position === BubblePosition.right && options.lastFromChain) {
        return styles.buttonRight;
    }
    return null;
};

export function BubbleActionButton(message: ActionButtonMessage) {
    const { status, text, textMode = 'ellipsize', onPress } = message;
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);
    const theme = useTheme();

    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <TouchableOpacity
                testID={`chat_action_cell_${text}`}
                style={[
                    styles.common,
                    {
                        borderColor: theme[ColorVariants.LineAccent],
                    },
                    styles.button,
                    textMode !== 'fit' && styles.buttonFixedHeight,
                    getButtonRadius(message, position),
                ]}
                onPress={onPress}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={UILabelColors.TextAccent}
                    numberOfLines={textMode === 'ellipsize' ? 1 : undefined}
                >
                    {text}
                </UILabel>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    common: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        paddingVertical: UIConstant.tinyContentOffset(),
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        borderRadius: UIConstant.borderRadius(),
    },
    buttonFixedHeight: {
        height: UIConstant.smallButtonHeight(),
    },
    buttonLeft: {
        borderTopLeftRadius: 0,
    },
    buttonRight: {
        borderBottomRightRadius: 0,
    },
});
