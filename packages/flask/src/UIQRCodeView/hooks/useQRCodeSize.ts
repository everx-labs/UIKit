import React from 'react';
import { UIConstant } from '../../constants';
import { QRCodeSize } from '../../types';

export const useQRCodeSize = (size: QRCodeSize | undefined): number => {
    return React.useMemo(() => {
        switch (size) {
            case QRCodeSize.Medium:
                return UIConstant.qrCode.mediumSize;
            case QRCodeSize.Large:
            default:
                return UIConstant.qrCode.largeSize;
        }
    }, [size]);
};
