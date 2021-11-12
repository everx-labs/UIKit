import * as React from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    Platform,
} from 'react-native';

import { ColorVariants, useTheme, UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { useHover } from '@tonlabs/uikit.controls';
import { UITextView, UITextViewProps, useFocused, useUITextViewValue } from '../UITextView';
import {
    calculateWebInputHeight,
    OnHeightChange,
    useAutogrowTextView,
} from '../useAutogrowTextView';

import {
    useMaterialTextViewChildren,
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';

import { FloatingLabel, expandedLabelLineHeight, foldedLabelLineHeight } from './FloatingLabel';

const topOffsetForLabel: number =
    (expandedLabelLineHeight - foldedLabelLineHeight) / 2 + // space between input and folded label (by design mockups)
    foldedLabelLineHeight;

export type UIMaterialTextViewCommonProps = UITextViewProps & {
    label: string;
    helperText?: string;
    error?: boolean;
    success?: boolean;
    onLayout?: Pick<UITextViewProps, 'onLayout'>;
    borderViewRef?: React.Ref<View>;
    children?: React.ReactNode;
    onHeightChange?: OnHeightChange;
};

const getBorderColor = (
    props: UIMaterialTextViewCommonProps,
    isFocused: boolean,
    isHovered: boolean,
): ColorVariants => {
    if (props.success) {
        return ColorVariants.Transparent;
    }
    if (props.error) {
        return ColorVariants.LineNegative;
    }
    if (isFocused) {
        return ColorVariants.LineAccent;
    }
    if (isHovered) {
        return ColorVariants.LineNeutral;
    }
    return ColorVariants.LineSecondary;
};

const getCommentColor = (props: UIMaterialTextViewCommonProps): ColorVariants => {
    if (props.success) {
        return ColorVariants.TextPositive;
    }
    if (props.error) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextSecondary;
};

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

function useAutogrow(
    ref: React.Ref<TextInput>,
    props: UIMaterialTextViewProps,
    onHeightChange?: OnHeightChange,
) {
    const {
        onContentSizeChange: onContentSizeChangeProp,
        onChange: onChangeProp,
        multiline,
        numberOfLines,
    } = props;
    const {
        onContentSizeChange: onAutogrowContentSizeChange,
        onChange: onAutogrowChange,
        inputHeight,
        numberOfLinesProp,
        resetInputHeight,
    } = useAutogrowTextView(ref, onHeightChange, multiline ? numberOfLines : 1);

    const onContentSizeChange = React.useCallback(
        (event: any) => {
            if (onAutogrowContentSizeChange) {
                onAutogrowContentSizeChange(event);
            }

            if (onContentSizeChangeProp) {
                onContentSizeChangeProp(event);
            }
        },
        [onAutogrowContentSizeChange, onContentSizeChangeProp],
    );

    const onChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            if (onAutogrowChange) {
                onAutogrowChange(event);
            }

            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [onAutogrowChange, onChangeProp],
    );

    const style = React.useMemo(() => [styles.input, { height: inputHeight }], [inputHeight]);

    if (!props.multiline) {
        return {
            onContentSizeChange: onContentSizeChangeProp,
            onChange: onChangeProp,
            resetInputHeight,
            numberOfLines,
            style: styles.input,
        };
    }

    return {
        onContentSizeChange,
        onChange,
        resetInputHeight,
        numberOfLines: numberOfLinesProp,
        style,
    };
}

function UIMaterialTextViewComment(
    props: UIMaterialTextViewCommonProps & {
        onLayout?: Pick<UITextViewProps, 'onLayout'>;
        children: React.ReactNode;
    },
) {
    const { helperText, onLayout, children } = props;

    if (!helperText) {
        return (
            <View style={styles.withoutCommentContainer} onLayout={onLayout}>
                {children}
            </View>
        );
    }

    return (
        <View style={styles.withCommentContainer} onLayout={onLayout}>
            {children}
            <UILabel
                role={TypographyVariants.ParagraphNote}
                color={getCommentColor(props)}
                style={styles.comment}
            >
                {helperText}
            </UILabel>
        </View>
    );
}

function UIMaterialTextViewBorder(
    props: UIMaterialTextViewCommonProps & {
        isFocused: boolean;
        children: React.ReactNode;
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        isHovered: boolean;
    },
) {
    const theme = useTheme();

    return (
        <View
            ref={props.borderViewRef}
            // @ts-expect-error
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            style={[
                styles.inputWrapper,
                {
                    borderBottomColor:
                        theme[getBorderColor(props, props.isFocused, props.isHovered)],
                },
            ]}
        >
            {props.children}
        </View>
    );
}

export type UIMaterialTextViewRef = TextInput & {
    changeText: (text: string, callOnChangeProp?: boolean) => void;
};

function useExtendedRef(
    forwardedRed: React.Ref<UIMaterialTextViewRef>,
    localRef: React.RefObject<TextInput>,
    props: UIMaterialTextViewProps,
    onChangeText: (text: string, callOnChangeProp?: boolean) => string,
) {
    // @ts-ignore
    React.useImperativeHandle(forwardedRed, () => ({
        // Methods of TextInput
        setNativeProps(...args) {
            return localRef.current?.setNativeProps(...args);
        },
        isFocused() {
            return localRef.current?.isFocused() || false;
        },
        focus() {
            return localRef.current?.focus();
        },
        blur() {
            return localRef.current?.blur();
        },
        clear() {
            return localRef.current?.clear();
        },
        // Custom one
        changeText: (text: string, callOnChangeProp?: boolean) => {
            localRef.current?.setNativeProps({
                text,
            });

            if (props.multiline) {
                if (Platform.OS === 'web') {
                    const elem = localRef.current as unknown as HTMLTextAreaElement;
                    calculateWebInputHeight(elem);
                }
            }

            onChangeText(text, callOnChangeProp);
        },
    }));
}

const UIMaterialTextViewFloating = React.forwardRef<
    UIMaterialTextViewRef,
    UIMaterialTextViewCommonProps
>(function UIMaterialTextViewFloatingForwarded(props: UIMaterialTextViewCommonProps, passedRef) {
    const { label, onLayout, children, onHeightChange, success, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const {
        inputHasValue,
        clear: clearProp,
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
    const clearInput = React.useCallback(() => {
        clearProp();
        resetInputHeight();
    }, [clearProp, resetInputHeight]);

    const clear = React.useMemo(() => {
        /**
         *  If clearButton is visible it blocks displaying child icons.
         * So we show it if the input is invalid.
         * It was made for UIKeyTextView, as for the signing box interface in the browser
         * we want to show the icon of submitting, when a key is valid, instead of a clear button
         */
        return success ? undefined : () => clearInput();
    }, [clearInput, success]);
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

const UIMaterialTextViewSimple = React.forwardRef<
    UIMaterialTextViewRef,
    UIMaterialTextViewCommonProps
>(function UIMaterialTextViewSimpleForwarded(props: UIMaterialTextViewCommonProps, passedRef) {
    const { label, onLayout, children, success, onHeightChange, ...rest } = props;
    const ref = React.useRef<TextInput>(null);
    const {
        inputHasValue,
        clear: clearProp,
        onChangeText: onChangeTextProp,
    } = useUITextViewValue(ref, false, props);
    useExtendedRef(passedRef, ref, props, onChangeTextProp);
    const { isFocused, onFocus, onBlur } = useFocused(props.onFocus, props.onBlur);
    const { onContentSizeChange, onChange, numberOfLines, style, resetInputHeight } = useAutogrow(
        ref,
        props,
        onHeightChange,
    );
    const clearInput = React.useCallback(() => {
        clearProp();
        resetInputHeight();
    }, [clearProp, resetInputHeight]);

    const clear = React.useMemo(() => {
        return success ? undefined : () => clearInput();
    }, [clearInput, success]);
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
                </UIMaterialTextViewBorder>
            </View>
        </UIMaterialTextViewComment>
    );
});

export type UIMaterialTextViewProps = UIMaterialTextViewCommonProps & {
    /**
     * Whether to make label float or use default native placeholder
     */
    floating?: boolean;
};

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForwarded(
        { floating = true, ...props }: UIMaterialTextViewProps,
        ref,
    ) {
        return floating ? (
            <UIMaterialTextViewFloating ref={ref} {...props} />
        ) : (
            <UIMaterialTextViewSimple ref={ref} {...props} />
        );
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof UIMaterialTextViewIcon;
    Action: typeof UIMaterialTextViewAction;
    Text: typeof UIMaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = UIMaterialTextViewIcon;
UIMaterialTextView.Action = UIMaterialTextViewAction;
UIMaterialTextView.Text = UIMaterialTextViewText;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    input: {
        minHeight: 24, // At least size of right icons to not jump
    },
    inputWrapper: {
        position: 'relative',
        paddingBottom: 9,
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    withoutCommentContainer: {
        paddingTop: 12,
        paddingBottom: 18,
    },
    withCommentContainer: {
        flexDirection: 'column',
        paddingTop: 12,
        paddingBottom: 12,
    },
    comment: {
        marginTop: 10,
    },
});
