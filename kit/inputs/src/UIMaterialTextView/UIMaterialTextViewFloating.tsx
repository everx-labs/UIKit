import * as React from 'react';
import { TextInput, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated, { interpolate, useAnimatedStyle, Layout } from 'react-native-reanimated';
import { UITextView } from '../UITextView';
import { FloatingLabel } from './FloatingLabel';
import type { UIMaterialTextViewLayoutProps } from './types';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';
import { useExpandingValue } from './hooks';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

// EXPANDED_INPUT_OFFSET = UILayoutConstant.contentOffset - UILayoutConstant.contentInsetVerticalX2
// @inline
const EXPANDED_INPUT_OFFSET: number = 8;

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

const getIsExpanded = (isFocused: boolean, inputHasValue: boolean): boolean => {
    return isFocused || inputHasValue;
};

function useFloatingLabelAttribute(isFocused: boolean, inputHasValue: boolean) {
    const isExpanded: boolean = getIsExpanded(isFocused, inputHasValue);

    const [isDefaultPlaceholderVisible, setDefaultPlaceholderVisible] = React.useState(isExpanded);

    const markDefaultPlacehoderAsVisible = React.useCallback(() => {
        setDefaultPlaceholderVisible(true);
    }, []);

    React.useEffect(() => {
        if (!isExpanded) {
            setDefaultPlaceholderVisible(false);
        }
    }, [isExpanded]);

    return {
        isDefaultPlaceholderVisible,
        markDefaultPlacehoderAsVisible,
        isExpanded,
    };
}

export const UIMaterialTextViewFloating = React.forwardRef<
    TextInput,
    UIMaterialTextViewLayoutProps
>(function UIMaterialTextViewFloatingForwarded(props: UIMaterialTextViewLayoutProps, ref) {
    const {
        label = '',
        onLayout,
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

    const { isDefaultPlaceholderVisible, markDefaultPlacehoderAsVisible, isExpanded } =
        useFloatingLabelAttribute(isFocused, inputHasValue);

    const expandingValue: Readonly<Animated.SharedValue<number>> = useExpandingValue(
        isExpanded,
        markDefaultPlacehoderAsVisible,
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

    return (
        <UIMaterialTextViewComment {...props}>
            <View
                style={styles.container}
                onLayout={onLayout}
                // @ts-expect-error
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={borderViewRef}
            >
                <Animated.View style={[styles.input, inputStyle]} layout={Layout}>
                    <UITextViewAnimated
                        ref={ref}
                        {...rest}
                        placeholder={isDefaultPlaceholderVisible ? props.placeholder : undefined}
                        placeholderTextColor={
                            isHovered ? ColorVariants.TextSecondary : ColorVariants.TextTertiary
                        }
                        layout={Layout}
                        scrollEnabled={false}
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
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.smallContentOffset,
    },
}));
