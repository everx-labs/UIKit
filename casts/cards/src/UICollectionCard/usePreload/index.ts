// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { usePreload as platformUsePreload } from './usePreload';
import type { MediaCardContent } from '../../types';

export type { PreviewProps } from '../types';
export const usePreload: (content: MediaCardContent[]) => void = platformUsePreload;
