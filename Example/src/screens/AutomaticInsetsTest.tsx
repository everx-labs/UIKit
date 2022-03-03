import * as React from 'react';
import { View } from 'react-native';

import { ScrollView } from '@tonlabs/uikit.scrolls';
import { UIMaterialTextView } from '@tonlabs/uikit.inputs';

export function AutomaticInsetsTest() {
    return (
        <ScrollView automaticallyAdjustContentInsets automaticallyAdjustKeyboardInsets>
            <View style={{ backgroundColor: 'rgba(0, 255, 0, .3)', height: 20 }} />
            <UIMaterialTextView label="Test" />
            <View style={{ backgroundColor: 'rgba(255, 0, 0, .3)', height: 2000 }} />
            <View style={{ backgroundColor: 'rgba(0, 0, 255, .3)', height: 20 }} />
        </ScrollView>
    );
}
