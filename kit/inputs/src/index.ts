import * as UIMaterialTextView from './UIMaterialTextView';
import * as UIKeyTextView from './UIKeyTextView';
import * as UINumberTextView from './UINumberTextView';
import * as UISeedPhraseTextView from './UISeedPhraseTextView';
import * as UITextView from './UITextView';
import * as UIAmountInput from './UIAmountInput';

import * as useClearButton from './UIMaterialTextView/hooks/useClearButton';
import * as useAutogrowTextView from './useAutogrowTextView';

export * from './UIMaterialTextView';
export * from './UIKeyTextView';
export * from './UINumberTextView';
export * from './UISeedPhraseTextView';
export * from './UITextView';
export * from './UIAmountInput';

export * from './UIMaterialTextView/hooks/useClearButton';
export * from './useAutogrowTextView';

export const UILayout = {
    UIMaterialTextView,
    UIKeyTextView,
    UINumberTextView,
    UISeedPhraseTextView,
    UITextView,
    UIAmountInput,

    useClearButton,
    useAutogrowTextView,
};
export default UILayout;
