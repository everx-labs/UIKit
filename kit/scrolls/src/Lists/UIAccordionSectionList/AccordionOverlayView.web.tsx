import * as React from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export type AccordionOverlayViewRef = {
    show(startY: number, endY: number): Promise<void>;
    append(startY: number, endY: number): Promise<void>;
    moveAndHide(shiftY: number, duration?: number): Promise<void>;
};
type AccordionOverlayViewProps = React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

function takeScreenshot(contentContainerElement: Element, startY: number, endY: number) {
    let y = 0;
    let firstInSnapIndex = 0;
    let firstInSnapElementCorrection = 0;
    let lastInSnapIndex = -1;
    const { children: containerChildren } = contentContainerElement;
    for (let i = 0; i < containerChildren.length; i += 1) {
        const child = containerChildren[i];
        const prevY = y;
        y += child.clientHeight;

        if (y > endY) {
            lastInSnapIndex = i;
            // To not traverse through all children
            // as after that point they're doesn't matter
            break;
        }

        if (y > startY) {
            lastInSnapIndex = i;
        }

        if (prevY <= startY && y > startY) {
            firstInSnapIndex = i;
            firstInSnapElementCorrection = prevY - startY;
            continue;
        }
    }

    const croppedHeight = endY - startY;
    let height = firstInSnapElementCorrection;
    const result = [];
    for (let i = firstInSnapIndex; i <= lastInSnapIndex; i += 1) {
        const copiedNode = containerChildren[i].cloneNode(true);
        const nextHeight = height + containerChildren[i].clientHeight;

        if (nextHeight > croppedHeight) {
            (copiedNode as HTMLDivElement).style.height = `${croppedHeight - height}px`;
            (copiedNode as HTMLDivElement).style.overflow = 'hidden';
            height = croppedHeight;
            result.push(copiedNode);
            break;
        }

        height = nextHeight;
        result.push(copiedNode);
    }

    /**
     * If overall height of the snap is less than what was requested
     * need to fill it with an empty div
     */
    if (height < croppedHeight) {
        const filler = document.createElement('div');
        filler.style.height = `${croppedHeight - height}px`;
        result.push(filler);
    }

    return {
        screenshot: result,
        correction: firstInSnapElementCorrection,
    };
}

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

    const prevScrollTop = React.useRef(0);
    const scrollListener = React.useCallback(event => {
        // As we got to this point, then it's exist, only to silence TS
        if (overlayRef.current == null) {
            return;
        }

        const scrollTopDiff = prevScrollTop.current - event.target.scrollTop;
        if (scrollTopDiff === 0) {
            return;
        }

        const newOffset = prevScrollTop.current + scrollTopDiff;
        overlayRef.current.style.top = `${newOffset}px`;
        prevScrollTop.current = newOffset;
    }, []);

    const hideOverlay = React.useCallback(() => {
        // As we got to this point, then it's exist, only to silence TS
        if (overlayRef.current == null) {
            return;
        }
        const overlayInner = overlayRef.current.firstElementChild;
        // As we got to this point, then it's exist, only to silence TS
        if (overlayInner == null) {
            return;
        }

        overlayRef.current.style.removeProperty('top');
        overlayInner.innerHTML = '';

        if (wrapperRef.current == null) {
            return;
        }
        const containerElement = wrapperRef.current.firstElementChild;
        if (containerElement == null) {
            return;
        }

        containerElement.removeEventListener('scroll', scrollListener);
    }, [scrollListener]);

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
            const overlayInner = overlayRef.current.firstElementChild as HTMLDivElement | null;
            if (overlayInner == null) {
                return Promise.reject(new Error('Unexpected overlay structure'));
            }

            // Reset tranlsation if any
            overlayInnerTranslationY.value = 0;
            // Listen to scroll changes
            // in case it's changed during the animation
            // to adjust position of the overlay
            containerElement.addEventListener('scroll', scrollListener);

            const { screenshot, correction } = takeScreenshot(
                contentContainerElement,
                startY,
                endY,
            );

            const { paddingLeft, paddingRight } = getComputedStyle(contentContainerElement);
            overlayInner.style.top = `${correction}px`;
            overlayInner.style.paddingLeft = paddingLeft;
            overlayInner.style.paddingRight = paddingRight;

            const { backgroundColor } = getComputedStyle(wrapperRef.current);
            overlayInner.style.backgroundColor = backgroundColor;

            screenshot.forEach(node => overlayInner.append(node));

            const { scrollTop } = containerElement;

            overlayRef.current.style.top = `${startY - scrollTop}px`;
            prevScrollTop.current = scrollTop;

            return Promise.resolve();
        },
        async append(startY: number, endY: number) {
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
            const overlayInner = overlayRef.current.firstElementChild;
            if (overlayInner == null) {
                return Promise.reject(new Error('Unexpected overlay structure'));
            }

            const { screenshot } = takeScreenshot(contentContainerElement, startY, endY);

            screenshot.forEach(node => overlayInner.append(node));

            return Promise.resolve();
        },
        moveAndHide(shiftY: number, duration: number = 100) {
            return new Promise(resolve => {
                overlayInnerTranslationY.value = withTiming(shiftY, { duration }, () => {
                    hideOverlay();
                    resolve();
                });
            });
        },
    }));

    return (
        <View
            // @ts-ignore can't use View type for ref, as I need HTMLDivElement to take screenshot
            ref={wrapperRef}
            style={[style, styles.container]}
        >
            {children}
            <View
                // @ts-ignore can't use View type for ref, as I need HTMLDivElement to take screenshot
                ref={overlayRef}
                style={styles.overlayContainer}
            >
                <Animated.View style={[styles.overlayInner, overlayInnerStyle]} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { position: 'relative' },
    overlayContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden' },
    overlayInner: { position: 'absolute', left: 0, right: 0 },
});
