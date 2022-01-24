import type * as React from 'react';
import type { ZoomProps } from '../types';
// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { Zoom as ZoomImpl } from './Zoom';

export const Zoom: React.FC<ZoomProps> = ZoomImpl;
