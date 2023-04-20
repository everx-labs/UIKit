import * as React from 'react';
import {
    LayoutChangeEvent,
    StyleSheet,
    View,
    TextStyle,
    ViewStyle,
    StyleProp,
    I18nManager,
} from 'react-native';
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { ColorVariants, Typography, TypographyVariants, UILabel } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { InputColorScheme, InputFont } from '../../Common';
import { useFloatingLabelRoles } from './hooks';

export type FloatingLabelProps = {
    children: string;
    expandingValue: Readonly<Animated.SharedValue<number>>;
    isHovered: boolean;
    editable: boolean;
    colorScheme: InputColorScheme;
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

type LabelProps = {
    children: string;
    onLabelLayout: (layoutChangeEvent: LayoutChangeEvent) => void;
    isHovered: boolean;
    editable: boolean;
    colorScheme: InputColorScheme;
    role?: TypographyVariants;
};
function Label({ children, onLabelLayout, isHovered, editable, colorScheme, role }: LabelProps) {
    const color = React.useMemo(() => {
        switch (colorScheme) {
            case InputColorScheme.Secondary:
                return isHovered && editable ? ColorVariants.TextBW : ColorVariants.TextSecondary;
            case InputColorScheme.Default:
            default:
                return isHovered && editable
                    ? ColorVariants.TextSecondary
                    : ColorVariants.TextTertiary;
        }
    }, [colorScheme, editable, isHovered]);
    return (
        <UILabel
            role={role}
            color={color}
            onLayout={onLabelLayout}
            numberOfLines={1}
            lineBreakMode="tail"
        >
            {children}
        </UILabel>
    );
}

function getFoldedX(
    width: number,
    isRTLShared: SharedValue<boolean>,
    foldedLabelScale: Readonly<Animated.SharedValue<number>>,
): number {
    'worklet';

    const xOffset =
        (width * (1 - foldedLabelScale.value)) / 2 - LEFT_OFFSET_OF_UI_LABEL_TEXT_FROM_EDGE / 2;
    return isRTLShared.value ? -xOffset : xOffset;
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
    colorScheme,
    font,
}: FloatingLabelProps) {
    /** Dimensions of label in the expanded state */
    const expandedLabelWidth: Animated.SharedValue<number> = useSharedValue<number>(0);
    const expandedLabelHeight: Animated.SharedValue<number> = useSharedValue<number>(0);

    const onLabelLayout = useOnLabelLayout(expandedLabelWidth, expandedLabelHeight);

    const labelOpacity: Animated.SharedValue<number> = useDerivedValue<number>(() => {
        return expandedLabelWidth.value && expandedLabelHeight.value ? 1 : 0;
    });

    const isRTLShared = useSharedValue(I18nManager.getConstants().isRTL);

    const { expandedLabelRole, foldedLabelRole } = useFloatingLabelRoles(font);
    const foldedLabelScale = useFoldedLabelScale(expandedLabelRole, foldedLabelRole);

    const labelContainerStyle: StyleProp<ViewStyle> = useAnimatedStyle(() => {
        const foldedX: number = getFoldedX(expandedLabelWidth.value, isRTLShared, foldedLabelScale);
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

    if (!validateChildren(children)) {
        return null;
    }
    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View style={labelContainerStyle}>
                <Label
                    onLabelLayout={onLabelLayout}
                    isHovered={isHovered}
                    editable={editable}
                    colorScheme={colorScheme}
                    role={expandedLabelRole}
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
