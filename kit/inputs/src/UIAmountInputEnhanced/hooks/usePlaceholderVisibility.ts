import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import type { ExpansionState } from '../types';

export function usePlaceholderVisibility(
    expansionState: SharedValue<ExpansionState>,
    hasLabel: boolean,
    formattedText: SharedValue<string>,
): SharedValue<boolean> {
    return useDerivedValue<boolean>(() => {
        return (expansionState.value === 'Expanded' || !hasLabel) && !formattedText.value;
    }, [hasLabel]);
}
