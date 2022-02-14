import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View, TextStyle, ViewStyle, StyleProp } from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import type { WithSpringConfig } from 'react-native-reanimated';

import { ColorVariants, useTheme, Typography, TypographyVariants } from '@tonlabs/uikit.themes';

export type FloatingLabelProps = {
    children: string;
    isFolded: boolean;
    onFolded: () => void;
};

const paragraphTextStyle: TextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphText],
);
const labelTextStyle: TextStyle = StyleSheet.flatten(Typography[TypographyVariants.ParagraphLabel]);
export const expandedLabelLineHeight: number = paragraphTextStyle.lineHeight
    ? paragraphTextStyle.lineHeight
    : 24;
export const foldedLabelLineHeight: number = labelTextStyle.lineHeight
    ? labelTextStyle.lineHeight
    : 16;
const FOLDED_LABEL_SCALE: number = foldedLabelLineHeight / expandedLabelLineHeight;

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

// @inline
const LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE: number = 1;

const withSpringConfig: WithSpringConfig = {
    damping: 17,
    stiffness: 150,
};

const validateChildren = (children: string): boolean => {
    if (typeof children !== 'string') {
        if (__DEV__) {
            console.error(`FloatingLabel: prop 'children' must have only 'string' value`);
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
    onLabelLayout: (layoutChangeEvent: LayoutChangeEvent) => void;
};
const Label: React.FC<LabelProps> = (props: LabelProps) => {
    const { children, animatedPosition, onLabelLayout } = props;
    const theme = useTheme();
    const labelStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
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
            onLayout={onLabelLayout}
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
    const position: Animated.SharedValue<number> = useSharedValue<number>(getPosition(isFolded));

    React.useEffect(() => {
        position.value = getPosition(isFolded);
    }, [isFolded, position]);

    const animationCallback = React.useCallback(
        (isFinished?: boolean): void => {
            'worklet';

            if (isFinished && position.value === POSITION_FOLDED) {
                runOnJS(onFolded)();
            }
        },
        [position.value, onFolded],
    );

    const animatedPosition: Readonly<Animated.SharedValue<number>> = useDerivedValue(() => {
        return withSpring(position.value, withSpringConfig, animationCallback);
    });
    return animatedPosition;
};

const getFoldedX = (width: number): number => {
    'worklet';

    return (width * (1 - FOLDED_LABEL_SCALE)) / 2 - LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE / 2;
};

const useOnLabelLayout = (
    expandedLabelWidth: Animated.SharedValue<number>,
    expandedLabelHeight: Animated.SharedValue<number>,
) => {
    return React.useCallback(
        (layoutChangeEvent: LayoutChangeEvent) => {
            if (expandedLabelWidth.value !== layoutChangeEvent.nativeEvent.layout.width) {
                /** Direct assignment of a value does not change the layout for an unknown reason */
                // eslint-disable-next-line no-param-reassign
                expandedLabelWidth.value = withTiming(layoutChangeEvent.nativeEvent.layout.width, {
                    duration: 0,
                });
            }
            if (expandedLabelHeight.value !== layoutChangeEvent.nativeEvent.layout.height) {
                /** Direct assignment of a value does not change the layout for an unknown reason */
                // eslint-disable-next-line no-param-reassign
                expandedLabelHeight.value = withTiming(
                    layoutChangeEvent.nativeEvent.layout.height,
                    { duration: 0 },
                );
            }
        },
        [expandedLabelWidth, expandedLabelHeight],
    );
};

export const FloatingLabel: React.FC<FloatingLabelProps> = (props: FloatingLabelProps) => {
    const { isFolded, onFolded, children } = props;

    /** Dimensions of label in the expanded state */
    const expandedLabelWidth: Animated.SharedValue<number> = useSharedValue<number>(0);
    const expandedLabelHeight: Animated.SharedValue<number> = useSharedValue<number>(0);

    const onLabelLayout = useOnLabelLayout(expandedLabelWidth, expandedLabelHeight);

    const labelOpacity: Animated.SharedValue<number> = useDerivedValue<number>(() => {
        return expandedLabelWidth.value && expandedLabelHeight.value ? 1 : 0;
    });

    const animatedPosition: Readonly<Animated.SharedValue<number>> = useAnimatedPosition(
        isFolded,
        onFolded,
    );

    const labelContainerStyle: StyleProp<ViewStyle> = useAnimatedStyle(() => {
        const foldedX: number = getFoldedX(expandedLabelWidth.value);
        return {
            transform: [
                {
                    translateX: interpolate(
                        animatedPosition.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [-foldedX, 0],
                    ),
                },
                {
                    translateY: interpolate(
                        animatedPosition.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [-expandedLabelHeight.value, 0],
                    ),
                },
                {
                    scale: interpolate(
                        animatedPosition.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [FOLDED_LABEL_SCALE, 1],
                    ),
                },
            ],
        };
    });
    const labelContainerOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: labelOpacity.value,
        };
    });

    if (!validateChildren(children)) {
        return null;
    }
    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View style={labelContainerStyle}>
                <Animated.View style={labelContainerOpacityStyle}>
                    <Label animatedPosition={animatedPosition} onLabelLayout={onLabelLayout}>
                        {children}
                    </Label>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
});
