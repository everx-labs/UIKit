import React from 'react';
import { UIQRCodeConstant } from '../constants';
import { QRCodeSize } from '../types';

export const useQRCodeLogoSize = (size: QRCodeSize | undefined): number => {
    return React.useMemo(() => {
        switch (size) {
            case QRCodeSize.Medium:
                return UIQRCodeConstant.mediumLogoSize;
            case QRCodeSize.Large:
            default:
                return UIQRCodeConstant.largeLogoSize;
        }
    }, [size]);
};
