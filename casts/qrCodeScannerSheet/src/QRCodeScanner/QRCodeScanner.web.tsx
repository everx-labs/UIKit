import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import QRCodeScannerWeb from 'react-qr-reader';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';

import { UILayoutConstant } from '@tonlabs/uikit.layout';

export type OnReadEvent = {
    data: any;
};

export type QRCodeScannerProps = {
    onRead: (event: OnReadEvent) => void | Promise<void>;
    containerStyle: StyleProp<ViewStyle>;
    reactivate?: boolean;
    reactivateTimeout?: number;
};

// eslint-disable-next-line no-shadow
enum QR_CODE_ERROR {
    NONE = 0,
    PERMISSION = 1,
    UNRECOGNIZED = 2,
}

export function QRCodeScanner(props: QRCodeScannerProps) {
    const [qrCodeError, setQrCodeError] = React.useState(QR_CODE_ERROR.NONE);

    if (qrCodeError === QR_CODE_ERROR.NONE) {
        return (
            <View style={props.containerStyle}>
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
                    resolution={UILayoutConstant.elasticWidthCardSheet}
                    delay={props.reactivate ? props.reactivateTimeout || 500 : false}
                />
            </View>
        );
    }
    if (qrCodeError === QR_CODE_ERROR.PERMISSION) {
        return (
            <View style={[styles.errorContainer, props.containerStyle]}>
                <UILabel
                    role={UILabelRoles.TitleMedium}
                    color={UILabelColors.TextInverted}
                    style={styles.errorText}
                >
                    {uiLocalized.QRCodeScanner.ErrorPermissions}
                </UILabel>
            </View>
        );
    }
    if (qrCodeError === QR_CODE_ERROR.UNRECOGNIZED) {
        return (
            <View style={[styles.errorContainer, props.containerStyle]}>
                <UILabel
                    role={UILabelRoles.TitleMedium}
                    color={UILabelColors.TextInverted}
                    style={styles.errorText}
                >
                    {uiLocalized.QRCodeScanner.ErrorUnexpected}
                </UILabel>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: UILayoutConstant.contentOffset,
    },
    errorText: {
        textAlign: 'center',
    },
});
