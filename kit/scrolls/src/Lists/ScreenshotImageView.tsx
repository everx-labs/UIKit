import * as React from 'react';
import { UIManager, findNodeHandle, requireNativeComponent } from 'react-native';

const NativeScreenshotImageView = requireNativeComponent('UIKitScreenshotImageView');

type ScreenshotImageViewProps = React.PropsWithRef<React.PropsWithChildren<Record<string, never>>>;
export type ScreenshotImageViewRef = {
    show(startY: number, endY: number): void;
    moveAndHide(shiftY: number): void;
};

export const ScreenshotImageView = React.forwardRef<
    ScreenshotImageViewRef,
    ScreenshotImageViewProps
>(function ScreenshotImageView({ children, style }: ScreenshotImageViewProps, ref) {
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
        moveAndHide(shiftY: number, duration?: number) {
            if (nativeRef.current == null) {
                return;
            }
            UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'moveAndHide', [
                shiftY,
                duration || 100,
            ]);
        },
    }));

    return (
        <NativeScreenshotImageView ref={nativeRef} style={style}>
            {children}
        </NativeScreenshotImageView>
    );
});
