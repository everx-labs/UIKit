import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { ContainerProps } from './types';
import * as Columns from './Columns';
import { useCheckChildren, useContainerHoverAnimatedStyle } from './hooks';
import { useIsPrimaryActionEnabled } from './useIsPrimaryActionEnabled';

export function Container({ children, id }: ContainerProps) {
    const isPrimaryActionEnabled = useIsPrimaryActionEnabled(children);
    const { animatedStyle, onMouseEnter, onMouseLeave } = useContainerHoverAnimatedStyle();

    const isValid = useCheckChildren(
        children,
        Columns,
        `'Container' can only contain 'Column' components as its direct children`,
    );
    if (!isValid) {
        return null;
    }
    return (
        <Animated.View
            key={id}
            style={[styles.container, animatedStyle]}
            // @ts-expect-error
            onMouseEnter={isPrimaryActionEnabled ? onMouseEnter : undefined}
            onMouseLeave={isPrimaryActionEnabled ? onMouseLeave : undefined}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        /**
         * The negative horizontal margin is used to set the horizontal padding of all child elements
         * and not to think about the presence of an element on the left or right side.
         */
        marginHorizontal: -UILayoutConstant.contentOffset,
        paddingHorizontal:
            UILayoutConstant.contentOffset - UILayoutConstant.normalContentOffset / 2,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
});
