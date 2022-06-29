import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIButtonGroupAction } from './UIButtonGroupAction';
import { UILayoutConstants } from './constants';
import type { UIButtonGroupProps, IUIButtonGroup } from './types';
import { useButtonGroupChildren } from './hooks';

export function UIButtonGroupContainer(props: UIButtonGroupProps) {
    const { children, layout } = props;
    const processedChildren = useButtonGroupChildren(children);
    return <View style={[styles.container, layout]}>{processedChildren}</View>;
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
        borderRadius: UILayoutConstants.containerBorderRadius,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
});

// @ts-expect-error
// ts doesn't understand that we assign [Action] later, and want to see it right away
export const UIButtonGroup: IUIButtonGroup = UIButtonGroupContainer;
UIButtonGroup.Action = UIButtonGroupAction;
