import * as React from 'react';
import Animated, {
    interpolate,
    useAnimatedProps,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
} from 'react-native-reanimated';
import { NativeModules, Platform, TextStyle, View } from 'react-native';
import { makeStyles, Theme, ColorVariants, useTheme, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIAmountInputEnhancedRef, UIAmountInputEnhancedProps } from './types';
import { AmountInputContext, withSpringConfig } from './constants';
import {
    useAmountInputHandlers,
    useAmountInputHover,
    useConnectOnChangeAmount,
    usePlaceholderColor,
} from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';
import { TapHandler } from './TapHandler';
import { InputMessage } from '../InputMessage';
import { usePlaceholderVisibility } from './hooks/usePlaceholderVisibility';
import { useExpandingValue } from './hooks/useExpandingValue';
import { FloatingLabel } from './FloatingLabel';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

NativeModules.UIKitInputModule?.install();

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

export const UIAmountInputEnhancedContent = React.forwardRef<
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps
>(function UIAmountInputEnhancedContent(
    { children: _children, placeholder, ...props }: UIAmountInputEnhancedProps,
    _forwardedRef: React.Ref<UIAmountInputEnhancedRef>,
) {
    const {
        editable = true,
        onFocus,
        onBlur,
        onHover,
        onSelectionChange,
        onChangeAmount: onChangeAmountProp,
        precision,
        multiline,
        message,
        messageType,
        label,
    } = props;
    // @ts-ignore
    const ref = useAnimatedRef<UITextViewRef>();

    const { isFocused, formattedText, isHovered, selectionEndPosition, normalizedText } =
        React.useContext(AmountInputContext);

    /**
     * TODO Remove
     */
    useDerivedValue(() => {
        console.log({
            isHovered: isHovered.value,
            isFocused: isFocused.value,
            selectionEndPosition: selectionEndPosition.value,
            normalizedText: normalizedText.value,
            formattedText: formattedText.value,
        });
    });

    const textViewHandlers = useAmountInputHandlers(
        ref,
        editable,
        onFocus,
        onBlur,
        onSelectionChange,
        precision,
        multiline,
    );

    useConnectOnChangeAmount(onChangeAmountProp);
    const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

    const theme = useTheme();
    const styles = useStyles(theme, editable);

    /** Label is immutable */
    const labelRef = React.useRef(label);
    /** The `hasLabel` can't change because it derived from immutable ref */
    const hasLabel = React.useMemo(() => !!labelRef.current, []);

    const isExpanded = useDerivedValue(() => isFocused.value || !!formattedText.value);

    const { isPlaceholderVisible, showPlacehoder } = usePlaceholderVisibility(isExpanded, hasLabel);

    const expandingValue: Readonly<Animated.SharedValue<number>> = useExpandingValue(
        hasLabel,
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

    const placeholderColor = usePlaceholderColor(
        theme,
        isPlaceholderVisible,
        formattedText,
        isHovered,
        editable,
    );

    const animatedPlaceholderProps = useAnimatedProps(() => {
        return {
            color: withSpring(placeholderColor.value, withSpringConfig) as any as string,
        };
    });

    return (
        <InputMessage type={messageType} text={message}>
            <TapHandler inputRef={ref}>
                <Animated.View
                    style={styles.container}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <Animated.View style={[styles.inputContainer, inputStyle]}>
                        <View style={{ flex: 1 }}>
                            <UITextViewAnimated
                                ref={ref}
                                {...props}
                                {...textViewHandlers}
                                style={styles.input}
                            />
                            <UILabelAnimated
                                animatedProps={animatedPlaceholderProps}
                                style={styles.placeholder}
                            >
                                {placeholder}
                            </UILabelAnimated>
                        </View>

                        <FloatingLabel expandingValue={expandingValue} color={placeholderColor}>
                            {label}
                        </FloatingLabel>
                    </Animated.View>
                    {/* {children} */}
                </Animated.View>
            </TapHandler>
        </InputMessage>
    );
});

const useStyles = makeStyles((theme: Theme, editable: boolean = true) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor: editable
            ? theme[ColorVariants.BackgroundBW]
            : theme[ColorVariants.BackgroundNeutral],
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
    placeholder: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 1.5,
            },
            android: {
                top: 2,
            },
        }),
    },
}));
