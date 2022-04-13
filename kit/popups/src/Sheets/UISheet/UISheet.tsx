import * as React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform, Keyboard } from 'react-native';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useBackHandler } from '@react-native-community/hooks';

import { Portal } from '@tonlabs/uikit.layout';
import { ColorVariants, useColorParts, UIStatusBar } from '@tonlabs/uikit.themes';
import { ScrollableContext } from '@tonlabs/uikit.scrolls';
import type { OnOpen, OnClose } from './types';
import { SheetProgressContext, SheetReadyContext, usePosition } from './usePosition';
import { KeyboardAwareSheet, KeyboardUnawareSheet } from './KeyboardAwareSheet';
import { useSheetOrigin } from './SheetOriginContext';
import { FixedSizeSheet, IntrinsicSizeSheet, useSheetSize } from './SheetSize';

type UISheetStatusBarTriggerColor = 'primary' | 'overlay' | ColorVariants | null;

export type UISheetProps = {
    /**
     * UISheet is controlled component,
     * use this props to control it's visibility
     */
    visible: boolean;
    /**
     * Callback that fires when there is a request to close UISheet
     */
    onClose?: OnClose;
    /**
     * Callback that fires when open animation is finished
     */
    onOpenEnd?: OnOpen;
    /**
     * Callback that fires when close animation is finished
     */
    onCloseEnd?: OnClose;
    /**
     * Content of a sheet
     * UISheet is abstract component, that basically can show
     * any content from the bottom of the screen
     */
    children: React.ReactNode;
    /**
     * Styles for sheet
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Styles for container around sheet
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Whether UISheet has open animation or not
     */
    hasOpenAnimation?: boolean;
    /**
     * Whether UISheet has close animation or not
     */
    hasCloseAnimation?: boolean;
    /**
     * A color for what status bar color will be calculated
     * (it will enforce a color that is contrast)
     *
     * By default - overlay, the color that is used for overlay
     */
    statusBarTriggerColor?: UISheetStatusBarTriggerColor;
    /**
     * Sheet uses <Portal /> to put itself on top of
     * current components, like a layer.
     * Use the ID if you want to change destination where
     * Sheet should be put (i.e. you have another <PortalManager />)
     */
    forId?: string;
};

const SheetClosePortalRequestContext = React.createContext(() => {
    /* no-op */
});

function useSheetClosePortalRequest() {
    const onClose = React.useContext(SheetClosePortalRequestContext);

    if (onClose == null) {
        throw new Error('Have you forgot to wrap <UISheet.Content /> with <UISheet.Container /> ?');
    }

    return onClose;
}

function useStatusBarColor(
    statusBarTriggerColor: UISheetStatusBarTriggerColor,
): ColorVariants | null {
    return React.useMemo(() => {
        if (statusBarTriggerColor === 'overlay') {
            return ColorVariants.BackgroundOverlay;
        }
        if (statusBarTriggerColor === 'primary') {
            return ColorVariants.BackgroundPrimary;
        }
        return statusBarTriggerColor;
    }, [statusBarTriggerColor]);
}

