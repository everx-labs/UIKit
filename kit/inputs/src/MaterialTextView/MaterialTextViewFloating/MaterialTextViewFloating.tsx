import * as React from 'react';
import { ColorValue, Platform, TextStyle, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles } from '@tonlabs/uikit.themes';

import { UITextView, UITextViewRef } from '../../UITextView';
import { FloatingLabel } from './FloatingLabel';
import type { MaterialTextViewLayoutProps } from '../types';
import { MaterialTextViewComment } from '../MaterialTextViewComment';
import { useExpandingValue, usePlaceholderVisibility } from './hooks';
import { InputColorScheme, useInputBackgroundColor } from '../../Common';
import { usePlaceholderColors } from '../hooks';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

/**
 * Expanded position vertical offset of the Label
 * It was calculated as (UILayoutConstant.contentOffset - UILayoutConstant.contentInsetVerticalX2)
 */
// @inline
const EXPANDED_INPUT_OFFSET: number = 8;

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const MaterialTextViewFloating = React.forwardRef<
    UITextViewRef,
    MaterialTextViewLayoutProps
>(function MaterialTextViewFloatingForwarded(props: MaterialTextViewLayoutProps, ref) {
    const {
        label = 'Input',
        children,
        onMouseEnter,
        onMouseLeave,
        borderViewRef,
        isHovered,
        hasValue,
        isFocused,
        colorScheme = InputColorScheme.Default,
        ...rest
    } = props;
    const { editable = true, font } = rest;
    const isExpanded = useDerivedValue(() => isFocused.value || hasValue.value);

    const { isPlaceholderVisible, showPlacehoder } = usePlaceholderVisibility(isExpanded);

    const expandingValue: Readonly<Animated.SharedValue<number>> = useExpandingValue(
        isExpanded,
        showPlacehoder,
    );

    const inputStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        expandingValue.value,
                        [POSITION_FOLDED, POSITION_EXPANDED],
                        [0, EXPANDED_INPUT_OFFSET],
                    ),
                },
            ],
        };
    });

    const hasChildren = React.useMemo(() => {
        return React.Children.count(children) > 0;
    }, [children]);

    const backgroundColor = useInputBackgroundColor(colorScheme, editable);
    const styles = useStyles(editable, backgroundColor, hasChildren);

    const placeholderColors = usePlaceholderColors(colorScheme);
    const placeholderTextColor = React.useMemo(() => {
        if (!isPlaceholderVisible) {
            return placeholderColors.transparent;
        }
        return isHovered && editable ? placeholderColors.hover : placeholderColors.default;
    }, [isPlaceholderVisible, isHovered, editable, placeholderColors]);

    return (
        <MaterialTextViewComment {...props}>
            <View
                style={styles.container}
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={borderViewRef}
            >
                <Animated.View style={[styles.inputContainer, inputStyle]} /* layout={Layout} */>
                    <UITextViewAnimated
                        ref={ref}
                        {...rest}
                        placeholder={props.placeholder}
                        placeholderTextColor={placeholderTextColor}
                        style={styles.input}
                    />
                    <FloatingLabel
                        expandingValue={expandingValue}
                        isHovered={isHovered}
                        editable={editable}
                        colorScheme={colorScheme}
                        font={font}
                    >
                        {label}
                    </FloatingLabel>
                </Animated.View>
                {children}
            </View>
        </MaterialTextViewComment>
    );
});

const useStyles = makeStyles(
    (editable: boolean, backgroundColor: ColorValue, hasChildren: boolean) => ({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: UILayoutConstant.input.borderRadius,
            backgroundColor,
            paddingLeft: UILayoutConstant.contentOffset,
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: UILayoutConstant.contentInsetVerticalX4,
            paddingRight: hasChildren
                ? UILayoutConstant.smallContentOffset
                : UILayoutConstant.contentOffset,
        },
        input: {
            ...Platform.select({
                web: {
                    ...(!editable ? ({ cursor: 'default' } as TextStyle) : null),
                },
            }),
        },
    }),
);
