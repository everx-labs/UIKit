import { Platform } from 'react-native';

const GRID_LINE_HEIGHT = 4;

export const UIConstant = {
    mediaImagePartOfScreen: Platform.select<number>({
        web: 3 / 12,
        default: 3 / 4,
    }),
    mediaImageMaxSizesAspectRatio: 9 / 16,
    contentInsetVerticalX2: 2 * GRID_LINE_HEIGHT,
    contentInsetVerticalX3: 3 * GRID_LINE_HEIGHT,
    contentInsetVerticalX4: 4 * GRID_LINE_HEIGHT,

    contentOffset: 16,
};
