import * as React from 'react';
import { View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel } from '@tonlabs/uikit.components';

import type { SystemMessage } from './types';

export function BubbleSystem(props: SystemMessage) {
    return (
        <View
            style={[
                UIStyle.common.alignJustifyCenter(),
                UIStyle.padding.verticalTiny(),
            ]}
        >
            <UILabel
                role={UILabel.Role.TinyRegular}
                text={props.text}
                style={UIStyle.color.textTertiary()}
                numberOfLines={1}
                ellipsizeMode="middle"
            />
        </View>
    );
}
