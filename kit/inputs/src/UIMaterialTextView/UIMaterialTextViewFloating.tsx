import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useHover } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { UITextView, useFocused, useUITextViewValue } from '../UITextView';

import { useMaterialTextViewChildren } from './useMaterialTextViewChildren';

import { FloatingLabel } from './FloatingLabel';
import type { UIMaterialTextViewCommonProps, UIMaterialTextViewRef } from './types';
import { useExtendedRef } from './useExtendedRef';
import { useAutogrow } from './useAutogrow';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';
import { UIMaterialTextViewBackground } from './UIMaterialTextViewBackground';
import { useExpandingValue } from './useExpandingValue';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

// EXPANDED_INPUT_OFFSET = UILayoutConstant.contentOffset - UILayoutConstant.contentInsetVerticalX2
// @inline
const EXPANDED_INPUT_OFFSET: number = 8;

const getIsExpanded = (isFocused: boolean, inputHasValue: boolean): boolean => {
    return isFocused || inputHasValue;
};

function useFloatingLabelAttribute(props: UIMaterialTextViewCommonProps, inputHasValue: boolean) {
    const { onFocus: onFocusProp, onBlur: onBlurProp } = props;

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
    UIMaterialTextViewCommonProps
>(function UIMaterialTextViewFloatingForwarded(props: UIMaterialTextViewCommonProps, passedRef) {
    const { label, onLayout, children, onHeightChange, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const {
        inputHasValue,
        clear: clearInput,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    useExtendedRef(passedRef, ref, props, onChangeTextProp);
    const {
        isFocused,
        onFocus,
        onBlur,
        isDefaultPlaceholderVisible,
        markDefaultPlacehoderAsVisible,
        isExpanded,
    } = useFloatingLabelAttribute(props, inputHasValue);
    const { onContentSizeChange, onChange, numberOfLines, style, resetInputHeight } = useAutogrow(
        ref,
        props,
        onHeightChange,
    );
    const clear = React.useCallback(() => {
        clearInput();
        resetInputHeight();
    }, [clearInput, resetInputHeight]);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
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
            flex: 1,
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

    return (
        <UIMaterialTextViewComment {...props}>
            <View style={[styles.container]} onLayout={onLayout}>
                <UIMaterialTextViewBackground
                    {...props}
                    // isFocused={isFocused}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    // isHovered={isHovered}
                >
                    <Animated.View style={inputStyle}>
                        <UITextView
                            ref={ref}
                            {...rest}
                            placeholder={
                                isDefaultPlaceholderVisible ? props.placeholder : undefined
                            }
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChangeText={onChangeTextProp}
                            onContentSizeChange={onContentSizeChange}
                            onChange={onChange}
                            numberOfLines={numberOfLines}
                            style={[styles.input, style]}
                        />
                        <FloatingLabel expandingValue={expandingValue}>{label}</FloatingLabel>
                    </Animated.View>
                    {processedChildren}
                </UIMaterialTextViewBackground>
            </View>
        </UIMaterialTextViewComment>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    input: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingLeft: UILayoutConstant.contentOffset,
    },
});
