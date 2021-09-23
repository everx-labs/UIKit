import * as React from 'react';
import { Animated, ColorValue, Platform, StyleSheet, View } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import { Shortcuts } from './Shortcuts';
import type { Shortcut } from './types';
import { useChatOnScrollListener } from '../useChatOnScrollListener';

function useAnimatedBorder(numberOfLines: number) {
    const borderOpacity = React.useRef<Animated.Value>(new Animated.Value(0));

    const scrollOffset = React.useRef<number>(0);

    const showBorderIfNeeded = React.useCallback(() => {
        const hasScroll = scrollOffset.current > 1;
        const needToShow = hasScroll || numberOfLines > 1;

        Animated.spring(borderOpacity.current, {
            toValue: needToShow ? 1 : 0,
            useNativeDriver: true,
            speed: 20,
        }).start();
    }, [numberOfLines]);

    useChatOnScrollListener((y: number) => {
        scrollOffset.current = y;

        showBorderIfNeeded();
    });

    React.useEffect(() => {
        showBorderIfNeeded();
    }, [numberOfLines, showBorderIfNeeded]);

    return borderOpacity.current;
}

export function ChatInputContainer(props: {
    numberOfLines: number;
    shortcuts?: Shortcut[];
    children: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
}) {
    const theme = useTheme();
    const borderOpacity = useAnimatedBorder(props.numberOfLines);

    const containerStyle: {
        backgroundColor: ColorValue;
    } = React.useMemo(
        () => ({
            backgroundColor: theme[ColorVariants.BackgroundPrimary],
        }),
        [theme],
    );

    return (
        <View style={containerStyle}>
            <Shortcuts shortcuts={props.shortcuts} />
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
                style={[styles.container, props.left == null ? UIStyle.margin.leftDefault() : null]}
            >
                {props.left}
                <View style={styles.inputMsg}>{props.children}</View>
                {props.right}
            </View>
        </View>
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
        minHeight: UIConstant.largeButtonHeight(),
    },
    border: {
        height: 1,
    },
    inputMsg: {
        flex: 1,
        marginVertical: 0,
        paddingBottom: Platform.select({
            // compensate mobile textContainer's default padding
            android: 14,
            default: 17,
        }),
        paddingTop: 10,
    },
});
