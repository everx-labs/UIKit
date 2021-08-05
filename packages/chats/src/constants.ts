import { Platform } from 'react-native';

export const UIConstant = {
    mediaImagePartOfScreen: Platform.select<number>({
        web: 3 / 12,
        default: 3 / 4,
    }),
    mediaImageMaxSizesAspectRatio: 9 / 16,
};
