import * as React from 'react';
import { View } from 'react-native';
import type { ContainerProps, PartStatus } from './types';

export const { Provider: PartStatusProvider, Consumer: PartStatusConsumer } =
    React.createContext<PartStatus>({
        disabled: undefined,
        negative: undefined,
    });

export function Container({ children }: ContainerProps) {
    return <View>{children}</View>;
}
