import * as React from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import { ColorVariants, Theme, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import type { UISwitcherProps } from '../types';
import { useHover } from '../../useHover';
import { useImageStyle, useOverlayStyle, useSwitcherGestureEvent, useSwitcherState } from './hooks';
import { UIConstant } from '../../constants';

export const ToggleSwitcher: React.FC<UISwitcherProps> = ({
    active,
    disabled,
    onPress,
    testID,
}: UISwitcherProps) => {
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const theme = useTheme();
    const styles = useStyles(theme);

    const { onGestureEvent, pressed } = useSwitcherGestureEvent(onPress);
    const switcherState = useSwitcherState(isHovered, pressed);
    const overlayStyle = useOverlayStyle(switcherState, theme);

    const cursorStyle = React.useMemo(() => {
        return disabled ? styles.showDefault : styles.showPointer;
    }, [disabled]);

    const { toggleBackgroundStyle, panGestureHandler, toggleImageOnStyle } = useImageStyle(
        active,
        theme,
        onPress,
    );

    const switcherStyle = React.useMemo(() => {
        return disabled ? styles.disabledSwitcherStyle : toggleBackgroundStyle;
    }, [disabled, toggleBackgroundStyle]);

    return (
        <TapGestureHandler
            shouldCancelWhenOutside
            onGestureEvent={onGestureEvent}
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            testID={testID}
            enabled={!disabled}
        >
            <Animated.View style={cursorStyle}>
                <PanGestureHandler enabled={!disabled} onGestureEvent={panGestureHandler}>
                    <Animated.View
                        style={[styles.buttonToggleStyle, switcherStyle, styles.toggleOuterStyle]}
                    >
                        <Animated.View style={[styles.toggleInnerStyle, !disabled && overlayStyle]}>
                            <Animated.View style={[styles.toggleDotStyle, toggleImageOnStyle]} />
                        </Animated.View>
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </TapGestureHandler>
    );
};

const toggleShapeStyles = {
    width: UIConstant.switcher.toggleWidth,
    height: UIConstant.switcher.toggleHeight,
    borderRadius: UIConstant.switcher.toggleHeight,
};

const useStyles = makeStyles((theme: Theme) => ({
    toggleInnerStyle: {
        position: 'absolute',
        ...toggleShapeStyles,
        padding: UIConstant.switcher.togglePadding,
    },
    toggleOuterStyle: {
        ...toggleShapeStyles,
        overflow: 'hidden',
    },
    toggleDotStyle: {
        width: UIConstant.switcher.toggleDotSize,
        height: UIConstant.switcher.toggleDotSize,
        borderRadius: UIConstant.switcher.toggleDotSize,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
    },
    buttonToggleStyle: {
        width: toggleShapeStyles.width,
        height: toggleShapeStyles.height,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    disabledSwitcherStyle: {
        backgroundColor: theme[ColorVariants.BackgroundNeutral],
    },
    showPointer: {
        margin: 0,
        cursor: 'pointer',
    },
    showDefault: {
        margin: 0,
        cursor: 'default',
    },
}));
