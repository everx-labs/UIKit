import type * as React from 'react';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { UILabel as PlatformUILabel } from './UILabel';
import type { Props } from './types';
import { TypographyVariants } from '../Typography';
import { ColorVariants } from '../Colors';

export const UILabel: React.ComponentType<Props> = PlatformUILabel;
export const UILabelRoles = TypographyVariants;
export const UILabelColors = ColorVariants;
