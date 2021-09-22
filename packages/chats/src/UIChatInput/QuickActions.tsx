import * as React from 'react';
import { View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIStyle } from '@tonlabs/uikit.core';
import { UIImage } from '@tonlabs/uikit.hydrogen';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

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
                <UIImage source={UIAssets.icons.ui.buttonMsgSend} style={commonStyles.icon} />
            </TouchableOpacity>
        );
    }

    if (!quickActions) {
        return null;
    }

    // TODO: change TouchableOpacity & its content to some component,
    //  that will allow to set icon size 32 (for currency signs)
    return (
        <View style={UIStyle.flex.row()}>
            {quickActions.map(action => (
                <TouchableOpacity
                    key={`quickAction~${action.key}`}
                    testID={action.testID}
                    onPress={action.onPress}
                    style={[commonStyles.buttonContainer, UIStyle.flex.row()]}
                >
                    {action.icon != null && (
                        <UIImage source={action.icon} style={commonStyles.actionIcon} />
                    )}
                    {action.title != null && (
                        <UILabel
                            color={UILabelColors.TextAccent}
                            role={UILabelRoles.Action}
                            style={action.icon ? UIStyle.margin.leftSmall() : null}
                        >
                            {action.title}
                        </UILabel>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}
