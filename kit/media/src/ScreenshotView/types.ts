import type { QRCodeRef } from '../UIQRCodeView/types';

// The following type is taken from @types/react@^17.0.0 which is not yet supported in UIKit
type ForwardedRef<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;

export type ScreenshotViewProps = {
    ref: ForwardedRef<QRCodeRef>;
    children: React.ReactNode;
};
