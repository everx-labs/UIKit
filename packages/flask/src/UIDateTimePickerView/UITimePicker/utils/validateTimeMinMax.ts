export const validateTimeMinMax = (
    newTime: Date,
    min?: Date,
    max?: Date,
): boolean => {
    const newHour = newTime.getHours();
    const newMinute = newTime.getMinutes();

    // comparing newTime with maxTime and minTime by hours and minutes, not considering the date
    if (min) {
        const minHour = min.getHours();
        const minMinute = min.getMinutes();

        if (
            (newHour === minHour && newMinute < minMinute) ||
            newHour < minHour
        ) {
            return false;
        }
    }
    if (max) {
        const maxHour = max.getHours();
        const maxMinute = max.getMinutes();

        if (
            (newHour === maxHour && newMinute > maxMinute) ||
            newHour > maxHour
        ) {
            return false;
        }
    }

    return true;
};
