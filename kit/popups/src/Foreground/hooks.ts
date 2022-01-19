import * as React from 'react';
import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PartStatus } from './types';

export function useColorByPartStatus({ disabled, negative }: PartStatus) {
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
