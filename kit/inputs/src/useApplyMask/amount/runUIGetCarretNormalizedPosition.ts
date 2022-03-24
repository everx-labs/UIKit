export function runUIGetCarretNormalizedPosition(
    carretPosition: number,
    previousText: string,
    integerSeparator: string,
    fractionalSeparator: string,
) {
    'worklet';

    let carretNormalizedPosition = carretPosition;

    for (let i = 0; i < carretPosition; i += 1) {
        if (previousText[i] === integerSeparator || previousText[i] === fractionalSeparator) {
            carretNormalizedPosition -= 1;
        }
    }

    return carretNormalizedPosition;
}
