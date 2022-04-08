import * as React from 'react';
import { UISkeleton } from '@tonlabs/uikit.layout';
import { Pressable } from '../Pressable';
import type { UIWideBoxButtonProps } from './types';
import { UIWideBoxButtonSecondary } from './content/UIWideBoxButtonSecondary';
import { Caption } from './Caption';
import { UIWideBoxButtonType } from './constants';
import { UIWideBoxButtonPrimary } from './content/UIWideBoxButtonPrimary';

export const UIWideBoxButton = (props: UIWideBoxButtonProps) => {
    const { type, caption, onPress, disabled, loading, testID } = props;

    const Content = React.useMemo(() => {
        switch (type) {
            case UIWideBoxButtonType.Secondary:
                return UIWideBoxButtonSecondary;
            case UIWideBoxButtonType.Nulled:
                return UIWideBoxButtonPrimary;
            case UIWideBoxButtonType.Primary:
            default:
                return UIWideBoxButtonPrimary;
        }
    }, [type]);
    return (
        <UISkeleton show={!!loading}>
            <Pressable testID={testID} disabled={disabled} onPress={onPress}>
                <Content {...props} />
            </Pressable>
            <Caption title={caption} />
        </UISkeleton>
    );
};
