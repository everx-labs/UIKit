import * as React from 'react';
import { TextInput, View } from 'react-native';

import { useHover } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated, { Layout } from 'react-native-reanimated';
import { UITextView, useFocused, useUITextViewValue } from '../UITextView';

import { useMaterialTextViewChildren } from './useMaterialTextViewChildren';

import type { UIMaterialTextViewProps, UIMaterialTextViewRef } from './types';
import { useExtendedRef } from './useExtendedRef';
import { useAutogrow } from './useAutogrow';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const UIMaterialTextViewSimple = React.forwardRef<
    UIMaterialTextViewRef,
    UIMaterialTextViewProps
>(function UIMaterialTextViewSimpleForwarded(props: UIMaterialTextViewProps, passedRef) {
    const { onLayout, children, onHeightChange, borderViewRef, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const theme = useTheme();
    const {
        inputHasValue,
        clear: clearInput,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    useExtendedRef(passedRef, ref, props.multiline, onChangeTextProp);
    const { isFocused, onFocus, onBlur } = useFocused(props.onFocus, props.onBlur);
    const { onContentSizeChange, onChange, numberOfLines, style, resetInputHeight } = useAutogrow(
        ref,
        props.onContentSizeChange,
        props.onChange,
        props.multiline,
        props.numberOfLines,
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
                <Animated.View style={styles.input} layout={Layout}>
                    <UITextViewAnimated
                        ref={ref}
                        {...rest}
                        placeholder={props.placeholder}
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
                        layout={Layout}
                        scrollEnabled={false}
                    />
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
