import * as React from 'react';
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
} from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UIButtonGroup, UITextButton } from '@tonlabs/uikit.components';
import { UIAssets } from '@tonlabs/uikit.assets';

import type { QuickActionItem } from './types';
import { commonStyles } from './styles';

type Props = {
    quickAction?: QuickActionItem[];
    inputHasValue: boolean;
    onSendText: () => void | Promise<void>;
};

export function QuickAction(props: Props) {
    const { quickAction, inputHasValue, onSendText } = props;

    if (inputHasValue) {
        return (
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
        );
    }

    if (!quickAction) {
        return null;
    }

    return (
        <UIButtonGroup>
            {quickAction.map((action) => (
                <UITextButton
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
