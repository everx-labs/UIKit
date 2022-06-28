import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ColorVariants, UIBackgroundView } from '@tonlabs/uikit.themes';
import { UILayoutConstants } from './constants';
import type { UIButtonGroupProps } from './types';
import { UIButtonGroupAction } from './UIButtonGroupAction';

export function UIButtonGroup(props: UIButtonGroupProps) {
    const { children, layout } = props;
    const childList = React.Children.toArray(children).filter(child => {
        if (React.isValidElement(child)) {
            if (child.type === UIButtonGroupAction) {
                return true;
            }
        }
        console.error(`UIButtonGroup must contain only UIButtonGroupAction as children.`);
        return false;
    });
    return (
        <UIBackgroundView color={ColorVariants.BackgroundBW} style={[styles.container, layout]}>
            {childList}
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
        borderRadius: UILayoutConstants.containerBorderRadius,
    },
});
