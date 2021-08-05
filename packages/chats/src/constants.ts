import { Platform } from 'react-native';

export const UIConstant = {
    mediaImagePartOfScreen:
        Platform.select<number>({
            native: 3 / 4,
            web: 3 / 12,
        }) || 3 / 4,
    mediaImageMaxSizesAspectRatio: 9 / 16,
};
