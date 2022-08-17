import * as React from 'react';
import {
    UIManager,
    findNodeHandle,
    requireNativeComponent,
    StyleProp,
    ViewStyle,
} from 'react-native';

const NativeAccordionOverlayView = requireNativeComponent('UIKitAccordionOverlayView');

export type AccordionOverlayViewRef = {
    show(startY: number, endY: number): Promise<void>;
    append(startY: number, endY: number): Promise<void>;
    moveAndHide(shiftY: number, duration?: number): Promise<void>;
};
type AccordionOverlayViewProps = React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

type CommandFinishedEvent = { nativeEvent: { finishedCommand: keyof AccordionOverlayViewRef } };

export const AccordionOverlayView = React.forwardRef<
    AccordionOverlayViewRef,
    AccordionOverlayViewProps
>(function AccordionOverlayView({ children, style }: AccordionOverlayViewProps, ref) {
    const nativeRef = React.useRef(null);
    const resolversRef = React.useRef<{
        resolveShow?: (value: void | PromiseLike<void>) => void;
        resolveAppend?: (value: void | PromiseLike<void>) => void;
        resolveMoveAndHide?: (value: void | PromiseLike<void>) => void;
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
                UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'append', [
                    startY,
                    endY,
                ]);
                resolversRef.current.resolveAppend = resolve;
            });
        },
        moveAndHide(shiftY: number, duration: number = 100) {
            if (nativeRef.current == null) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                UIManager.dispatchViewManagerCommand(
                    findNodeHandle(nativeRef.current),
                    'moveAndHide',
                    [shiftY, duration],
                );
                resolversRef.current.resolveMoveAndHide = resolve;
            });
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
            if (finishedCommand === 'moveAndHide') {
                if (resolversRef.current.resolveMoveAndHide != null) {
                    resolversRef.current.resolveMoveAndHide();
                }
            }
        },
        [],
    );

    return (
        // @ts-ignore
        <NativeAccordionOverlayView
            ref={nativeRef}
            // @ts-ignore
            style={style}
            onCommandFinished={onCommandFinished}
        >
            {children}
        </NativeAccordionOverlayView>
    );
});
