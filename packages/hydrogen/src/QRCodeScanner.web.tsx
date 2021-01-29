import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import QRCodeScannerWeb from 'react-qr-reader';

import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIConstant } from './constants';
import { UILabel, UILabelColors, UILabelRoles } from './UILabel';

export type OnReadEvent = {
    data: any;
};

export type QRCodeScannerProps = {
    onRead: (event: OnReadEvent) => void | Promise<void>;
    containerStyle: StyleProp<ViewStyle>;
};

// eslint-disable-next-line no-shadow
enum QR_CODE_ERROR {
    NONE = 0,
    PERMISSION = 1,
    UNRECOGNIZED = 2,
}

export function QRCodeScanner(props: QRCodeScannerProps) {
    const [qrCodeError, setQrCodeError] = React.useState(QR_CODE_ERROR.NONE);

    let content = null;

    if (qrCodeError === QR_CODE_ERROR.NONE) {
        content = (
            <QRCodeScannerWeb
                onScan={(data: any) => {
                    if (data == null) {
                        return;
                    }
                    props.onRead({ data });
                }}
                onError={(err: DOMException) => {
                    if (/Permission denied/.test(err.message)) {
                        setQrCodeError(QR_CODE_ERROR.PERMISSION);
                        return;
                    }
                    setQrCodeError(QR_CODE_ERROR.UNRECOGNIZED);
                }}
                showViewFinder={false}
            />
        );
    } else if (qrCodeError === QR_CODE_ERROR.PERMISSION) {
        content = (
            <UILabel
                role={UILabelRoles.TitleMedium}
                color={UILabelColors.TextPrimaryInverted}
                style={styles.errorText}
            >
                {uiLocalized.QRCodeScanner.ErrorPermissions}
            </UILabel>
        );
    } else if (qrCodeError === QR_CODE_ERROR.UNRECOGNIZED) {
        content = (
            <UILabel
                role={UILabelRoles.TitleMedium}
                color={UILabelColors.TextPrimaryInverted}
                style={styles.errorText}
            >
                {uiLocalized.QRCodeScanner.ErrorUnexpected}
            </UILabel>
        );
    }

    return (
        <View style={[styles.container, props.containerStyle]}>{content}</View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: UIConstant.contentOffset,
    },
    errorText: {
        textAlign: 'center',
    },
});
