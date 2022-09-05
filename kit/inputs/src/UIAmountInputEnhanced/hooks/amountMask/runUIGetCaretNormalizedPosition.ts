export function runUIGetCaretNormalizedPosition(
    caretPosition: number,
    previousText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    'worklet';

    let caretNormalizedPosition = caretPosition;

    for (let i = 0; i < caretPosition; i += 1) {
        if (previousText[i] === integerSeparator || previousText[i] === fractionalSeparator) {
            caretNormalizedPosition -= 1;
        }
    }

    return caretNormalizedPosition;
}
