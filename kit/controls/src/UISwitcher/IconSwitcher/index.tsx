import * as React from 'react';
import { processColor, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { ColorVariants, Theme, useTheme, makeStyles } from '@tonlabs/uikit.themes';
import { RawButton } from '../RawButton';
import { UISwitcherProps, UISwitcherVariant } from '../types';
import { useHover } from '../../useHover';
import {
    useImage,
    useImageStyle,
    useOverlayStyle,
    useSwitcherGestureEvent,
    useSwitcherState,
} from './hooks';
import { UIConstant } from '../../constants';

const getShape = (variant: UISwitcherVariant) => {
    switch (variant) {
        case UISwitcherVariant.Check:
            return {
                width: UIConstant.iconSize - UIConstant.switcher.squarePadding * 2,
                height: UIConstant.iconSize - UIConstant.switcher.squarePadding * 2,
                borderRadius: UIConstant.switcher.squareBorderRadius,
            };
        case UISwitcherVariant.Radio:
        case UISwitcherVariant.Select:
        default:
            return {
                width: UIConstant.iconSize - UIConstant.switcher.circlePadding * 2,
                height: UIConstant.iconSize - UIConstant.switcher.circlePadding * 2,
                borderRadius: UIConstant.iconSize - UIConstant.switcher.circlePadding * 2,
            };
    }
};

export const IconSwitcher: React.FC<UISwitcherProps> = ({
    active,
    disabled,
    onPress,
    variant,
    testID,
}: UISwitcherProps) => {
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const theme = useTheme();
    const styles = useStyles(theme, variant, isHovered);

    const image = useImage(variant, theme);

    const { onGestureEvent, pressed } = useSwitcherGestureEvent(onPress);

    const switcherState = useSwitcherState(isHovered, pressed);
    const overlayStyle = useOverlayStyle(switcherState, theme);

    const cursorStyle = React.useMemo(() => {
        return disabled ? styles.showDefault : styles.showPointer;
    }, [disabled]);

    const { imageOnStyle, imageOffOpacity, imageOffBorderColor } = useImageStyle(
        active,
        switcherState,
        theme,
    );

    return (
        <RawButton
            shouldCancelWhenOutside
            onGestureEvent={onGestureEvent}
            style={[styles.buttonSwitcherStyle, cursorStyle]}
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            testID={testID}
            enabled={!disabled}
            rippleColor={processColor('transparent')}
        >
            <Animated.View style={imageOffOpacity}>
                <Animated.View
                    style={[
                        styles.offSwitcher,
                        disabled ? styles.disabledSwitcherBordersStyle : imageOffBorderColor,
                    ]}
                />
            </Animated.View>

            <Animated.View style={[styles.onSwitcher, imageOnStyle]}>
                <Animated.View
                    style={[styles.overlay, disabled ? styles.disabledSwitcherStyle : overlayStyle]}
                >
                    {image}
                </Animated.View>
            </Animated.View>
        </RawButton>
    );
};

const useStyles = makeStyles((theme: Theme, variant: UISwitcherVariant) => ({
    offSwitcher: {
        ...getShape(variant),
        borderWidth: UIConstant.switcher.offBorderWidth,
    },
    onSwitcher: {
        position: 'absolute',
        ...getShape(variant),
        backgroundColor: theme[ColorVariants.BackgroundAccent],
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSwitcherStyle: {
        width: UIConstant.iconSize,
        height: UIConstant.iconSize,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledSwitcherStyle: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary],
    },
    disabledSwitcherBordersStyle: {
        borderColor: theme[ColorVariants.BackgroundTertiary],
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
