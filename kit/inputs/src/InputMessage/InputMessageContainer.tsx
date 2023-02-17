import * as React from 'react';
import { View } from 'react-native';
import type { InputMessageContainerProps } from './types';

/**
 * It's required only for web.
 */
export function InputMessageContainer({
    children,
    style,
}: InputMessageContainerProps): JSX.Element {
    return <View style={style}>{children}</View>;
}