function SheetContent({
    visible,
    onClose,
    onOpenEnd,
    onCloseEnd,
    children,
    containerStyle,
    style,
    hasOpenAnimation,
    hasCloseAnimation,
    statusBarTriggerColor = 'overlay',
}: UISheetProps) {
    const onClosePortalRequest = useSheetClosePortalRequest();
    const origin = useSheetOrigin();
    const { height, onSheetLayout, style: cardSizeStyle } = useSheetSize();

    const {
        animate,
        onTapGestureHandler,
        onPanGestureHandler,
        scrollRef,
        scrollHandler,
        scrollGestureHandler,
        hasScroll,
        setHasScroll,
        position,
        positionProgress,
        ready,
    } = usePosition(
        height,
        origin,
        hasOpenAnimation,
        hasCloseAnimation,
        onClose,
        onClosePortalRequest,
        onOpenEnd,
        onCloseEnd,
    );

    React.useEffect(() => {
        if (!visible) {
            animate(false);
            return undefined;
        }

        if (!hasOpenAnimation) {
            animate(true);
            return undefined;
        }

        /**
         * There was a fix in reanimated
         * https://github.com/software-mansion/react-native-reanimated/pull/2580
         *
         * Basically it does a good thing,
         * it doesn't apply style updates until a view isn't mounted.
         * But I noticed with a debugger, that `uiManagerWillPerformMounting` of `REAModule`
         * is somehow non-determenistic, it can run with a big delay
         * (probably due to our code too :shrug:)
         *
         * To avoid falling in this logic, here we wait until layout is done
         * (it's based on a fact that `height.value` is set on `onLayout`)
         * and start animation only after that.
         *
         * Breadcrumbs:
         * With this bug an opening of a sheet is laggy,
         * sometimes overlay isn't set or set with a big delay,
         * sometimes it just stuck on closed state and un-freezes
         * only when you touch sth
         *
         * This should be removed once a bug in reanimated is resolved!
         */
        let recursionRafId: number | undefined;
        (function animateWhenHeightIsSet() {
            if (height.value === 0) {
                recursionRafId = requestAnimationFrame(animateWhenHeightIsSet);
                return;
            }
            requestAnimationFrame(() => animate(true));
        })();

        return () => {
            if (recursionRafId != null) {
                // Clean raf from animateWhenHeightIsSet,
                // to avoid possible infinite recursion
                cancelAnimationFrame(recursionRafId);
            }
        };
    }, [visible, animate, height, hasOpenAnimation]);

    useBackHandler(() => {
        if (onClose) {
            onClose();
            return true;
        }

        return false;
    });

    const { colorParts: overlayColorParts, opacity: overlayOpacity } = useColorParts(
        ColorVariants.BackgroundOverlay,
    );

    const overlayStyle = useAnimatedStyle(() => {
        return {
            // There was theoretically better for perf solution
            // with opacity, but on web it worked really bad
            // as it seems animated value need some time
            // to initialize before it's applied
            // and before it happen it shown provided background color
            // with default opacity (that is 1)
            backgroundColor: interpolateColor(
                position.value,
                [0, -height.value],
                [`rgba(${overlayColorParts}, 0)`, `rgba(${overlayColorParts}, ${overlayOpacity})`],
            ),
        };
    }, [overlayColorParts, overlayOpacity, height, position]);

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: position.value,
                },
            ],
        };
    }, [position]);

    const scrollPanGestureHandlerRef = React.useRef<PanGestureHandler>(null);

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: scrollRef,
            panGestureHandlerRef: scrollPanGestureHandlerRef,
            scrollHandler: Platform.OS === 'web' || onClose == null ? undefined : scrollHandler,
            gestureHandler: onClose == null ? undefined : scrollGestureHandler,
            onWheel: null,
            hasScroll,
            setHasScroll,
            registerScrollable: null,
            unregisterScrollable: null,
        }),
        [
            scrollRef,
            scrollPanGestureHandlerRef,
            scrollHandler,
            scrollGestureHandler,
            hasScroll,
            setHasScroll,
            onClose,
        ],
    );

    const statusBarColor = useStatusBarColor(statusBarTriggerColor);

    return (
        <>
            <View style={styles.container}>
                <TapGestureHandler enabled={onClose != null} onGestureEvent={onTapGestureHandler}>
                    {/* https://github.com/software-mansion/react-native-gesture-handler/issues/71 */}
                    <Animated.View style={styles.interlayer}>
                        <PanGestureHandler
                            maxPointers={1}
                            enabled={onClose != null}
                            onGestureEvent={onPanGestureHandler}
                        >
                            <Animated.View style={[styles.interlayer, overlayStyle]} />
                        </PanGestureHandler>
                    </Animated.View>
                </TapGestureHandler>
                <Animated.View
                    style={[styles.sheet, cardStyle, containerStyle]}
                    pointerEvents="box-none"
                >
                    <PanGestureHandler
                        maxPointers={1}
                        enabled={onClose != null}
                        onGestureEvent={onPanGestureHandler}
                        {...(Platform.OS === 'android' && hasScroll
                            ? { waitFor: scrollPanGestureHandlerRef }
                            : null)}
                    >
                        <Animated.View onLayout={onSheetLayout} style={[style, cardSizeStyle]}>
                            <ScrollableContext.Provider value={scrollableContextValue}>
                                <SheetReadyContext.Provider value={ready}>
                                    <SheetProgressContext.Provider value={positionProgress}>
                                        {children}
                                    </SheetProgressContext.Provider>
                                </SheetReadyContext.Provider>
                            </ScrollableContext.Provider>
                        </Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </View>
            {statusBarColor != null && <UIStatusBar backgroundColor={statusBarColor} />}
        </>
    );
}

function SheetContainer(
    props: Pick<UISheetProps, 'visible' | 'forId'> & { children: React.ReactNode },
) {
    const { visible, forId, children } = props;
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (!visible) {
            return;
        }

        setIsVisible(true);
        // TODO: this hack should be removed
        // instead better to check keyboard height on mount
        Keyboard.dismiss();
    }, [visible, setIsVisible]);

    const onClosePortalRequest = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal absoluteFill forId={forId}>
            <SheetClosePortalRequestContext.Provider value={onClosePortalRequest}>
                {children}
            </SheetClosePortalRequestContext.Provider>
        </Portal>
    );
}

export const UISheet = {
    Container: SheetContainer,
    Content: SheetContent,
    KeyboardAware: KeyboardAwareSheet,
    KeyboardUnaware: KeyboardUnawareSheet,
    IntrinsicSize: IntrinsicSizeSheet,
    FixedSize: FixedSizeSheet,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    interlayer: {
        flex: 1,
    },
    sheet: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
    },
});
