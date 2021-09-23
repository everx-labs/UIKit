import React from 'react';
import { UIQRCodeConstant } from '../constants';
import { QRCodeSize } from '../types';

export const useQRCodeBorderWidth = (size: QRCodeSize | undefined): number => {
    return React.useMemo(() => {
        switch (size) {
            case QRCodeSize.Medium:
                return UIQRCodeConstant.mediumBorderWidth;
            case QRCodeSize.Large:
            default:
                return UIQRCodeConstant.largeBorderWidth;
        }
    }, [size]);
};
