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

type Dimensions = {
    width: number;
    height: number;
};
const initialDimensions: Dimensions = {
    width: 0,
    height: 0,
};

const paragraphTextStyle: TextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphText],
);
const labelTextStyle: TextStyle = StyleSheet.flatten(
    Typography[TypographyVariants.ParagraphLabel],
);
const FOLDED_LABEL_SCALE: number =
    labelTextStyle.fontSize !== undefined &&
    paragraphTextStyle.fontSize !== undefined
        ? labelTextStyle.fontSize / paragraphTextStyle.fontSize
        : 0.7;

const POSITION_FOLDED: number = 0;
const POSITION_EXPANDED: number = 1;

const LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE: number = 1;
const BOTTOM_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE: number = 6;

const BOTTOM_OFFSET_OF_FOLDED_LABEL_FROM_EXPANDED_LABEL: number = 4;

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

const getFoldedY = (height: number): number => {
    'worklet';

    return (
        -height +
        BOTTOM_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE / 2 -
        BOTTOM_OFFSET_OF_FOLDED_LABEL_FROM_EXPANDED_LABEL
    );
};

const useOnPseudoLabelLayout = (
    expandedLabelDimensions: Dimensions,
    setExpandedLabelDimensions: (newDimensions: Dimensions) => void,
) => {
    return React.useCallback(
        (layoutChangeEvent: LayoutChangeEvent) => {
            if (
                expandedLabelDimensions.width !==
                    layoutChangeEvent.nativeEvent.layout.width ||
                expandedLabelDimensions.height !==
                    layoutChangeEvent.nativeEvent.layout.height
            ) {
                setExpandedLabelDimensions({
                    width: layoutChangeEvent.nativeEvent.layout.width,
                    height: layoutChangeEvent.nativeEvent.layout.height,
                });
            }
        },
        [expandedLabelDimensions, setExpandedLabelDimensions],
    );
};

export const FloatingLabel: React.FC<FloatingLabelProps> = (
    props: FloatingLabelProps,
) => {
    const { isFolded, onFolded, children } = props;

    /** Dimensions of label in the expanded state */
    const [
        expandedLabelDimensions,
        setExpandedLabelDimensions,
    ] = React.useState<Dimensions>(initialDimensions);

    const onPseudoLabelLayout = useOnPseudoLabelLayout(
        expandedLabelDimensions,
        setExpandedLabelDimensions,
    );

    const animatedPosition: Readonly<Animated.SharedValue<
        number
    >> = useAnimatedPosition(isFolded, onFolded);

    const labelContainerStyle: StyleProp<ViewStyle> = Animated.useAnimatedStyle(() => {
        const foldedX: number = getFoldedX(expandedLabelDimensions.width);
        const foldedY: number = getFoldedY(expandedLabelDimensions.height);
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
                        [foldedY, 0],
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
    }, [expandedLabelDimensions]);

    if (!validateChildren(children)) {
        return null;
    }
    return (
        <View style={styles.container} pointerEvents="none">
            <View style={styles.pseudoLabel} onLayout={onPseudoLabelLayout}>
                <Label animatedPosition={animatedPosition}>{children}</Label>
            </View>
            <Animated.View style={[styles.floatingLabel, labelContainerStyle]}>
                <Label animatedPosition={animatedPosition}>{children}</Label>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    pseudoLabel: {
        // To inner text be in intrinsic size
        alignItems: 'flex-start',
        opacity: 0,
    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
