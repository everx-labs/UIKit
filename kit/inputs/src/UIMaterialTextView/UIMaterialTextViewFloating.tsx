import * as React from 'react';
import {
    NativeSyntheticEvent,
    Platform,
    TextInput,
    TextInputChangeEventData,
    View,
} from 'react-native';

import { useHover, addNativeProps } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated, {
    interpolate,
    useAnimatedStyle,
    Layout,
    useAnimatedProps,
    useSharedValue,
    runOnJS,
    runOnUI,
    useWorkletCallback,
    useAnimatedReaction,
    useAnimatedRef,
    useEvent,
    useHandler,
    useAnimatedScrollHandler,
    withDelay,
} from 'react-native-reanimated';
import {} from 'react-native-redash';
import { TextInput as TextInputGH, TapGestureHandler } from 'react-native-gesture-handler';
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

Animated.addWhitelistedNativeProps({
    text: true,
    value: true,
    defaultValue: true,
    'default-value': true,
});

const UITextViewAnimated = Animated.createAnimatedComponent(
    addNativeProps(UITextView, {
        text: true,
        /**
         * Used for web
         */
        value: true,
    }),
);

// const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

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
    const { label, onLayout, children, onHeightChange, borderViewRef, value, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const theme = useTheme();
    const {
        inputHasValue,
        clear: clearInput,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    const {
        isFocused,
        onFocus,
        onBlur,
        isDefaultPlaceholderVisible,
        markDefaultPlacehoderAsVisible,
        isExpanded,
    } = useFloatingLabelAttribute(props.onFocus, props.onBlur, inputHasValue);
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

    const imperativeText = useSharedValue('');

    // React.useEffect(() => {
    //     if (value) {
    //         imperativeText.value = value;
    //     }
    // }, [value, imperativeText]);

    // useAnimatedReaction(
    //     () => ({
    //         imperativeText: imperativeText.value,
    //     }),
    //     (nextState, prevState) => {
    //         if (nextState.imperativeText !== prevState?.imperativeText) {
    //             console.log(nextState.imperativeText);
    //             // console.log(ref.current);
    //             // ref.current?.setNativeProps?.({
    //             //     text: nextState.imperativeText,
    //             // });
    //         }
    //     },
    // );

    const runUIChangeText = useWorkletCallback(
        function runUIChangeText(text: string) {
            const formattedText = text
                .split('')
                .filter(c => c !== '-')
                .join('-');
            imperativeText.value = formattedText;

            runOnJS(onChangeTextProp)(formattedText);
        },
        [onChangeTextProp],
    );

    function onChangeText(text: string) {
        runOnUI(runUIChangeText)(text);
    }

    useExtendedRef(passedRef, ref, props.multiline, onChangeTextProp, imperativeText);

    const animatedProps = useAnimatedProps(() => {
        console.log('animatedProps', imperativeText.value);
        if (Platform.OS === 'web') {
            return {
                // ????
                // text: imperativeText.value,
                // value: imperativeText.value,
                // defaultValue: imperativeText.value,
                // 'default-value': imperativeText.value,
            };
        }
        return {
            text: imperativeText.value,
            // value: imperativeText.value,
            // defaultValue: imperativeText.value,
            // 'default-value': imperativeText.value,
        };
    });

    // const handlers = {
    //     onChange: () => {
    //         'worklet';

    //         console.log('onChange');
    //     },
    // };

    // const { context, doDependenciesDiffer } = useHandler(handlers);

    const event = useEvent(
        () => {
            'worklet';

            console.log('event');
            // handlers.onChange();
        },
        // ['textInput', 'onChange', 'onChangeText', 'change', 'changeText'],
        ['onTextInput'],
    );

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
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeText}
                        onContentSizeChange={onContentSizeChange}
                        onChange={event}
                        onTextInput={event}
                        onKeyPress={event}
                        numberOfLines={numberOfLines}
                        style={style}
                        layout={Layout}
                        scrollEnabled={false}
                        // @ts-expect-error
                        animatedProps={animatedProps}
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
