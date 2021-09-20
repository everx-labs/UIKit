import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCodeScannerNative from 'react-native-qrcode-scanner';
import type { BarCodeReadEvent } from 'react-native-camera';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIConstant } from '../constants';

export type OnReadEvent = BarCodeReadEvent;

export function QRCodeScanner(props: React.ComponentProps<typeof QRCodeScannerNative>) {
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
