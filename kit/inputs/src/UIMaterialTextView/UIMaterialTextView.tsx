import * as React from 'react';
import {
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';
import { UIMaterialTextViewSimple } from './UIMaterialTextViewSimple';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';
import { useApplyMask } from '../useApplyMask';

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, ref) {
        const textViewRef = React.useRef<UIMaterialTextViewRef>(null);
        const { label, mask } = props;

        const formattingProps = useApplyMask(textViewRef, mask);
        if (label) {
            return <UIMaterialTextViewFloating {...props} ref={textViewRef} {...formattingProps} />;
        }
        return <UIMaterialTextViewSimple {...props} ref={textViewRef} {...formattingProps} />;
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
