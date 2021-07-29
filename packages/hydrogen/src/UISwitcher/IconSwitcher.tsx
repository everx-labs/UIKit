import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import {
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { UISwitcherProps, UISwitcherVariant } from './types';
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

export const RawButton: React.FunctionComponent<Animated.AnimateProps<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>> = Animated.createAnimatedComponent(GHRawButton);

const getShape = (variant: UISwitcherVariant) => {
    switch (variant) {
        case UISwitcherVariant.Check:
            return {
                width:
                    UIConstant.iconSize - UIConstant.switcher.squarePadding * 2,
                height:
                    UIConstant.iconSize - UIConstant.switcher.squarePadding * 2,
                borderRadius: UIConstant.switcher.squareBorderRadius,
            };
        case UISwitcherVariant.Toggle:
            return {
                width:
                    UIConstant.iconSize + UIConstant.switcher.circlePadding * 4,
                height:
                    UIConstant.iconSize - UIConstant.switcher.circlePadding * 3,
                borderRadius:
                    UIConstant.iconSize - UIConstant.switcher.circlePadding * 3,
                padding: UIConstant.switcher.circlePadding * 2,
            };
        case UISwitcherVariant.Radio:
        case UISwitcherVariant.Select:
        default:
            return {
                width:
                    UIConstant.iconSize - UIConstant.switcher.circlePadding * 2,
                height:
                    UIConstant.iconSize - UIConstant.switcher.circlePadding * 2,
                borderRadius:
                    UIConstant.iconSize - UIConstant.switcher.circlePadding * 2,
            };
    }
};

export const IconSwitcher: React.FC<UISwitcherProps> = (
    props: UISwitcherProps,
) => {
    const { active, onPress, variant, testID } = props;

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const theme = useTheme();
    const styles = useStyles(theme, variant, isHovered);

    const image = useImage(variant, theme);

    const { onGestureEvent, pressed } = useSwitcherGestureEvent(onPress);

    const switcherState = useSwitcherState(isHovered, pressed);
    const overlayStyle = useOverlayStyle(switcherState, theme);
    const {
        imageOnStyle,
        imageOffOpacity,
        imageOffBorderColor,
        backgroundOnStyle,
    } = useImageStyle(active, switcherState, theme, variant);

    if (variant === UISwitcherVariant.Toggle) {
        return (
            <RawButton
                shouldCancelWhenOutside
                onGestureEvent={onGestureEvent}
                style={{
                        width: getShape(variant).width,
                        height: getShape(variant).height,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        // @ts-expect-error
                        cursor: 'pointer',
                    }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                testID={testID}
            >
                <Animated.View style={[styles.onToggle, backgroundOnStyle]}>
                    <Animated.View style={imageOnStyle}>{image}</Animated.View>
                </Animated.View>
            </RawButton>
        );
    }

    return (
        <RawButton
            shouldCancelWhenOutside
            onGestureEvent={onGestureEvent}
            style={[
                {
                    width: UIConstant.iconSize,
                    height: UIConstant.iconSize,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // @ts-expect-error
                    cursor: 'pointer',
                },
            ]}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            testID={testID}
        >
            <Animated.View style={imageOffOpacity}>
                <Animated.View
                    style={[styles.offSwitcher, imageOffBorderColor]}
                />
            </Animated.View>

            <Animated.View style={[styles.onSwitcher, imageOnStyle]}>
                <Animated.View style={[styles.overlay, overlayStyle]}>
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
    onToggle: {
        ...getShape(variant),
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
