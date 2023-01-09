import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { SystemMessage } from './types';

export function BubbleSystem({ text }: SystemMessage) {
    return (
        <View style={styles.container}>
            <UILabel
                role={UILabelRoles.ActionFootnote}
                color={UILabelColors.TextTertiary}
                numberOfLines={1}
                ellipsizeMode="middle"
            >
                {text}
            </UILabel>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: UILayoutConstant.contentInsetVerticalX1,
    },
});
