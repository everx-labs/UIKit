import * as React from 'react';
import {
    LayoutChangeEvent,
    StyleSheet,
    View,
    TextStyle,
    ViewStyle,
    StyleProp,
    ColorValue,
} from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { Typography, TypographyVariants, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { withSpringConfig } from './constants';
import type { UIAmountInputProps } from './types';
import type { InputFont } from '../Common';
import { useLabelRoles } from './hooks';

export type FloatingLabelProps = Pick<UIAmountInputProps, 'editable'> & {
    /** Text content of the label */
    children: string | undefined;
    /**
     * It smoothly changes from 0 to 1. It affects on the label position.
     * 0 - folded position (default position in the center vertically,
     * the place matches the main content place)
     * 1 - expanded position (position above the main content place)
     */
    expandingValue: Readonly<Animated.SharedValue<number>>;
    isHovered: SharedValue<boolean>;
    /**
     * Edge colors of the states. It's static.
     */
    colors: Readonly<
        Animated.SharedValue<{
            transparent: string;
            hover: string;
            default: string;
        }>
    >;
    font?: InputFont;
};

function useFoldedLabelScale(
    role: TypographyVariants,
    foldedLabelRole: TypographyVariants,
): Readonly<Animated.SharedValue<number>> {
    const { expandedLabelLineHeight, foldedLabelLineHeight } = React.useMemo(() => {
        const paragraphTextStyle: TextStyle = StyleSheet.flatten(Typography[role]);
        const labelTextStyle: TextStyle = StyleSheet.flatten(Typography[foldedLabelRole]);
        return {
            expandedLabelLineHeight: paragraphTextStyle.lineHeight
                ? paragraphTextStyle.lineHeight
                : 24,
            foldedLabelLineHeight: labelTextStyle.lineHeight ? labelTextStyle.lineHeight : 16,
        };
    }, [foldedLabelRole, role]);
    return useDerivedValue(
        () => foldedLabelLineHeight / expandedLabelLineHeight,
        [foldedLabelLineHeight, expandedLabelLineHeight],
    );
}

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

type LabelProps = Pick<FloatingLabelProps, 'children' | 'isHovered' | 'colors' | 'editable'> & {
    onLabelLayout: (layoutChangeEvent: LayoutChangeEvent) => void;
    role?: TypographyVariants;
};
function Label({ children, onLabelLayout, isHovered, editable, colors, role }: LabelProps) {
    const toColor = useDerivedValue(() => {
        return isHovered.value && editable ? colors.value.hover : colors.value.default;
    }, [editable]);

    const animatedProps = useAnimatedProps(() => {
        return {
            color: withSpring(toColor.value, withSpringConfig) as any as ColorValue,
        };
    });
    return (
        <UILabelAnimated
            animatedProps={animatedProps}
            role={role}
            onLayout={onLabelLayout}
            numberOfLines={1}
            lineBreakMode="tail"
        >
            {children}
        </UILabelAnimated>
    );
}

function getFoldedX(
    width: number,
    foldedLabelScale: Readonly<Animated.SharedValue<number>>,
): number {
    'worklet';

    return (width * (1 - foldedLabelScale.value)) / 2 - LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE / 2;
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
    colors,
    font,
}: FloatingLabelProps) {
    /** Dimensions of label in the expanded state */
    const expandedLabelWidth: Animated.SharedValue<number> = useSharedValue<number>(0);
    const expandedLabelHeight: Animated.SharedValue<number> = useSharedValue<number>(0);

    const onLabelLayout = useOnLabelLayout(expandedLabelWidth, expandedLabelHeight);

    const labelOpacity: Animated.SharedValue<number> = useDerivedValue<number>(() => {
        return expandedLabelWidth.value && expandedLabelHeight.value ? 1 : 0;
    });

    const { floatingLabelExpandedRole, floatingLabelFoldedRole } = useLabelRoles(font);

    const foldedLabelScale = useFoldedLabelScale(
        floatingLabelExpandedRole,
        floatingLabelFoldedRole,
    );

    const labelContainerStyle: StyleProp<ViewStyle> = useAnimatedStyle(() => {
        const foldedX: number = getFoldedX(expandedLabelWidth.value, foldedLabelScale);
        const expandedYValue =
            (expandedLabelHeight.value * (1 - foldedLabelScale.value)) / 2 -
            expandedLabelHeight.value;
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
                        [1, foldedLabelScale.value],
                    ),
                },
            ],
            opacity: labelOpacity.value,
        };
    });

    if (!children || !validateChildren(children)) {
        return null;
    }
    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View style={labelContainerStyle}>
                <Label
                    onLabelLayout={onLabelLayout}
                    isHovered={isHovered}
                    editable={editable}
                    colors={colors}
                    role={floatingLabelExpandedRole}
                >
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
