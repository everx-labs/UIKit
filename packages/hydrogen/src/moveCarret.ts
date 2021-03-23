import type { Ref } from 'react';
import { Platform, TextInput } from 'react-native';

function moveWebCaret(input: HTMLInputElement, position: number) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(position, position);

        return;
    }
    if ((input as any).createTextRange) {
        const range = (input as any).createTextRange();
        range.collapse(true);
        range.moveEnd(position);
        range.moveStart(position);
        range.select();
    }
}

export function moveCarret(
    ref: Ref<TextInput>,
    carretPosition: number,
    maxPosition: number = carretPosition,
) {
    if (Platform.OS === 'web') {
        moveWebCaret(
            // @ts-ignore
            ref.current as HTMLInputElement,
            carretPosition,
        );
    } else if (ref && 'current' in ref) {
        ref.current?.setNativeProps({
            // (@savelichalex) I had a crash on Android
            // sth like "setSpan(-1..-1) starts before"
            // that minus numbers got me suspicious
            // that's why I introduced such a check
            // and it seems to work
            ...(carretPosition >= 0 && carretPosition <= maxPosition
                ? {
                      selection: {
                          start: carretPosition,
                          end: carretPosition,
                      },
                  }
                : null),
        });
    }
}
