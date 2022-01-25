import * as React from 'react';
import { ColorVariants } from '@tonlabs/uikit.themes';
import type { ColumnStatus } from './types';

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

export function useTextColorByColumnStatus({ columnType }: ColumnStatus): ColorVariants {
    return React.useMemo(() => {
        if (columnType === 'Primary') {
            return ColorVariants.TextSecondary;
        }
        return ColorVariants.TextTertiary;
    }, [columnType]);
}

export function useMergedColumnStatus(
    columnStatus: ColumnStatus,
    disabled: boolean | undefined,
    negative: boolean | undefined,
): ColumnStatus {
    return React.useMemo(() => {
        if (columnStatus.columnState === 'Pressable') {
            return {
                ...columnStatus,
                negative: negative !== undefined ? negative : columnStatus.negative,
            };
        }
        return { ...columnStatus, disabled, negative };
    }, [disabled, negative, columnStatus]);
}
