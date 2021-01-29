import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCodeScannerNative from 'react-native-qrcode-scanner';
import type { Event } from 'react-native-qrcode-scanner';

import { uiLocalized } from '@tonlabs/uikit.localization';

import { UILabel, UILabelColors, UILabelRoles } from './UILabel';
import { UIConstant } from './constants';

export type OnReadEvent = Event;

export function QRCodeScanner(
    props: React.ComponentProps<typeof QRCodeScannerNative>,
) {
    return (
        <QRCodeScannerNative
            {...props}
            notAuthorizedView={
                <View style={styles.errorContainer}>
                    <UILabel
                        role={UILabelRoles.TitleMedium}
                        color={UILabelColors.TextPrimaryInverted}
                        style={styles.errorText}
                    >
                        {uiLocalized.QRCodeScanner.ErrorPermissions}
                    </UILabel>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        padding: UIConstant.contentOffset,
    },
    errorText: {
        textAlign: 'center',
    },
});
