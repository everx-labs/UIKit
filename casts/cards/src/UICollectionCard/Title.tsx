import * as React from 'react';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';

import type { TitleProps } from './types';

export function Title({ title }: TitleProps) {
    if (!title) {
        return null;
    }
    return (
        <UILabel role={TypographyVariants.Action} color={ColorVariants.StaticBackgroundWhite}>
            {title}
        </UILabel>
    );
}
