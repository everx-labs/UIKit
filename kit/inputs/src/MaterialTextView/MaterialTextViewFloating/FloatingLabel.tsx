import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View, TextStyle, ViewStyle, StyleProp } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { ColorVariants, Typography, TypographyVariants, UILabel } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

export type FloatingLabelProps = {
    children: string;
    expandingValue: Readonly<Animated.SharedValue<number>>;
    isHovered: boolean;
    editable: boolean;
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

function validateChildren(children: string): boolean {
    if (typeof children !== 'string') {
        if (__DEV__) {
            console.error(`FloatingLabel: prop 'children' must have only 'string' value`);
        }
        return false;
    }
    return true;
}

type LabelProps = {
    children: string;
    onLabelLayout: (layoutChangeEvent: LayoutChangeEvent) => void;
    isHovered: boolean;
    editable: boolean;
};
function Label({ children, onLabelLayout, isHovered, editable }: LabelProps) {
    return (
        <UILabel
            role={TypographyVariants.ParagraphText}
            color={isHovered && editable ? ColorVariants.TextSecondary : ColorVariants.TextTertiary}
            onLayout={onLabelLayout}
            numberOfLines={1}
            lineBreakMode="tail"
        >
            {children}
        </UILabel>
    );
}

function getFoldedX(width: number): number {
    'worklet';

    return (width * (1 - FOLDED_LABEL_SCALE)) / 2 - LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE / 2;
}

function useOnLabelLayout(
    expandedLabelWidth: Animated.SharedValue<number>,
    expandedLabelHeight: Animated.SharedValue<number>,
) {
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
}

export function FloatingLabel({
    expandingValue,
    children,
    isHovered,
    editable,
}: FloatingLabelProps) {
    /** Dimensions of label in the expanded state */
    const expandedLabelWidth: Animated.SharedValue<number> = useSharedValue<number>(0);
    const expandedLabelHeight: Animated.SharedValue<number> = useSharedValue<number>(0);

    const onLabelLayout = useOnLabelLayout(expandedLabelWidth, expandedLabelHeight);

    const labelOpacity: Animated.SharedValue<number> = useDerivedValue<number>(() => {
        return expandedLabelWidth.value && expandedLabelHeight.value ? 1 : 0;
    });

    const labelContainerStyle: StyleProp<ViewStyle> = useAnimatedStyle(() => {
        const foldedX: number = getFoldedX(expandedLabelWidth.value);
        const expandedYValue =
            (expandedLabelHeight.value * (1 - FOLDED_LABEL_SCALE)) / 2 - expandedLabelHeight.value;
        return {
            transform: [
                {
                    translateX: interpolate(
                        expandingValue.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [0, -foldedX],
                    ),
                },
                {
                    translateY: interpolate(
                        expandingValue.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [0, expandedYValue],
                    ),
                },
                {
                    scale: interpolate(
                        expandingValue.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [1, FOLDED_LABEL_SCALE],
                    ),
                },
            ],
            opacity: labelOpacity.value,
        };
    });

    if (!validateChildren(children)) {
        return null;
    }
    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View style={labelContainerStyle}>
                <Label onLabelLayout={onLabelLayout} isHovered={isHovered} editable={editable}>
                    {children}
                </Label>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: UILayoutConstant.contentInsetVerticalX4,
    },
});