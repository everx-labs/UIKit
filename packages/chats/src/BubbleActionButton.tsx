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
import { useBubblePosition, BubblePosition } from './useBubblePosition';

const getButtonContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    } else if (position === BubblePosition.right) {
        return styles.containerRight;
    }
    return null;
};

const getButtonRadius = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.buttonLeft;
    } else if (position === BubblePosition.right) {
        return styles.buttonRight;
    }
    return null;
};

export function BubbleActionButton(props: ActionButtonMessage) {
    const position = useBubblePosition(props.status);
    const theme = useTheme();

    return (
        <View style={getButtonContainer(position)}>
            <TouchableOpacity
                testID={`chat_action_cell_${props.text}`}
                style={[
                    styles.common,
                    {
                        borderColor: theme[ColorVariants.LineAccent],
                    },
                    styles.button,
                    getButtonRadius(position),
                ]}
                onPress={props.onPress}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={UILabelColors.TextAccent}
                >
                    {props.text}
                </UILabel>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    containerRight: {
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    containerLeft: {
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    common: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: UIConstant.tinyContentOffset(),
    },
    button: {
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        height: UIConstant.smallButtonHeight(),
        borderRadius: UIConstant.borderRadius(),
    },
    buttonLeft: {
        borderTopLeftRadius: 0,
    },
    buttonRight: {
        borderBottomRightRadius: 0,
    },
});
