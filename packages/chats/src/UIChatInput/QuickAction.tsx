import * as React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image, // TODO: use fast-image?
    View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIButtonGroup, UITextButton } from '@tonlabs/uikit.components';
import { UIAssets } from '@tonlabs/uikit.assets';

import { commonStyles } from './styles';

type QuickAction = {
    key: string;
    testID: string;
    onPress: () => void | Promise<void>;
    icon?: ImageSourcePropType;
    title?: string;
};

type Props = {
    quickAction?: QuickAction[];
    inputHasValue: boolean;
    onSendText: () => void | Promise<void>;
};

export function QuickAction(props: Props) {
    const { quickAction, inputHasValue, onSendText } = props;

    if (inputHasValue) {
        return (
            <View>
                <TouchableOpacity
                    testID="send_btn"
                    style={commonStyles.buttonContainer}
                    onPress={onSendText}
                >
                    <Image
                        source={UIAssets.icons.ui.buttonMsgSend}
                        style={commonStyles.icon}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    if (!quickAction) {
        return null;
    }

    return (
        <UIButtonGroup>
            {quickAction.map((action, index) => (
                <UITextButtton
                    key={`quickAction~${action.key}`}
                    testID={action.testID}
                    buttonStyle={commonStyles.buttonContainer}
                    textStyle={UIStyle.text.bodyMedium()}
                    onPress={action.onPress}
                    icon={action.icon}
                    title={action.title}
                    disableIconColor
                />
            ))}
        </UIButtonGroup>
    );
}
