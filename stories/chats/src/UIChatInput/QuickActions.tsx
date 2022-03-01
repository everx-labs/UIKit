import * as React from 'react';
import { View } from 'react-native';

import { ColorVariants, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';
import { UIStyle } from '@tonlabs/uikit.core';

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
                        <UIImage
                            resizeMode="center"
                            source={action.icon}
                            style={commonStyles.icon}
                            tintColor={ColorVariants.IconAccent}
                        />
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
