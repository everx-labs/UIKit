import * as React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform, Keyboard } from 'react-native';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useBackHandler } from '@react-native-community/hooks';

import { ColorVariants, Portal, useColorParts, useStatusBar } from '@tonlabs/uikit.hydrogen';
import { useAnimatedKeyboardHeight } from '@tonlabs/uikit.keyboard';

import { UIConstant } from '../../constants';
import { ScrollableContext } from '../../Scrollable/Context';
import { useSheetHeight } from './useSheetHeight';
import type { OnOpen, OnClose } from './types';
import { usePosition } from './usePosition';

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
    // advanced
    // not for public use
    countRubberBandDistance?: boolean;
    /**
     * Whether UISheet has open animation or not
     */
    hasOpenAnimation?: boolean;
    /**
     * Whether UISheet has close animation or not
     */
    hasCloseAnimation?: boolean;
    /**
     * Whether UISheet should react on keyboard opening
     *
     * TODO(savelichalex): I was thinking maybe do it a bit smarter,
     * but for now left it simple. So the idea was:
     * Maybe measure the size of the container somehow and see if it
     * can fit into the area between top safe area edge and bottom when
     * keyboard is opened, and if it can't fit, disable reacting on keyboard.
     * But it actually produces new question, like what if the conditions are met
     * but I want the container to be shrinked instead and still react on keyboard?
     */
    shouldHandleKeyboard?: boolean;
    /**
     * See Portal
     */
    forId?: string;
};

type UISheetPortalContentProps = UISheetProps & {
    onClosePortalRequest: () => void;
};

function UISheetPortalContent({
    visible,
    onClose,
    onOpenEnd,
    onCloseEnd,
    children,
    onClosePortalRequest,
    style,
    countRubberBandDistance,
    hasOpenAnimation,
    hasCloseAnimation,
    shouldHandleKeyboard,
}: UISheetPortalContentProps) {
    const { height, onSheetLayout } = useSheetHeight(
        UIConstant.rubberBandEffectDistance,
        countRubberBandDistance,
    );
    const keyboardHeight = useAnimatedKeyboardHeight();

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
    } = usePosition(
        height,
        keyboardHeight,
        hasOpenAnimation,
        hasCloseAnimation,
        shouldHandleKeyboard,
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

    const { colorParts: overlayColorParts, opacity: overlayOpacity } = useColorParts(
        ColorVariants.BackgroundOverlay,
    );

    useStatusBar({
        backgroundColor: ColorVariants.BackgroundOverlay,
    });

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
            <Animated.View
                style={[styles.sheet, cardStyle]}
                onLayout={onSheetLayout}
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
                    <Animated.View style={style}>
                        <ScrollableContext.Provider value={scrollableContextValue}>
                            {children}
                        </ScrollableContext.Provider>
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
    );
}

export function UISheet(props: UISheetProps) {
    const { visible, forId } = props;
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
            <UISheetPortalContent {...props} onClosePortalRequest={onClosePortalRequest} />
        </Portal>
    );
}

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
