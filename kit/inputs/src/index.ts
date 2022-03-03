import * as UIMaterialTextView from './UIMaterialTextView';
import * as UIAutogrowTextView from './UIAutogrowTextView';
import * as UIKeyTextView from './UIKeyTextView';
import * as UINumberTextView from './UINumberTextView';
import * as UISeedPhraseTextView from './UISeedPhraseTextView';
import * as UITextView from './UITextView';
import * as UIInputAccessoryView from './UIInputAccessoryView/UIInputAccessoryView';

import * as useClearButton from './UIMaterialTextView/hooks/useClearButton';
import * as useAutogrowTextView from './useAutogrowTextView';
import * as useCustomKeyboard from './useCustomKeyboard';
import * as useAnimatedKeyboardHeight from './useAnimatedKeyboardHeight';

export * from './UIMaterialTextView';
export * from './UIAutogrowTextView';
export * from './UIKeyTextView';
export * from './UINumberTextView';
export * from './UISeedPhraseTextView';
export * from './UITextView';
export * from './UIInputAccessoryView/UIInputAccessoryView';
export * from './UIInputAccessoryView/UIInputAccessoryViewAvailability';

export * from './UIMaterialTextView/hooks/useClearButton';
export * from './useAutogrowTextView';
export * from './useCustomKeyboard';
export * from './useDimensions';
export * from './useAnimatedKeyboardHeight';
export * from './useAndroidNavigationBarHeight';

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
