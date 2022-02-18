import * as React from 'react';
import {
    UIMaterialTextViewIcon,
    UIMaterialTextViewAction,
    UIMaterialTextViewText,
} from './useMaterialTextViewChildren';
import { UIMaterialTextViewFloating } from './UIMaterialTextViewFloating';
import { UIMaterialTextViewSimple } from './UIMaterialTextViewSimple';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';

const UIMaterialTextViewForward = React.memo(
    React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
        function UIMaterialTextViewForward(props: UIMaterialTextViewProps, ref) {
            const { label } = props;
            if (label) {
                return <UIMaterialTextViewFloating {...props} ref={ref} />;
            }
            return <UIMaterialTextViewSimple {...props} ref={ref} />;
        },
    ),
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
