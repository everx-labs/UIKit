import type React from 'react';
import type { ScrollViewProps } from 'react-native';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { ScrollView as PlatformScrollView } from './ScrollView';

export const ScrollView: React.ComponentType<
    ScrollViewProps & { children?: React.ReactNode }
> = PlatformScrollView;
