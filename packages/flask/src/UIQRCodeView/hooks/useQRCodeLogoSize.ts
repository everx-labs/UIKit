import React from 'react';
import { UIConstant } from '../../constants';
import { QRCodeSize } from '../../types';

export const useQRCodeLogoSize = (size: QRCodeSize | undefined): number => {
    return React.useMemo(() => {
        switch (size) {
            case QRCodeSize.Medium:
                return UIConstant.qrCode.mediumLogoSize;
            case QRCodeSize.Large:
            default:
                return UIConstant.qrCode.largeLogoSize;
        }
    }, [size]);
};
