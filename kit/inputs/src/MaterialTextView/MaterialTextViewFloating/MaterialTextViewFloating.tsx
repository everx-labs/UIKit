import * as React from 'react';
import { Platform, TextStyle, View } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { UITextView, UITextViewRef } from '../../UITextView';
import { FloatingLabel } from './FloatingLabel';
import {
    BackgroundColors,
    MaterialTextViewColorScheme,
    MaterialTextViewLayoutProps,
} from '../types';
import { MaterialTextViewComment } from '../MaterialTextViewComment';
import { useExpandingValue, usePlaceholderVisibility } from './hooks';
import { defaultBackgroundColors } from '../constants';

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
        backgroundColors = defaultBackgroundColors,
        colorScheme = MaterialTextViewColorScheme.Default,
        ...rest
    } = props;
    const { editable = true } = rest;
    const theme = useTheme();

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

    const styles = useStyles(theme, editable, backgroundColors);

    const placeholderTextColor = React.useMemo(() => {
        if (!isPlaceholderVisible) {
            return ColorVariants.Transparent;
        }
        return isHovered && editable ? ColorVariants.TextSecondary : ColorVariants.TextTertiary;
    }, [isPlaceholderVisible, isHovered, editable]);

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
    (theme: Theme, editable: boolean, backgroundColors: BackgroundColors) => ({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: UILayoutConstant.input.borderRadius,
            backgroundColor: editable
                ? theme[backgroundColors.regular]
                : theme[backgroundColors.disabled],
            paddingHorizontal: UILayoutConstant.contentOffset,
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: UILayoutConstant.contentInsetVerticalX4,
            paddingRight: UILayoutConstant.smallContentOffset,
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
