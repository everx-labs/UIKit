import * as Portal from './Portal';
import { UIDeviceInfo } from './UIDeviceInfo';
import { UILayoutConstant } from './UILayoutConstant';
import { UISkeleton } from './Skeleton';
import { AnimationHelpers } from './AnimationHelpers';
import { useDimensions } from './useDimensions';

export * from './Portal';
export * from './UIDeviceInfo';
export * from './UILayoutConstant';
export * from './Skeleton';
export * from './AnimationHelpers';
export * from './useDimensions';

export const UILayout = {
    Portal,
    UISkeleton,

    UIDeviceInfo,
    UILayoutConstant,
    AnimationHelpers,
    useDimensions,
};
export default UILayout;
