export function runUIGetTransparentColor(color: string): string {
    'worklet';

    if (color.startsWith('#')) {
        if (color.length === 7) {
            return `${color}00`;
        }
        if (color.length === 9) {
            return `${color.slice(0, 7)}00`;
        }
        /** Wrong color */
        return color;
    }
    if (color.startsWith('rgb')) {
        const colorParts = color.split(/[(,)]/);
        return `rgba(${colorParts[1]}, ${colorParts[2]}, ${colorParts[3]}, 0)`;
    }
    /** Wrong color */
    return color;
}
