import * as React from 'react';

import { TouchableOpacity, StyleSheet } from 'react-native';
import QRCodeScanner, { Event } from 'react-native-qrcode-scanner';

import { UIAssets } from '@tonlabs/uikit.assets';

import { useTheme, ColorVariants } from './Colors';
import { UICardSheet, UICardSheetProps } from './UISheet';
import { UIImage } from './UIImage';
import { UIConstant } from './constants';

type UIQRCodeScannerSheetProps = UICardSheetProps & {
    onRead: (event: Event) => void | Promise<void>;
};

export function UIQRCodeScannerSheet({
    onRead,
    onClose,
    ...rest
}: UIQRCodeScannerSheetProps) {
    const theme = useTheme();
    return (
        <UICardSheet {...rest} onClose={onClose} style={styles.cardContainer}>
            <QRCodeScanner
                onRead={onRead}
                containerStyle={[
                    styles.scannerContainer,
                    {
                        backgroundColor:
                            theme[ColorVariants.BackgroundPrimaryInverted],
                    },
                ]}
            />
            <TouchableOpacity
                onPress={onClose}
                hitSlop={{
                    top: UIConstant.contentOffset,
                    left: UIConstant.contentOffset,
                    right: UIConstant.contentOffset,
                    bottom: UIConstant.contentOffset,
                }}
                style={[
                    styles.closeButton,
                    {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                ]}
            >
                <UIImage
                    source={UIAssets.icons.ui.closeDarkThemeSecondary}
                    style={styles.closeIcon}
                    tintColor={theme[ColorVariants.LineNeutral]}
                />
            </TouchableOpacity>
        </UICardSheet>
    );
}

const SCANNER_HEIGHT = 320;

const styles = StyleSheet.create({
    cardContainer: {
        height: SCANNER_HEIGHT,
        position: 'relative',
    },
    scannerContainer: {
        borderRadius: UIConstant.alertBorderRadius,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: UIConstant.contentOffset,
        left: UIConstant.contentOffset,
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: UIConstant.alertBorderRadius,
    },
    closeIcon: {
        width: 16,
        height: 16,
    },
});
