import type Animated from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';
import type { PressableStateType } from '../types';

export function usePressableState(
    isDisabled: Readonly<Animated.SharedValue<boolean | undefined>>,
    isLoading: Readonly<Animated.SharedValue<boolean | undefined>>,
    isPressed: Readonly<Animated.SharedValue<boolean>>,
    isHovered: Readonly<Animated.SharedValue<boolean>>,
): Readonly<Animated.SharedValue<PressableStateType>> {
    const pressableState = useDerivedValue(() => {
        if (isLoading.value) {
            return 'Loading';
        }
        if (isDisabled.value) {
            return 'Disabled';
        }
        if (isPressed.value) {
            return 'Pressed';
        }
        if (isHovered.value) {
            return 'Hovered';
        }
        return 'Initial';
    });
    return pressableState;
}
