import * as React from 'react';
import { UISkeleton } from '@tonlabs/uikit.layout';
import { Pressable } from '../Pressable';
import type { UIWideBoxButtonProps } from './types';
import { UIWideBoxButtonSecondary } from './content/UIWideBoxButtonSecondary';
import { Caption } from './Caption';
import { UIWideBoxButtonType } from './constants';
import { UIWideBoxButtonPrimary } from './content/UIWideBoxButtonPrimary';
import { UIWideBoxButtonNulled } from './content/UIWideBoxButtonNulled';

export const UIWideBoxButton = (props: UIWideBoxButtonProps) => {
    const {
        type = UIWideBoxButtonType.Primary,
        caption,
        onPress,
        disabled,
        loading,
        testID,
    } = props;

    const Content = React.useMemo(() => {
        switch (type) {
            case UIWideBoxButtonType.Secondary:
                return UIWideBoxButtonSecondary;
            case UIWideBoxButtonType.Nulled:
                return UIWideBoxButtonNulled;
            case UIWideBoxButtonType.Primary:
            default:
                return UIWideBoxButtonPrimary;
        }
    }, [type]);
    if (type === UIWideBoxButtonType.Nulled) {
        return (
            <UISkeleton show={!!loading}>
                <Pressable testID={testID} disabled={disabled} onPress={onPress}>
                    <Content {...props} />
                    <Caption title={caption} wideBoxButtonType={type} />
                </Pressable>
            </UISkeleton>
        );
    }
    return (
        <UISkeleton show={!!loading}>
            <Pressable testID={testID} disabled={disabled} onPress={onPress}>
                <Content {...props} />
            </Pressable>
            <Caption title={caption} wideBoxButtonType={type} />
        </UISkeleton>
    );
};
