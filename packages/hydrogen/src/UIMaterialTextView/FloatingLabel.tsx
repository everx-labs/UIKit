import * as React from 'react';
import {
    LayoutChangeEvent,
    StyleSheet,
    View,
    TextStyle,
    ViewStyle,
    StyleProp,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { ColorVariants, useTheme } from '../Colors';
import { Typography, TypographyVariants } from '../Typography';

export type FloatingLabelProps = {
    children: string;
    isFolded: boolean;
    onFolded: () => void;
};

const paragraphTextStyle: TextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphText],
);
const labelTextStyle: TextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphLabel],
);
export const expandedLabelLineHeight: number = paragraphTextStyle.lineHeight ? paragraphTextStyle.lineHeight : 24
export const foldedLabelLineHeight: number = labelTextStyle.lineHeight ? labelTextStyle.lineHeight : 16
const FOLDED_LABEL_SCALE: number = foldedLabelLineHeight / expandedLabelLineHeight;

const POSITION_FOLDED: number = 0;
const POSITION_EXPANDED: number = 1;

const LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE: number = 1;

const withSpringConfig: Animated.WithSpringConfig = {
    damping: 17,
    stiffness: 150,
};

const validateChildren = (children: string): boolean => {
    if (typeof children !== 'string') {
        if (__DEV__) {
            console.error(
                `FloatingLabel: prop 'children' must have only 'string' value`,
            );
        }
        return false;
    }
    return true;
};

const getPosition = (isFolded: boolean): number => {
    return isFolded ? POSITION_FOLDED : POSITION_EXPANDED;
};

type LabelProps = {
    children: string;
    animatedPosition: Readonly<Animated.SharedValue<number>>;
};
const Label: React.FC<LabelProps> = (props: LabelProps) => {
    const { children, animatedPosition } = props;
    const theme = useTheme();
    const labelStyle = Animated.useAnimatedStyle(() => {
        return {
            color: Animated.interpolateColor(
                animatedPosition.value,
                [POSITION_FOLDED, POSITION_EXPANDED],
                [
                    theme[ColorVariants.TextTertiary] as string,
                    theme[ColorVariants.TextSecondary] as string,
                ],
            ),
        };
    });
    return (
        <Animated.Text
            style={[Typography[TypographyVariants.ParagraphText], labelStyle]}
            numberOfLines={1}
            lineBreakMode="tail"
        >
            {children}
        </Animated.Text>
    );
};

/**
 * Returns animated label position.
 * It can be in the range from POSITION_FOLDED to POSITION_EXPANDED
 */
const useAnimatedPosition = (
    isFolded: boolean,
    onFolded: () => void,
): Readonly<Animated.SharedValue<number>> => {
    /** Label position switcher (POSITION_FOLDED/POSITION_EXPANDED) */
    const position: Animated.SharedValue<number> = Animated.useSharedValue<
        number
    >(getPosition(isFolded));

    React.useEffect(() => {
        position.value = getPosition(isFolded);
    }, [isFolded, position]);

    const animationCallback = React.useCallback(
        (isFinished: boolean): void => {
            'worklet';

            if (isFinished && position.value === POSITION_FOLDED) {
                Animated.runOnJS(onFolded)();
            }
        },
        [position.value, onFolded],
    );

    const animatedPosition: Readonly<Animated.SharedValue<
        number
    >> = Animated.useDerivedValue(() => {
        return Animated.withSpring(
            position.value,
            withSpringConfig,
            animationCallback,
        );
    });
    return animatedPosition;
};

const getFoldedX = (width: number): number => {
    'worklet';

    return (
        (width * (1 - FOLDED_LABEL_SCALE)) / 2 -
        LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE / 2
    );
};

const useOnLabelLayout = (
    expandedLabelWidth: Animated.SharedValue<number>,
    expandedLabelHeight: Animated.SharedValue<number>,
) => {
    return React.useCallback(
        (layoutChangeEvent: LayoutChangeEvent) => {
            if (
                expandedLabelWidth.value !==
                layoutChangeEvent.nativeEvent.layout.width
            ) {
                // eslint-disable-next-line no-param-reassign
                expandedLabelWidth.value =
                    layoutChangeEvent.nativeEvent.layout.width;
            }
            if (
                expandedLabelHeight.value !==
                layoutChangeEvent.nativeEvent.layout.height
            ) {
                // eslint-disable-next-line no-param-reassign
                expandedLabelHeight.value =
                    layoutChangeEvent.nativeEvent.layout.height;
            }
        },
        [expandedLabelWidth, expandedLabelHeight],
    );
};

export const FloatingLabel: React.FC<FloatingLabelProps> = (
    props: FloatingLabelProps,
) => {
    const { isFolded, onFolded, children } = props;

    /** Dimensions of label in the expanded state */
    const expandedLabelWidth: Animated.SharedValue<number> = Animated.useSharedValue<
        number
    >(0);
    const expandedLabelHeight: Animated.SharedValue<number> = Animated.useSharedValue<
        number
    >(0);

    const onLabelLayout = useOnLabelLayout(
        expandedLabelWidth,
        expandedLabelHeight,
    );

    const animatedPosition: Readonly<Animated.SharedValue<
        number
    >> = useAnimatedPosition(isFolded, onFolded);

    const labelContainerStyle: StyleProp<ViewStyle> = Animated.useAnimatedStyle(() => {
        const foldedX: number = getFoldedX(expandedLabelWidth.value);
        return {
            transform: [
                {
                    translateX: Animated.interpolate(
                        animatedPosition.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [-foldedX, 0],
                    ),
                },
                {
                    translateY: Animated.interpolate(
                        animatedPosition.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [-expandedLabelHeight.value, 0],
                    ),
                },
                {
                    scale: Animated.interpolate(
                        animatedPosition.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [FOLDED_LABEL_SCALE, 1],
                    ),
                },
            ],
        };
    }, [expandedLabelWidth, expandedLabelHeight]);

    if (!validateChildren(children)) {
        return null;
    }
    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View
                style={[styles.floatingLabel, labelContainerStyle]}
                onLayout={onLabelLayout}
            >
                <Label animatedPosition={animatedPosition}>{children}</Label>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    floatingLabel: {
        position: 'absolute',
    },
});
