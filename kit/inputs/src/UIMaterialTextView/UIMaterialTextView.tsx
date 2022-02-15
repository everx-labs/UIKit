import * as React from 'react';
import {
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';
import type { UIMaterialTextViewProps, UIMaterialTextViewRef } from './types';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';
import { UIMaterialTextViewSimple } from './UIMaterialTextViewSimple';

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
