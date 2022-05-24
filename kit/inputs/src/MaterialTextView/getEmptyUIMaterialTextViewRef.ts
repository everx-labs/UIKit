import type { MaterialTextViewRef } from './types';

function getEmptyMethod(place: string, name: string, returnedValue: any = null) {
    return function emptyMethod() {
        console.error(
            `[${place}]: You tried to call method [${name}]. This method is not implemented.`,
        );
        return returnedValue;
    };
}

export function getEmptyUIMaterialTextViewRef(place: string): MaterialTextViewRef {
    return {
        changeText: getEmptyMethod(place, 'changeText'),
        moveCarret: getEmptyMethod(place, 'moveCarret'),
        clear: getEmptyMethod(place, 'clear'),
        isFocused: getEmptyMethod(place, 'isFocused', false),
        focus: getEmptyMethod(place, 'focus'),
        blur: getEmptyMethod(place, 'blur'),
    };
}
