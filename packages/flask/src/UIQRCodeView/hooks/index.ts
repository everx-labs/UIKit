import type * as React from 'react';
import type ViewShot from 'react-native-view-shot';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { useScreenshotRef as useScreenshotRefImpl } from './useScreenshotRef';

/** Used only with `ViewShot` from `react-native-view-shot` */
export const useScreenshotRef: (
    value: string,
    getPng?: (base64: string) => void, // returns base64
) => React.MutableRefObject<ViewShot | null> = useScreenshotRefImpl;
