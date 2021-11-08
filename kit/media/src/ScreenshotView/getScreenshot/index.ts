import type * as React from 'react';
import type { View } from 'react-native';
import type ViewShot from 'react-native-view-shot';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { getScreenshot as getScreenshotImpl } from './getScreenshot';

export const getScreenshot: (
    ref: React.MutableRefObject<ViewShot | View | null>,
) => Promise<string | null> = getScreenshotImpl;
