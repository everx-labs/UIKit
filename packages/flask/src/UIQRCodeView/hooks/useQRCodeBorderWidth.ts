import React from 'react';
import { UIConstant } from '../../constants';
import { QRCodeSize } from '../../types';

export const useQRCodeBorderWidth = (size: QRCodeSize | undefined): number => {
    return React.useMemo(() => {
        switch (size) {
            case QRCodeSize.Medium:
                return UIConstant.qrCode.mediumBorderWidth;
            case QRCodeSize.Large:
            default:
                return UIConstant.qrCode.largeBorderWidth;
        }
    }, [size]);
};
