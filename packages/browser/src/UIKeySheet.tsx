import * as React from 'react';
import { View } from 'react-native';

import { UIKeyTextView } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIPullerSheet } from './UIPullerSheet';

export function UIKeySheet({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <View style={{ paddingHorizontal: 16 }}>
                <UIKeyTextView
                    label={uiLocalized.Browser.SigningBox.PrivateKey}
                />
            </View>
        </UIPullerSheet>
    );
}
