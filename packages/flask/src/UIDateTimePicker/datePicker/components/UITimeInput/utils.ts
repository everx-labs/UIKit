export function validateTime(val: string, isAmPmTime?: boolean) {
    const regexp = /^\d{0,2}?\:?\d{0,2}$/;

    const [hoursStr, minutesStr] = val.split(':');

    if (!regexp.test(val)) {
        return false;
    }

    const maxHour = isAmPmTime ? 12 : 24;

    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    const isValidHour = (hour: string | number) =>
        Number.isInteger(hour) && hour >= 0 && hour < (isAmPmTime ? maxHour + 1 : maxHour);
    const isValidMinutes = (min1: string | number) =>
        (Number.isInteger(min1) && hours >= 0 && hours < (isAmPmTime ? maxHour + 1 : maxHour)) ||
        Number.isNaN(min1);

    console.log(isValidHour(hours), isValidMinutes(minutes));
    if (!isValidHour(hours) || !isValidMinutes(minutes)) {
        return false;
    }

    if (minutes < 10 && Number(minutesStr[0]) > 5) {
        return false;
    }

    const valArr = val.indexOf(':') !== -1 ? val.split(':') : [val];

    // check mm and HH
    if (
        valArr[0] &&
        valArr[0].length &&
        (parseInt(valArr[0], 10) < 0 ||
            parseInt(valArr[0], 10) > (isAmPmTime ? maxHour + 1 : maxHour - 1))
    ) {
        return false;
    }

    if (
        valArr[1] &&
        valArr[1].length &&
        (parseInt(valArr[1], 10) < 0 ||
            (isAmPmTime && hours === maxHour
                ? parseInt(valArr[1], 10) > 0
                : parseInt(valArr[1], 10) > 59))
    ) {
        return false;
    }

    return true;
}
