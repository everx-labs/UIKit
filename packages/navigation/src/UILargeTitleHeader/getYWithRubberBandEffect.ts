export function getYWithRubberBandEffect(y: number, distance: number) {
    'worklet';

    // Rubber band effect
    // https://medium.com/@esskeetit/как-работает-uiscrollview-2e7052032d97
    //

    return (1 - 1 / (Math.abs(y) / distance + 1)) * distance;
}
