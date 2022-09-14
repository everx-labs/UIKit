import * as React from 'react';
import { View } from 'react-native';
import BigNumber from 'bignumber.js';

import { UIBoxButton } from '@tonlabs/uikit.controls';
import { UISendSheet, useUISendSheet } from '@tonlabs/uistory.ever-links';

export function EverLinksScreen() {
    const { sendSheetVisible, openSendSheet, closeSendSheet } = useUISendSheet();

    return (
        <>
            <View
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 16,
                    width: 250,
                }}
            >
                <UIBoxButton
                    testID="show_UISendSheet"
                    title="Show UISendSheet"
                    onPress={() => openSendSheet()}
                />
            </View>
            <UISendSheet
                visible={sendSheetVisible}
                onClose={closeSendSheet}
                params={{
                    address: '0:72f2197ebfcce77e16737996758219c7fa71807ef05d5e93e9e5acb9b07a8c0a',
                    amount: new BigNumber(10),
                    fee: new BigNumber(0.1),
                    onConfirm: () => {
                        closeSendSheet();
                    },
                    signChar: 'EVER',
                }}
            />
        </>
    );
}
