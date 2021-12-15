import * as React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export type AccordionOverlayViewRef = {
    show(startY: number, endY: number): Promise<void>;
    append(startY: number, endY: number): Promise<void>;
    moveAndHide(shiftY: number, duration?: number): void;
};
type AccordionOverlayViewProps = React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

type CommandFinishedEvent = { nativeEvent: { finishedCommand: keyof AccordionOverlayViewRef } };

export const AccordionOverlayView = React.forwardRef<
    AccordionOverlayViewRef,
    AccordionOverlayViewProps
>(function AccordionOverlayView({ children, style }: AccordionOverlayViewProps, ref) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const overlayInnerTranslationY = useSharedValue(0);
    const overlayInnerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: overlayInnerTranslationY.value,
                },
            ],
        };
    });

    const hideOverlay = React.useCallback(() => {
        console.log('hide');
        if (overlayRef.current == null) {
            return Promise.reject(new Error('Overlay not ready yet'));
        }
        const overlayInner = overlayRef.current.firstElementChild;
        if (overlayInner == null) {
            return Promise.reject(new Error('Unexpected overlay structure'));
        }

        overlayRef.current.style.removeProperty('top');
        overlayInner.innerHTML = '';
    }, []);

    React.useImperativeHandle(ref, () => ({
        show(startY: number, endY: number) {
            if (wrapperRef.current == null) {
                return Promise.reject(new Error('Overlay not ready yet'));
            }
            if (overlayRef.current == null) {
                return Promise.reject(new Error('Overlay not ready yet'));
            }
            const containerElement = wrapperRef.current.firstElementChild;
            if (containerElement == null) {
                return Promise.reject(new Error('Unexpected ScrollView structure'));
            }
            const contentContainerElement = containerElement.firstElementChild;
            if (contentContainerElement == null) {
                return Promise.reject(new Error('Unexpected ScrollView structure'));
            }
            let y = 0;
            let firstInSnapIndex = 0;
            let firstInSnapElementCorrection = 0;
            let lastInSnapIndex = -1;
            const { children: containerChildren } = contentContainerElement;
            for (let i = 0; i < containerChildren.length; i += 1) {
                const child = containerChildren[i];
                const prevY = y;
                y += child.clientHeight;

                if (prevY < endY) {
                    lastInSnapIndex = i;
                } else {
                    // To not traverse through all children
                    // as after that point they're doesn't matter
                    break;
                }

                if (prevY <= startY && y > startY) {
                    firstInSnapIndex = i;
                    firstInSnapElementCorrection = prevY - startY;
                    continue;
                }
            }

            const overlayInner = overlayRef.current.firstElementChild;

            if (overlayInner == null) {
                return Promise.reject(new Error('Unexpected overlay structure'));
            }

            for (let i = firstInSnapIndex; i <= lastInSnapIndex; i += 1) {
                const copiedNode = containerChildren[i].cloneNode(true);
                overlayInner.append(copiedNode);
            }

            const { paddingLeft, paddingRight } = getComputedStyle(contentContainerElement);
            overlayInner.style.top = `${firstInSnapElementCorrection}px`;
            overlayInner.style.paddingLeft = paddingLeft;
            overlayInner.style.paddingRight = paddingRight;
            // TODO
            overlayInner.style.backgroundColor = `white`;

            // Reset trnalsation if any
            overlayInnerTranslationY.value = 0;

            const { scrollTop } = containerElement;

            overlayRef.current.style.top = `${startY - scrollTop}px`;

            return Promise.resolve();
        },
        append(startY: number, endY: number) {
            if (wrapperRef.current == null) {
                return Promise.resolve();
            }
            return Promise.resolve();
            return new Promise(resolve => {
                // UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'append', [
                //     startY,
                //     endY,
                // ]);
                // resolversRef.current.resolveAppend = resolve;
            });
        },
        moveAndHide(shiftY: number, duration: number = 100) {
            overlayInnerTranslationY.value = withTiming(shiftY, { duration }, hideOverlay);
            if (wrapperRef.current == null) {
            }
            // UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), 'moveAndHide', [
            //     shiftY,
            //     duration,
            // ]);
        },
    }));

    return (
        <View ref={wrapperRef} style={[style, { position: 'relative' }]}>
            {children}
            <View
                ref={overlayRef}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
            >
                <Animated.View
                    style={[{ position: 'absolute', left: 0, right: 0 }, overlayInnerStyle]}
                />
            </View>
        </View>
    );
});
