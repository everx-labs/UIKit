import * as React from 'react';
import { Platform, Pressable, TouchableOpacity } from 'react-native';
import { makeStyles } from '@tonlabs/uikit.themes';
import type { UITooltipProps } from './types';
import { UITooltipBox } from './UITooltipBox';

export function UITooltip({ children, style: styleProp, ...restProps }: UITooltipProps) {
    const containerRef = React.useRef<TouchableOpacity>(null);
    const [visible, setVisible] = React.useState(false);

    const onClose = React.useCallback(function onClose() {
        setVisible(false);
    }, []);

    const onOpen = React.useCallback(function onOpen() {
        setVisible(true);
    }, []);

    const styles = useStyles();

    return (
        <Pressable style={[styles.container, styleProp]} ref={containerRef} onPress={onOpen}>
            {children}
            {visible ? (
                <UITooltipBox {...restProps} triggerRef={containerRef} onClose={onClose} />
            ) : null}
        </Pressable>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        // The typescript requires the presence of any style attribute, in addition to the `userSelect`
        display: 'flex',
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: null,
        }),
    },
}));
