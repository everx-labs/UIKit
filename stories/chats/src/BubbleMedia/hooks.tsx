import * as React from 'react';
import { useWindowDimensions } from 'react-native';

import { UIConstant } from '../constants';
import type { ImageSize } from './types';

export const useMaxImageSize = (): ImageSize => {
    const windowWidth = useWindowDimensions().width;
    return React.useMemo(() => {
        return {
            width: windowWidth * UIConstant.mediaImagePartOfScreen,
            height:
                (windowWidth * UIConstant.mediaImagePartOfScreen) /
                UIConstant.mediaImageMaxSizesAspectRatio,
        };
    }, [windowWidth]);
};
