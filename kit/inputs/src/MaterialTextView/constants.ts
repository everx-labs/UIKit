import { ColorVariants } from '@tonlabs/uikit.themes';
import type { BackgroundColors } from './types';

export const UIConstants = {
    amount: {
        decimalAspect: {
            integer: 0,
            currency: 2,
            precision: 9,
        },
    },
};

export const defaultBackgroundColors: BackgroundColors = {
    regular: ColorVariants.BackgroundBW,
    disabled: ColorVariants.BackgroundTertiary,
};
