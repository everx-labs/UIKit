import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIButtonGroupAction } from './UIButtonGroupAction';
import type { UIButtonGroupProps, IUIButtonGroup } from './types';
import { useButtonGroupChildren } from './hooks';

export function UIButtonGroupContainer(props: UIButtonGroupProps) {
    const { children, layout } = props;
    const processedChildren = useButtonGroupChildren(children);
    return <View style={[styles.container, layout]}>{processedChildren}</View>;
}

const styles = StyleSheet.create({
    container: {
        borderRadius: UILayoutConstant.mediumBorderRadius,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
});

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIButtonGroup: IUIButtonGroup = UIButtonGroupContainer;
UIButtonGroup.Action = UIButtonGroupAction;
