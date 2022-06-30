import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
} from 'react-native-reanimated';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useHover } from '@tonlabs/uikit.controls';
import { ColorVariants, useColorParts } from '@tonlabs/uikit.themes';
import type { ContainerProps } from './types';
import * as Columns from './Columns';
import { useCheckChildren } from './hooks';
import { ActionCell, CancelCell } from './Cells';
import { PrimaryColumn } from './Columns';

function checkIsPrimaryActionEnabled(children: ContainerProps['children']) {
    const primaryColumn = React.Children.toArray(children).find(child => {
        return React.isValidElement(child) && child.type === PrimaryColumn;
    });
    if (!primaryColumn || !React.isValidElement(primaryColumn)) {
        return false;
    }
    if (primaryColumn.props.onPress) {
        return !primaryColumn.props.disabled;
    }

    const actionCell = React.Children.toArray(primaryColumn.props.children).find(child => {
        return (
            React.isValidElement(child) && (child.type === ActionCell || child.type === CancelCell)
        );
    });
    if (!actionCell || !React.isValidElement(actionCell)) {
        return false;
    }

    return !actionCell.props.disabled && actionCell.props.onPress;
}

export function Container({ children, id }: ContainerProps) {
    const isPrimaryActionEnabled = checkIsPrimaryActionEnabled(children);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
    const isHoveredAnimated = useDerivedValue(() => {
        return withSpring(isHovered ? 1 : 0);
    }, [isHovered]);
    const colorParts = useColorParts(ColorVariants.BackgroundSecondary);
    const colors = React.useMemo(() => {
        return {
            defaultColor: `rgba(${colorParts.colorParts}, ${0})`,
            hoveredColor: `rgba(${colorParts.colorParts}, ${colorParts.opacity})`,
        };
    }, [colorParts]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                isHoveredAnimated.value,
                [0, 1],
                [colors.defaultColor, colors.hoveredColor],
            ),
        };
    }, [colors]);

    const isValid = useCheckChildren(
        children,
        Columns,
        `'Container' can only contain 'Column' components as its direct children`,
    );
    if (!isValid) {
        return null;
    }
    return (
        <Animated.View
            key={id}
            style={[styles.container, animatedStyle]}
            // @ts-expect-error
            onMouseEnter={isPrimaryActionEnabled ? onMouseEnter : undefined}
            onMouseLeave={isPrimaryActionEnabled ? onMouseLeave : undefined}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        /**
         * The negative horizontal margin is used to set the horizontal padding of all child elements
         * and not to think about the presence of an element on the left or right side.
         */
        marginHorizontal: -UILayoutConstant.contentOffset,
        paddingHorizontal:
            UILayoutConstant.contentOffset / 2 +
            (UILayoutConstant.contentOffset - UILayoutConstant.normalContentOffset) / 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
