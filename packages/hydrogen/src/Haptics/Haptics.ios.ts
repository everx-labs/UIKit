/* global _hapticSelection, _hapticImpact, _hapticNotification */
export function hapticImpact(inputStyle: 'light' | 'medium' | 'heavy') {
    'worklet';

    _hapticImpact(inputStyle);
}

export function hapticSelection() {
    'worklet';

    _hapticSelection();
}

export function hapticNotification(inputType: 'success' | 'warning' | 'error') {
    'worklet';

    _hapticNotification(inputType);
}
