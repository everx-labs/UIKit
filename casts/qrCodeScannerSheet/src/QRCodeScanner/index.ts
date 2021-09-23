import type React from 'react';
import type QRCodeScannerNative from 'react-native-qrcode-scanner';
import {
    QRCodeScanner as QRCodeScannerPlatform,
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved, import/extensions
} from './QRCodeScanner';

export const QRCodeScanner: React.FC<React.ComponentProps<typeof QRCodeScannerNative>> =
    QRCodeScannerPlatform;
export type OnReadEvent = {
    data: any;
};
