import * as React from 'react';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
} from '../MaterialTextView';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        return <UIMaterialTextView {...props} ref={passedRef} />;
    },
);

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = MaterialTextViewIcon;
UIMaterialTextView.Action = MaterialTextViewAction;
UIMaterialTextView.Text = MaterialTextViewText;
