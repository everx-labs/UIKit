import type { LegacyRef } from 'react';
import type { StyleProp, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import type { ButtonAnimations } from '../types';

export type TouchableElementProps = {
    animations: ButtonAnimations;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onLongPress?: () => void;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    testID?: string;
    ref?: LegacyRef<TouchableWithoutFeedback>;
};
