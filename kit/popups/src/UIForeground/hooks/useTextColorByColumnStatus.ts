import React from 'react';
import { ColorVariants } from '@tonlabs/uikit.themes';
import type { ColumnStatus } from '../types';

export function useTextColorByColumnStatus({ columnType }: ColumnStatus): ColorVariants {
    return React.useMemo(() => {
        if (columnType === 'Primary') {
            return ColorVariants.TextSecondary;
        }
        return ColorVariants.TextTertiary;
    }, [columnType]);
}
