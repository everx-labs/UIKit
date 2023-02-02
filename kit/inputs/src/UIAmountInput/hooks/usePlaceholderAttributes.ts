import * as React from 'react';
import {
    useDerivedValue,
    useAnimatedProps,
    withSpring,
    SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@tonlabs/uikit.themes';

import { AmountInputContext, withSpringConfig } from '../constants';
import { usePlaceholderColors } from './usePlaceholderColors';
import { usePlaceholderVisibility } from './usePlaceholderVisibility';
import type { ExpansionState } from '../types';

export function usePlaceholderAttributes(
    expansionState: SharedValue<ExpansionState>,
    hasLabel: boolean,
    editable: boolean,
) {
    const { formattedText, isHovered } = React.useContext(AmountInputContext);
    const theme = useTheme();

    const isPlaceholderVisible = usePlaceholderVisibility(expansionState, hasLabel, formattedText);
    const placeholderColors = usePlaceholderColors(theme);
    const placeholderTextColor = useDerivedValue(() => {
        if (!isPlaceholderVisible.value) {
            return placeholderColors.value.transparent;
        }
        return isHovered.value && editable
            ? placeholderColors.value.hover
            : placeholderColors.value.default;
    }, [editable]);

    const animatedPlaceholderProps = useAnimatedProps(() => {
        return {
            color: withSpring(placeholderTextColor.value, withSpringConfig) as any as string,
        };
    });

    return {
        placeholderColors,
        animatedPlaceholderProps,
    };
}
