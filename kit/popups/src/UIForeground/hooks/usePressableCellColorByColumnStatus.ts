import React from 'react';
import { ColorVariants } from '@tonlabs/uikit.themes';
import type { ColumnStatus } from '../types';

export function usePressableCellColorByColumnStatus({
    disabled,
    negative,
}: ColumnStatus): ColorVariants {
    return React.useMemo(() => {
        if (disabled) {
            return ColorVariants.TextTertiary;
        }
        if (negative) {
            return ColorVariants.TextNegative;
        }
        return ColorVariants.TextPrimary;
    }, [disabled, negative]);
}
