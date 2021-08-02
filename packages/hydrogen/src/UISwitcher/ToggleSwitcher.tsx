import * as React from 'react';
import Animated from 'react-native-reanimated';
import type { UISwitcherProps } from './types';
import { ColorVariants, Theme, useTheme } from '../Colors';
import { makeStyles } from '../makeStyles';
import { useHover } from '../useHover';
import {
    useImage,
    useImageStyle,
    useOverlayStyle,
    useSwitcherGestureEvent,
    useSwitcherState,
} from './hooks';
import { UIConstant } from '../constants';
import { RawButton } from './IconSwitcher';

const getToggleShape = {
    width: UIConstant.switcher.toggleWidth,
    height: UIConstant.switcher.toggleHeight,
    borderRadius: UIConstant.switcher.toggleHeight,
};

export const ToggleSwitcher: React.FC<UISwitcherProps> = (
    props: UISwitcherProps,
) => {
    const { active, disabled, onPress, variant, testID } = props;

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const theme = useTheme();
    const styles = useStyles(theme);

    const image = useImage(variant, theme);

    const { onGestureEvent, pressed } = useSwitcherGestureEvent(onPress);

    const switcherState = useSwitcherState(isHovered, pressed);
    const overlayStyle = useOverlayStyle(switcherState, theme, variant);

    const cursorStyle = React.useMemo(() => {
        return { cursor: disabled ? 'default' : 'pointer' };
    }, [disabled]);

    const { toggleImageOnStyle, toggleBackgroundStyle } = useImageStyle(
        active,
        switcherState,
        theme,
    );

    return (
        <RawButton
            shouldCancelWhenOutside
            onGestureEvent={onGestureEvent}
            style={[
                styles.buttonToggleStyle,
                // @ts-expect-error
                cursorStyle,
            ]}
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
                    <Animated.View style={toggleImageOnStyle}>
                        {image}
                    </Animated.View>
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
    buttonToggleStyle: {
        width: getToggleShape.width,
        height: getToggleShape.height,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    disabledSwitcherStyle: {
        backgroundColor: theme[ColorVariants.BackgroundNeutral],
    },
}));
