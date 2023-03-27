import { MaterialTextViewColorScheme } from '../../MaterialTextView';
import { UIMaterialTextViewColorScheme } from '../types';

export function useMaterialTextViewColorScheme(
    colorScheme: UIMaterialTextViewColorScheme,
): MaterialTextViewColorScheme {
    switch (colorScheme) {
        case UIMaterialTextViewColorScheme.Secondary:
            return MaterialTextViewColorScheme.Secondary;
        case UIMaterialTextViewColorScheme.Default:
        default:
            return MaterialTextViewColorScheme.Default;
    }
}
