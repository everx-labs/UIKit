import * as React from 'react';
import type { TextInput } from 'react-native';

import { UITextView, UITextViewProps } from './UITextView';
import { useAutogrowTextView } from './useAutogrowTextView';
import type { OnHeightChange } from './useAutogrowTextView';

export type UIAutogrowTextViewProps = UITextViewProps & {
    onHeightChange?: OnHeightChange;
};

export const UIAutogrowTextView = React.forwardRef<TextInput, UIAutogrowTextViewProps>(
    function AutogrowTextViewForwarded(props: UIAutogrowTextViewProps, ref) {
        const { onContentSizeChange, onChange, numberOfLinesProp } = useAutogrowTextView(
            ref,
            props.onHeightChange,
        );

        return (
            <UITextView
                ref={ref}
                {...props}
                multiline
                onChange={onChange}
                onContentSizeChange={onContentSizeChange}
                numberOfLines={numberOfLinesProp}
            />
        );
    },
);
