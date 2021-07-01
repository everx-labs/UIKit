import type * as React from 'react';
import type ViewShot from 'react-native-view-shot';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { getScreenshot as getScreenshotImpl } from './getScreenshot';

/** Used only with `ViewShot` from `react-native-view-shot` */
export const getScreenshot: (
    screenId: string,
    ref: React.MutableRefObject<ViewShot | null>,
) => Promise<string> = getScreenshotImpl;
