import * as React from 'react';
import { View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated, { interpolate, useAnimatedStyle /* , Layout */ } from 'react-native-reanimated';
import { UITextView, UITextViewRef } from '../../UITextView';
import { FloatingLabel } from './FloatingLabel';
import type { UIMaterialTextViewLayoutProps } from '../types';
import { UIMaterialTextViewComment } from '../UIMaterialTextViewComment';
import { useExpandingValue, usePlaceholderVisibility } from './hooks';

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

export const UIMaterialTextViewFloating = React.forwardRef<
    UITextViewRef,
    UIMaterialTextViewLayoutProps
>(function UIMaterialTextViewFloatingForwarded(props: UIMaterialTextViewLayoutProps, ref) {
    const {
        label = 'Input',
        children,
        onMouseEnter,
        onMouseLeave,
        borderViewRef,
        isHovered,
        inputHasValue,
        isFocused,
        ...rest
    } = props;
    const theme = useTheme();

    const isExpanded = React.useMemo(() => isFocused || inputHasValue, [isFocused, inputHasValue]);
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

    const styles = useStyles(theme);

    const placeholderTextColor = React.useMemo(() => {
        if (!isPlaceholderVisible) {
            return ColorVariants.Transparent;
        }
        return isHovered ? ColorVariants.TextSecondary : ColorVariants.TextTertiary;
    }, [isPlaceholderVisible, isHovered]);

    return (
        <UIMaterialTextViewComment {...props}>
            <View
                style={styles.container}
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={borderViewRef}
            >
                <Animated.View style={[styles.input, inputStyle]} /* layout={Layout} */>
                    <UITextView
                        ref={ref}
                        {...rest}
                        placeholder={props.placeholder}
                        placeholderTextColor={placeholderTextColor}
                    />
                    <FloatingLabel expandingValue={expandingValue} isHovered={isHovered}>
                        {label}
                    </FloatingLabel>
                </Animated.View>
                {children}
            </View>
        </UIMaterialTextViewComment>
    );
});

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundBW],
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    input: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.smallContentOffset,
    },
}));
