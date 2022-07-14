import * as React from 'react';
import Animated, {
    runOnJS,
    useAnimatedReaction,
    useAnimatedRef,
    useDerivedValue,
} from 'react-native-reanimated';
import BigNumber from 'bignumber.js';
import { NativeModules } from 'react-native';
import type { UIAmountInputEnhancedRef, UIAmountInputEnhancedProps } from './types';
import { AmountInputContext } from './constants';
import { useAmountInputHandlers, useAmountInputHover } from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

NativeModules.UIKitInputManagerModule?.install();

export const UIAmountInputEnhancedContent = React.forwardRef<
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps
>(function UIAmountInputEnhancedContent(
    { children: _children, ...props }: UIAmountInputEnhancedProps,
    _forwardedRef: React.Ref<UIAmountInputEnhancedRef>,
) {
    const {
        editable,
        onFocus,
        onBlur,
        onHover,
        onSelectionChange,
        onChangeAmount: onChangeAmountProp,
        precision,
    } = props;
    // @ts-ignore
    const ref = useAnimatedRef<UITextViewRef>();
    const { normalizedText } = React.useContext(AmountInputContext);

    // React.useEffect(() => {
    //     // @ts-ignore
    //     // eslint-disable-next-line no-underscore-dangle
        
    // }, []);

    // const uiKitInputManager = useDerivedValue(() => {
    //     if (!_WORKLET || !__uiKitInputManager) {
    //         return null
    //     }
    //     return __uiKitInputManager(ref());
    // })

    useDerivedValue(() => {
        if (!_WORKLET) {
            return
        }
        console.log('uiKitInputManager', __uiKitInputManager?.getInputValueInjector(ref()).injectInputValue('value'))
    })

    // const ads = useSharedValue(0);
    // const initialInject = () => {
    //     'worklet';

    //     if (!_WORKLET) {
    //         return
    //     }

    //     // console.log('__uiKitInputManager', __uiKitInputManager);
    //     // // @ts-ignore
    //     // __uiKitInputManager?.injectInputValue?.(ref?.(), `INJECTED ${ads.value}`);
    // };
    // useDerivedValue(initialInject);

    /**
     * Reset context value after the component unmounting
     */
    // React.useLayoutEffect(() => {
    //     return () => {
    //         isHovered.value = defaultContextValue.isHovered;
    //         isFocused.value = defaultContextValue.isFocused;
    //         inputText.value = defaultContextValue.inputText;
    //         normalizedText.value = defaultContextValue.normalizedText;
    //         formattedText.value = defaultContextValue.formattedText;
    //     };
    // });

    /**
     * TODO Remove
     */
    // useDerivedValue(() => {
    //     console.log('UI', {
    //         isHovered: isHovered.value,
    //         isFocused: isFocused.value,
    //         inputText: inputText.value,
    //         normalizedText: normalizedText.value,
    //         formattedText: formattedText.value,
    //     });
    // });

    const onChangeAmount = React.useCallback(
        (normalizedNumber: string) => {
            if (onChangeAmountProp) {
                setTimeout(() => {
                    const value = new BigNumber(normalizedNumber);

                    if (value.isNaN()) {
                        onChangeAmountProp(undefined);
                    } else {
                        onChangeAmountProp(value);
                    }
                });
            }
        },
        [onChangeAmountProp],
    );

    /**
     * normalizedText has changed
     */
    useAnimatedReaction(
        () => normalizedText.value,
        (currentNormalizedText, previousNormalizedText) => {
            if (currentNormalizedText !== previousNormalizedText) {
                runOnJS(onChangeAmount)(currentNormalizedText);
            }
        },
    );

    /**
     * inputText has changed
     */
    // useAnimatedReaction(
    //     () => ({ inputText: inputText.value, formattedText: formattedText.value }),
    //     (currentState, _previousState) => {
    //         if (currentState.formattedText !== currentState.inputText) {
    //             injectInputValue(ref, currentState.formattedText);
    //         }
    //     },
    // );

    const textViewHandlers = useAmountInputHandlers(
        ref,
        editable,
        onFocus,
        onBlur,
        onSelectionChange,
        precision,
    );

    const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

    return (
        <Animated.View
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <UITextViewAnimated {...props} {...textViewHandlers} ref={ref} />
        </Animated.View>
    );
});
