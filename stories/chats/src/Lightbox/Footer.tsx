import * as React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    UILabel,
    UILabelRoles,
    ColorVariants,
    Theme,
    useTheme,
    makeStyles,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { VisibilityState } from './constants';
import { UIConstant } from '../constants';

// @inline
const VISIBILITY_STATE_CLOSED: VisibilityState = 0;
// @inline
const VISIBILITY_STATE_OPENED: VisibilityState = 1;

type FooterProps = {
    visibilityState: Animated.SharedValue<number>;
    prompt?: string;
};

export const Footer = ({ prompt, visibilityState }: FooterProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const styles = useStyles(theme, insets);

    const footerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                visibilityState.value,
                [VISIBILITY_STATE_CLOSED, VISIBILITY_STATE_OPENED],
                [0, 1],
            ),
        };
    }, []);

    if (!prompt) {
        return null;
    }

    return (
        <Animated.View style={[styles.footerContainer, footerStyle]} pointerEvents="box-none">
            <Animated.View style={styles.footer} pointerEvents="none">
                <UILabel
                    role={UILabelRoles.ParagraphText}
                    color={ColorVariants.TextPrimaryInverted}
                >
                    {prompt}
                </UILabel>
            </Animated.View>
        </Animated.View>
    );
};

const useStyles = makeStyles((theme: Theme, insets: EdgeInsets) => ({
    footerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: insets.bottom,
        zIndex: 10,
        backgroundColor: theme[ColorVariants.BackgroundOverlay],
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: UIConstant.contentInsetVerticalX3,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
}));
