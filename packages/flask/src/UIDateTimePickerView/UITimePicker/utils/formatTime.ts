// Format time: Date to time: string like 00:00
export const formatTime = (value?: Date): string => {
    if (value) {
        const hoursValue = value.getHours();
        const minutesValue = value.getMinutes();
        const formattedHours = hoursValue < 10 ? `0${hoursValue}` : hoursValue;
        const formattedMinutes =
            minutesValue < 10 ? `0${minutesValue}` : minutesValue;

        return `${formattedHours}:${formattedMinutes}`;
    }
    return '00:00';
};
