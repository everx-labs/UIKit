import * as React from 'react';
import { Pressable } from '../Pressable';
import { Content } from './Content';
import type { UIPressableAreaProps } from './types';

/**
 * This component is a replacement for the standard TouchableOpacity, Pressable, etc.
 * It has a similar API and behaviour, but has a "scaling" response to the press and hover events.
 */
export function UIPressableArea(props: UIPressableAreaProps) {
    const { children, scaleParameters, ...rest } = props;
    return (
        <Pressable {...rest}>
            <Content scaleParameters={scaleParameters}>{children}</Content>
        </Pressable>
    );
}
