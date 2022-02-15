import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useHover } from '@tonlabs/uikit.controls';
import { UITextView, useFocused, useUITextViewValue } from '../UITextView';

import { useMaterialTextViewChildren } from './useMaterialTextViewChildren';

import { FloatingLabel, expandedLabelLineHeight, foldedLabelLineHeight } from './FloatingLabel';
import type { UIMaterialTextViewCommonProps, UIMaterialTextViewRef } from './types';
import { useExtendedRef } from './useExtendedRef';
import { useAutogrow } from './useAutogrow';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';
import { UIMaterialTextViewBorder } from './UIMaterialTextViewBorder';

const topOffsetForLabel: number =
    (expandedLabelLineHeight - foldedLabelLineHeight) / 2 + // space between input and folded label (by design mockups)
    foldedLabelLineHeight;

const getIsFolded = (
    isFocused: boolean,
    inputHasValue: boolean,
    value: string | undefined,
): boolean => {
    return Boolean(isFocused || inputHasValue || value);
};

function useFloatingLabelAttribute(props: UIMaterialTextViewCommonProps, inputHasValue: boolean) {
    const { value } = props;

    const { isFocused, onFocus, onBlur } = useFocused(props.onFocus, props.onBlur);

    const isLabelFolded: boolean = getIsFolded(isFocused, inputHasValue, value);

    const [isDefaultPlaceholderVisible, setDefaultPlaceholderVisible] =
        React.useState(isLabelFolded);

    const markDefaultPlacehoderAsVisible = React.useCallback(() => {
        setDefaultPlaceholderVisible(true);
    }, []);

    React.useEffect(() => {
        if (!isLabelFolded) {
            setDefaultPlaceholderVisible(false);
        }
    }, [isLabelFolded]);

    return {
        isFocused,
        onFocus,
        onBlur,
        isDefaultPlaceholderVisible,
        markDefaultPlacehoderAsVisible,
        isLabelFolded,
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
        isLabelFolded,
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

    return (
        <UIMaterialTextViewComment {...props}>
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: label ? topOffsetForLabel : 0,
                    },
                ]}
                onLayout={onLayout}
            >
                <UIMaterialTextViewBorder
                    {...props}
                    isFocused={isFocused}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    isHovered={isHovered}
                >
                    <UITextView
                        ref={ref}
                        {...rest}
                        placeholder={isDefaultPlaceholderVisible ? props.placeholder : undefined}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeTextProp}
                        onContentSizeChange={onContentSizeChange}
                        onChange={onChange}
                        numberOfLines={numberOfLines}
                        style={style}
                    />
                    <FloatingLabel
                        isFolded={isLabelFolded}
                        onFolded={markDefaultPlacehoderAsVisible}
                    >
                        {label}
                    </FloatingLabel>
                    {processedChildren}
                </UIMaterialTextViewBorder>
            </View>
        </UIMaterialTextViewComment>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
});
