import * as React from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { RawButton } from '../RawButton';
import type { UISwitcherProps } from '../types';
import { ColorVariants, Theme, useTheme } from '../../Colors';
import { makeStyles } from '../../makeStyles';
import { useHover } from '../../useHover';
import {
    useImageStyle,
    useOverlayStyle,
    useSwitcherGestureEvent,
    useSwitcherState,
} from './hooks';
import { UIConstant } from '../../constants';

const getToggleShape = {
    width: UIConstant.switcher.toggleWidth,
    height: UIConstant.switcher.toggleHeight,
    borderRadius: UIConstant.switcher.toggleHeight,
};

export const ToggleSwitcher: React.FC<UISwitcherProps> = (
    { active, disabled, onPress, testID }: UISwitcherProps,
) => {

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const theme = useTheme();
    const styles = useStyles(theme);

    const { onGestureEvent, pressed } = useSwitcherGestureEvent(onPress);
    const switcherState = useSwitcherState(isHovered, pressed);
    const overlayStyle = useOverlayStyle(switcherState, theme);

    const cursorStyle = React.useMemo(() => {
        return disabled ? styles.showDefault : styles.showPointer;
    }, [disabled]);

    const {
        toggleBackgroundStyle,
        panGestureHandler,
        toggleImageOnStyle,
    } = useImageStyle(active, theme, onPress);

    return (
        <RawButton
            shouldCancelWhenOutside
            onGestureEvent={onGestureEvent}
            style={[
                styles.buttonToggleStyle,
                cursorStyle,
            ]}
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            testID={testID}
            enabled={!disabled}
        >
            <Animated.View
                style={[
                    styles.toggleOuterStyle,
                    disabled
                        ? styles.disabledSwitcherStyle
                        : toggleBackgroundStyle,
                ]}
            >
                <Animated.View
                    style={[styles.toggleInnerStyle, !disabled && overlayStyle]}
                >
                    <PanGestureHandler onGestureEvent={panGestureHandler}>
                        <Animated.View style={[styles.toggleDotStyle, toggleImageOnStyle]} />
                    </PanGestureHandler>
                </Animated.View>
            </Animated.View>
        </RawButton>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    toggleInnerStyle: {
        position: 'absolute',
        ...getToggleShape,
        padding: UIConstant.switcher.togglePadding,
    },
    toggleOuterStyle: {
        ...getToggleShape,
        overflow: 'hidden',
    },
    toggleDotStyle: {
        width: UIConstant.switcher.toggleDotSize,
        height: UIConstant.switcher.toggleDotSize,
        borderRadius: UIConstant.switcher.toggleDotSize,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
    },
    buttonToggleStyle: {
        width: getToggleShape.width,
        height: getToggleShape.height,
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
