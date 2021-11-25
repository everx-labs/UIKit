import * as React from 'react';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';

import type { TitleProps } from './types';

export const Title: React.FC<TitleProps> = ({ title }: TitleProps) => {
    if (!title) {
        return null;
    }
    return (
        <UILabel role={TypographyVariants.MonoNote} color={ColorVariants.StaticBackgroundWhite}>
            {title}
        </UILabel>
    );
};
