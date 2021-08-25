import { Platform } from 'react-native';

export const UIConstant = {
    contentOffset: 16,
    mediaImagePartOfScreen: Platform.select<number>({
        web: 3 / 12,
        default: 3 / 4,
    }),
    mediaImageMaxSizesAspectRatio: 9 / 16,
    lightbox: {
        animationDisplayDelay: 50,
        verticalHeaderPadding: 6,
        headerMinHeight: 56,
        hitSlop: {
            top: 16,
            left: 16,
            bottom: 16,
            right: 16,
        },
    },
};
