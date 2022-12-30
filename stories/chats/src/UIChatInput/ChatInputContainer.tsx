import * as React from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent } from 'react-native';

import { ColorVariants, useTheme, UIBackgroundView } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { Shortcuts } from './Shortcuts';
import type { Shortcut } from './types';
import { useChatOnScrollListener } from '../useChatOnScrollListener';
import { UIChatInputConstants } from './constants';

function useAnimatedBorder(hasSeveralLinesInInput: boolean) {
    const borderOpacity = React.useRef<Animated.Value>(new Animated.Value(0));

    const scrollOffset = React.useRef<number>(0);

    const showBorderIfNeeded = React.useCallback(() => {
        const hasScroll = scrollOffset.current > 1;
        const needToShow = hasScroll || hasSeveralLinesInInput;

        Animated.spring(borderOpacity.current, {
            toValue: needToShow ? 1 : 0,
            useNativeDriver: true,
            speed: 20,
        }).start();
    }, [hasSeveralLinesInInput]);

    useChatOnScrollListener((y: number) => {
        scrollOffset.current = y;

        showBorderIfNeeded();
    });

    React.useEffect(() => {
        showBorderIfNeeded();
    }, [hasSeveralLinesInInput, showBorderIfNeeded]);

    return borderOpacity.current;
}

export function ChatInputContainer({
    hasSeveralLinesInInput,
    shortcuts,
    children,
    left,
    right,
    onHeightChange,
}: {
    hasSeveralLinesInInput: boolean;
    shortcuts?: Shortcut[];
    children: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onHeightChange?: (height: number) => void;
}) {
    const theme = useTheme();
    const borderOpacity = useAnimatedBorder(hasSeveralLinesInInput);

    const onLayoutIfNecessary = React.useCallback(
        ({
            nativeEvent: {
                layout: { height },
            },
        }: LayoutChangeEvent) => {
            if (onHeightChange) {
                onHeightChange(height);
            }
        },
        [onHeightChange],
    );

    const onLayout = onHeightChange != null ? onLayoutIfNecessary : undefined;

    React.useEffect(
        () => () => {
            if (onHeightChange) {
                // If inputs is unmounted need to reset insets for list
                onHeightChange(0);
            }
        },
        [onHeightChange],
    );

    return (
        <UIBackgroundView onLayout={onLayout}>
            <Shortcuts shortcuts={shortcuts} />
            <Animated.View
                style={[
                    styles.border,
                    {
                        backgroundColor: theme[ColorVariants.LineSecondary],
                        opacity: borderOpacity,
                    },
                ]}
            />
            <View
                style={[
                    styles.container,
                    {
                        marginLeft: left == null ? UILayoutConstant.contentOffset : undefined,
                    },
                ]}
            >
                {left}
                <View style={styles.inputMsg}>{children}</View>
                {right}
            </View>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    // If you want to use flex: 1 see container!
    container: {
        // Do not use `flex: 1` on any View wrappers that should be
        // of size of their children, ie intrinsic.
        // On Android it could break layout, as with `flex: 1` height is collapsed
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        minHeight: UIChatInputConstants.chatInputMinHeight,
    },
    border: {
        height: 1,
    },
    inputMsg: {
        flex: 1,
        alignSelf: 'center',
        paddingVertical: UILayoutConstant.contentOffset,
    },
});
