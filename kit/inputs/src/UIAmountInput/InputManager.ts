import type React from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import type { UITextViewRef } from '../UITextView';
import { injectInputValue } from './injectInputValue';

type InputManagerType = {
    injectValue: (value: string) => void;
};

export const useInputManager = (
    animatedRef: React.RefObject<UITextViewRef>,
): SharedValue<InputManagerType> => {
    return useDerivedValue(() => {
        return {
            injectValue: (value: string) => {
                injectInputValue(animatedRef, value);
            },
        };
    });
};
