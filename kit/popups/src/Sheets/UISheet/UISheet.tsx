import * as React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform, Keyboard } from 'react-native';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useBackHandler } from '@react-native-community/hooks';

import { Portal } from '@tonlabs/uikit.layout';
import { ColorVariants, useColorParts, useStatusBar } from '@tonlabs/uikit.themes';
import { ScrollableContext } from '@tonlabs/uikit.scrolls';
import type { OnOpen, OnClose } from './types';
import { SheetReadyContext, usePosition } from './usePosition';
import { KeyboardAwareSheet, KeyboardUnawareSheet } from './KeyboardAwareSheet';
import { useSheetOrigin } from './SheetOriginContext';
import { FixedSizeSheet, IntrinsicSizeSheet, useSheetSize } from './SheetSize';

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
     * Styles for container
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Whether UISheet has open animation or not
     */
    hasOpenAnimation?: boolean;
    /**
     * Whether UISheet has close animation or not
     */
    hasCloseAnimation?: boolean;
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

function SheetContent({
    visible,
    onClose,
    onOpenEnd,
    onCloseEnd,
    children,
    style,
    hasOpenAnimation,
    hasCloseAnimation,
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
            return;
        }

        requestAnimationFrame(() => animate(true));
    }, [visible, animate]);

    useBackHandler(() => {
        if (onClose) {
            onClose();
            return true;
        }

        return false;
    });

    useStatusBar({
        backgroundColor: ColorVariants.BackgroundOverlay,
    });

    const { colorParts: overlayColorParts, opacity: overlayOpacity } = useColorParts(
        ColorVariants.BackgroundOverlay,
    );

    const overlayStyle = useAnimatedStyle(() => {
        return {
            flex: 1,
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
            scrollHandler,
            gestureHandler: scrollGestureHandler,
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
        ],
    );

    return (
        <View style={styles.container}>
            <TapGestureHandler enabled={onClose != null} onGestureEvent={onTapGestureHandler}>
                {/* https://github.com/software-mansion/react-native-gesture-handler/issues/71 */}
                <Animated.View style={styles.interlayer}>
                    <PanGestureHandler
                        maxPointers={1}
                        enabled={onClose != null}
                        onGestureEvent={onPanGestureHandler}
                    >
                        <Animated.View style={overlayStyle} />
                    </PanGestureHandler>
                </Animated.View>
            </TapGestureHandler>
            <Animated.View style={[styles.sheet, cardStyle]} pointerEvents="box-none">
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
                                {children}
                            </SheetReadyContext.Provider>
                        </ScrollableContext.Provider>
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
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
