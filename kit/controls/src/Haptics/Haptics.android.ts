import { Vibration } from 'react-native';
import { runOnJS } from 'react-native-reanimated';

// TODO: provide JSI implementation
function hapticResponse(duration: number) {
    Vibration.vibrate(duration);
}

export function hapticImpact(inputStyle: 'light' | 'medium' | 'heavy') {
    'worklet';

    let duration = 0;
    if (inputStyle === 'light') {
        duration = 20;
    } else if (inputStyle === 'medium') {
        duration = 30;
    } else if (inputStyle === 'heavy') {
        duration = 40;
    }

    runOnJS(hapticResponse)(duration);
}

export function hapticSelection() {
    'worklet';

    runOnJS(hapticResponse)(10);
}

export function hapticNotification(inputType: 'success' | 'warning' | 'error') {
    'worklet';

    let duration = 0;
    if (inputType === 'success') {
        duration = 50;
    } else if (inputType === 'warning') {
        duration = 60;
    } else if (inputType === 'error') {
        duration = 70;
    }

    runOnJS(hapticResponse)(duration);
}
