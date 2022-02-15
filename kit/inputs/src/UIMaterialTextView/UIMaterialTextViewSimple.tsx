import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useHover } from '@tonlabs/uikit.controls';
import { UITextView, useFocused, useUITextViewValue } from '../UITextView';

import { useMaterialTextViewChildren } from './useMaterialTextViewChildren';
import type { UIMaterialTextViewCommonProps, UIMaterialTextViewRef } from './types';
import { useExtendedRef } from './useExtendedRef';
import { useAutogrow } from './useAutogrow';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';
import { UIMaterialTextViewBackground } from './UIMaterialTextViewBackground';

export const UIMaterialTextViewSimple = React.forwardRef<
    UIMaterialTextViewRef,
    UIMaterialTextViewCommonProps
>(function UIMaterialTextViewSimpleForwarded(props: UIMaterialTextViewCommonProps, passedRef) {
    const { label, onLayout, children, onHeightChange, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const {
        inputHasValue,
        clear: clearInput,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    useExtendedRef(passedRef, ref, props, onChangeTextProp);
    const { isFocused, onFocus, onBlur } = useFocused(props.onFocus, props.onBlur);
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
            <View style={styles.container} onLayout={onLayout}>
                <UIMaterialTextViewBackground
                    {...props}
                    // isFocused={isFocused}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    // isHovered={isHovered}
                >
                    <UITextView
                        ref={ref}
                        {...rest}
                        placeholder={label}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeTextProp}
                        onContentSizeChange={onContentSizeChange}
                        onChange={onChange}
                        numberOfLines={numberOfLines}
                        style={style}
                    />
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
});
