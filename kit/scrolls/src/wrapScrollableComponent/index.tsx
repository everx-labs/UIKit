import type React from 'react';
import type { ScrollViewProps } from 'react-native';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { wrapScrollableComponent as platformWrapScrollableComponent } from './wrapScrollableComponent';

export const wrapScrollableComponent: <Props extends ScrollViewProps>(
    component: React.ComponentType<Props>,
    displayName: string,
) => any = platformWrapScrollableComponent;
