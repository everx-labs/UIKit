import * as React from 'react';
import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PartStatus } from './types';

export function useColorByPartStatus({ disabled, negative }: PartStatus): ColorVariants {
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

export function useMergedPartStatus(
    partStatus: PartStatus,
    disabled: boolean | undefined,
    negative: boolean | undefined,
    onPress: (() => void) | undefined,
): PartStatus {
    return React.useMemo(() => {
        if (partStatus.partState === 'Pressable') {
            return partStatus;
        }
        return { ...partStatus, disabled, negative, onPress };
    }, [disabled, negative, partStatus, onPress]);
}
