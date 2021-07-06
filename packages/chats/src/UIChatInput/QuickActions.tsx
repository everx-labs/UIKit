import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIStyle } from '@tonlabs/uikit.core';
import { UIImage, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import type { QuickActionItem } from './types';
import { commonStyles } from './styles';

type Props = {
    quickActions?: QuickActionItem[];
    inputHasValue: boolean;
    onSendText: () => void | Promise<void>;
};

export function QuickAction(props: Props) {
    const { quickActions, inputHasValue, onSendText } = props;

    if (inputHasValue) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={commonStyles.buttonContainer}
                onPress={onSendText}
            >
                <UIImage
                    source={UIAssets.icons.ui.buttonMsgSend}
                    style={commonStyles.icon}
                />
            </TouchableOpacity>
        );
    }

    if (!quickActions) {
        return null;
    }

    return (
        <View style={UIStyle.flex.row()}>
            {quickActions.map((action) => (
                <TouchableOpacity
                    key={`quickAction~${action.key}`}
                    testID={action.testID}
                    onPress={action.onPress}
                    style={[commonStyles.buttonContainer, UIStyle.flex.row()]}
                >
                    {action.icon && <UIImage source={action.icon} />}
                    {action.title &&
                    <UILabel
                        color={UILabelColors.TextAccent}
                        role={UILabelRoles.Action}
                        style={action.icon ? UIStyle.margin.leftSmall() : null}
                    >
                        {action.title}
                    </UILabel>}
                </TouchableOpacity>
            ))}
        </View>
    );
}
