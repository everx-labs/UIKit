import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PartStatus } from './types';

export default function getColorByPartStatus({ disabled, negative }: PartStatus): ColorVariants {
    if (disabled) {
        return ColorVariants.TextTertiary;
    }
    if (negative) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextPrimary;
}
