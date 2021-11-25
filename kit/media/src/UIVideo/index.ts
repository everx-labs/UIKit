// @ts-expect-error
// eslint-disable-next-line import/extensions, import/no-unresolved
import { UIVideo as PlatformUIVideo } from './UIVideo';
import type { UIVideoProps } from './types';

export type { UIVideoProps } from './types';
export const UIVideo: React.FC<UIVideoProps> = PlatformUIVideo;
