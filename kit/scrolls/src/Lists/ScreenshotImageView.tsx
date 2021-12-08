import * as React from 'react';
import { UIManager, findNodeHandle, requireNativeComponent } from 'react-native';

const NativeScreenshotImageView = requireNativeComponent('UIKitScreenshotImageView');

type ScreenshotImageViewProps = React.PropsWithRef<React.PropsWithChildren<Record<string, never>>>;
export type ScreenshotImageViewRef = {
    show(startY: number, endY: number): void;
    hide(): void;
};

export const ScreenshotImageView = React.forwardRef<
    ScreenshotImageViewRef,
    ScreenshotImageViewProps
>(function ScreenshotImageView({ children }: ScreenshotImageViewProps, ref) {
    const nativeRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        show(startY: number, endY: number) {
            if (nativeRef.current == null) {
                return;
            }
            UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'show', [
                startY,
                endY,
            ]);
        },
        hide() {
            if (nativeRef.current == null) {
                return;
            }
            UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'hide');
        },
    }));

    return <NativeScreenshotImageView ref={nativeRef}>{children}</NativeScreenshotImageView>;
});
