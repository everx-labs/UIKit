import {
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewFloating & {
    Icon: typeof UIMaterialTextViewIcon;
    Action: typeof UIMaterialTextViewAction;
    Text: typeof UIMaterialTextViewText;
} = UIMaterialTextViewFloating;

UIMaterialTextView.Icon = UIMaterialTextViewIcon;
UIMaterialTextView.Action = UIMaterialTextViewAction;
UIMaterialTextView.Text = UIMaterialTextViewText;
