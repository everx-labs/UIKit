import * as React from 'react';
import { View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import type { SystemMessage } from './types';

export function BubbleSystem(props: SystemMessage) {
    return (
        <View style={[UIStyle.common.alignJustifyCenter(), UIStyle.padding.verticalTiny()]}>
            <UILabel
                role={UILabelRoles.ActionFootnote}
                color={UILabelColors.TextTertiary}
                numberOfLines={1}
                ellipsizeMode="middle"
            >
                {props.text}
            </UILabel>
        </View>
    );
}
