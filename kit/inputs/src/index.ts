import * as UIMaterialTextView from './UIMaterialTextView';
import * as UIAutogrowTextView from './UIAutogrowTextView';
import * as UIKeyTextView from './UIKeyTextView';
import * as UINumberTextView from './UINumberTextView';
import * as UISeedPhraseTextView from './UISeedPhraseTextView';
import * as UITextView from './UITextView';
import * as UIInputAccessoryView from './UIInputAccessoryView/UIInputAccessoryView';

import * as useClearButton from './UIMaterialTextView/useClearButton';
import * as useAutogrowTextView from './useAutogrowTextView';
import * as useCustomKeyboard from './useCustomKeyboard/';
import * as useAnimatedKeyboardHeight from './useAnimatedKeyboardHeight';

export * from './UIMaterialTextView';
export * from './UIAutogrowTextView';
export * from './UIKeyTextView';
export * from './UINumberTextView';
export * from './UISeedPhraseTextView';
export * from './UITextView';
export * from './UIInputAccessoryView/UIInputAccessoryView';

export * from './UIMaterialTextView/useClearButton';
export * from './useAutogrowTextView';
export * from './useCustomKeyboard/';
export * from './useAnimatedKeyboardHeight';

export const UILayout = {
    UIMaterialTextView,
    UIAutogrowTextView,
    UIKeyTextView,
    UINumberTextView,
    UISeedPhraseTextView,
    UITextView,
    UIInputAccessoryView,

    useClearButton,
    useAutogrowTextView,
    useCustomKeyboard,
    useAnimatedKeyboardHeight,
};
export default UILayout;
