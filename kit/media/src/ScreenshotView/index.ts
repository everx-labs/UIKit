import type * as React from 'react';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import { ScreenshotView as ScreenshotViewImpl } from './ScreenshotView';
import type { QRCodeRef } from '../UIQRCodeView/types';
import type { ScreenshotViewProps } from './types';

export * from './types';
export type { QRCodeRef };
/**
 * This component takes a screenshot of its content in base64 PNG image
 *
 * Usage:
 * const Component = () => {
 *   const ref = React.useRef<QRCodeRef>(null);
 *
 *   // Get PNG image:
 *   // ref.current?.getPng().then((base64: string | null) => {
 *   //   base64 - target PNG image
 *   //   base64 === null - it wasn't possible to get png
 *   // });
 *
 *   return (
 *     <ScreenshotView ref={ref}>
 *       {renderContent()}
 *     </ScreenshotView>
 *   )
 * }
 */
export const ScreenshotView: React.ForwardRefRenderFunction<QRCodeRef, ScreenshotViewProps> =
    ScreenshotViewImpl;
