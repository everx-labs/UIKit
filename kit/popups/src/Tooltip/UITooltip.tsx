import * as React from 'react';
import { Insets, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { makeStyles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UITooltipProps } from './types';
import { UITooltipContent } from './UITooltipContent';

const defaultHitSlop: Insets = {
    top: -UILayoutConstant.smallContentOffset,
    right: -UILayoutConstant.smallContentOffset,
    bottom: -UILayoutConstant.smallContentOffset,
    left: -UILayoutConstant.smallContentOffset,
};

function convertHitSlopToPaddings(hitSlop: Insets | undefined) {
    if (!hitSlop) {
        return defaultHitSlop;
    }
    return {
        top: hitSlop.top !== undefined ? -hitSlop.top : defaultHitSlop.top,
        right: hitSlop.right !== undefined ? -hitSlop.right : defaultHitSlop.right,
        bottom: hitSlop.bottom !== undefined ? -hitSlop.bottom : defaultHitSlop.bottom,
        left: hitSlop.left !== undefined ? -hitSlop.left : defaultHitSlop.left,
    };
}

export function UITooltip({ children, style: styleProp, hitSlop, ...restProps }: UITooltipProps) {
    const containerRef = React.useRef<TouchableOpacity>(null);
    const [visible, setVisible] = React.useState(false);

    const onClose = React.useCallback(function onClose() {
        setVisible(false);
    }, []);

    const onOpen = React.useCallback(function onOpen() {
        setVisible(true);
    }, []);

    const styles = useStyles(hitSlop);

    return (
        <TouchableOpacity style={styleProp} ref={containerRef} disabled>
            {children}
            {visible ? (
                <UITooltipContent {...restProps} targetRef={containerRef} onClose={onClose} />
            ) : null}
            <Pressable onPress={onOpen} style={styles.pressableOverlay} />
        </TouchableOpacity>
    );
}

const useStyles = makeStyles((hitSlop: Insets | undefined) => ({
    pressableOverlay: {
        ...StyleSheet.absoluteFillObject,
        ...convertHitSlopToPaddings(hitSlop),
    },
}));