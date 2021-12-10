import * as React from 'react';
import { UIManager, findNodeHandle, requireNativeComponent } from 'react-native';

const NativeScreenshotImageView = requireNativeComponent('UIKitScreenshotImageView');

type ScreenshotImageViewProps = React.PropsWithRef<React.PropsWithChildren<Record<string, never>>>;
export type ScreenshotImageViewRef = {
    show(startY: number, endY: number): Promise<void>;
    append(startY: number, endY: number): Promise<void>;
    moveAndHide(shiftY: number, duration?: number): void;
};

type CommandFinishedEvent = { nativeEvent: { finishedCommand: keyof ScreenshotImageViewRef } };

export const ScreenshotImageView = React.forwardRef<
    ScreenshotImageViewRef,
    ScreenshotImageViewProps
>(function ScreenshotImageView({ children, style }: ScreenshotImageViewProps, ref) {
    const nativeRef = React.useRef(null);
    const resolversRef = React.useRef<{
        resolveShow?: (value: void | PromiseLike<void>) => void;
        resolveAppend?: (value: void | PromiseLike<void>) => void;
    }>({});

    React.useImperativeHandle(ref, () => ({
        show(startY: number, endY: number) {
            if (nativeRef.current == null) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'show', [
                    startY,
                    endY,
                ]);
                resolversRef.current.resolveShow = resolve;
            });
        },
        append(startY: number, endY: number) {
            if (nativeRef.current == null) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'show', [
                    startY,
                    endY,
                ]);
                resolversRef.current.resolveAppend = resolve;
            });
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

    const onCommandFinished = React.useCallback(
        ({ nativeEvent: { finishedCommand } }: CommandFinishedEvent) => {
            if (finishedCommand === 'show') {
                if (resolversRef.current.resolveShow != null) {
                    resolversRef.current.resolveShow();
                }
            }
            if (finishedCommand === 'append') {
                if (resolversRef.current.resolveAppend != null) {
                    resolversRef.current.resolveAppend();
                }
            }
        },
        [],
    );

    return (
        <NativeScreenshotImageView
            ref={nativeRef}
            style={style}
            onCommandFinished={onCommandFinished}
        >
            {children}
        </NativeScreenshotImageView>
    );
});
