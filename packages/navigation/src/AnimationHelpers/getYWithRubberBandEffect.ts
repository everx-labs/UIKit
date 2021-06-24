/**
 * A method to calculate a position with a Rubber band effect
 * https://medium.com/@esskeetit/как-работает-uiscrollview-2e7052032d97
 *
 * @param y - This is a position of current tap
 *            from the point where rubber band effect
 *            should be applied
 * @param distance - Size of rubber band effect
 * @returns new position
 */
export function getYWithRubberBandEffect(y: number, distance: number) {
    'worklet';

    return (1 - 1 / (Math.abs(y) / distance + 1)) * distance;
}
