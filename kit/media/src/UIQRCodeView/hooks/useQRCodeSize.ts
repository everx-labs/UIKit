import React from 'react';
import { UIQRCodeConstant } from '../constants';
import { QRCodeSize } from '../types';

export const useQRCodeSize = (size: QRCodeSize | undefined): number => {
    return React.useMemo(() => {
        switch (size) {
            case QRCodeSize.Medium:
                return UIQRCodeConstant.mediumSize;
            case QRCodeSize.Large:
            default:
                return UIQRCodeConstant.largeSize;
        }
    }, [size]);
};
