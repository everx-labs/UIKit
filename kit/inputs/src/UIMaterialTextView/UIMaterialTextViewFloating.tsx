import * as React from 'react';
import { TextInput, View } from 'react-native';

import { useHover } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated, { interpolate, useAnimatedStyle /* , Layout */ } from 'react-native-reanimated';
import { UITextView, useFocused, useUITextViewValue } from '../UITextView';

import { useMaterialTextViewChildren } from './useMaterialTextViewChildren';

import { FloatingLabel } from './FloatingLabel';
import type { UIMaterialTextViewProps, UIMaterialTextViewRef } from './types';
import { useExtendedRef } from './useExtendedRef';
import { useAutogrow } from './useAutogrow';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';
import { useExpandingValue } from './useExpandingValue';

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

function useFloatingLabelAttribute(
    onFocusProp: UIMaterialTextViewProps['onFocus'],
    onBlurProp: UIMaterialTextViewProps['onBlur'],
    inputHasValue: boolean,
) {
    const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);

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
        isFocused,
        onFocus,
        onBlur,
        isDefaultPlaceholderVisible,
        markDefaultPlacehoderAsVisible,
        isExpanded,
    };
}

export const UIMaterialTextViewFloating = React.forwardRef<
    UIMaterialTextViewRef,
    UIMaterialTextViewProps
>(function UIMaterialTextViewFloatingForwarded(props: UIMaterialTextViewProps, passedRef) {
    const { label = '', onLayout, children, onHeightChange, borderViewRef, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const theme = useTheme();
    const {
        inputHasValue,
        clear: clearInput,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    useExtendedRef(passedRef, ref, props.multiline, onChangeTextProp);
    const {
        isFocused,
        onFocus,
        onBlur,
        isDefaultPlaceholderVisible,
        markDefaultPlacehoderAsVisible,
        isExpanded,
    } = useFloatingLabelAttribute(props.onFocus, props.onBlur, inputHasValue);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
    const { onContentSizeChange, onChange, numberOfLines, style, resetInputHeight } = useAutogrow(
        ref,
        props.onContentSizeChange,
        props.onChange,
        props.multiline,
        props.numberOfLines,
        onHeightChange,
        isHovered,
    );
    const clear = React.useCallback(() => {
        clearInput();
        resetInputHeight();
    }, [clearInput, resetInputHeight]);
    const processedChildren = useMaterialTextViewChildren(
        children,
        inputHasValue,
        isFocused,
        isHovered,
        clear,
    );

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
                <Animated.View style={[styles.input, inputStyle]} /* layout={Layout} */>
                    <UITextViewAnimated
                        ref={ref}
                        {...rest}
                        placeholder={isDefaultPlaceholderVisible ? props.placeholder : undefined}
                        placeholderTextColor={
                            isHovered ? ColorVariants.TextSecondary : ColorVariants.TextTertiary
                        }
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeTextProp}
                        onContentSizeChange={onContentSizeChange}
                        onChange={onChange}
                        numberOfLines={numberOfLines}
                        style={style}
                        // layout={Layout}
                        scrollEnabled={false}
                    />
                    <FloatingLabel expandingValue={expandingValue} isHovered={isHovered}>
                        {label}
                    </FloatingLabel>
                </Animated.View>
                {processedChildren}
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
