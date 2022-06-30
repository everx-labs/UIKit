import React from 'react';
import type { ColumnStatus } from '../types';

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
