import * as React from 'react';

import type { UIDateTimePickerMode, DateTimeState, DateTimeAction } from './types';

type DateTimeStateContext = {
    mode: UIDateTimePickerMode;
    state: DateTimeState;
    isTimeValid: boolean;
    dispatch: React.Dispatch<DateTimeAction>;
    min?: Date;
    max?: Date;
    isAmPmTime?: boolean;
};

const DateTimeContext = React.createContext<DateTimeStateContext>({} as DateTimeStateContext);

export const DateTimeStateProvider = DateTimeContext.Provider;

export function useDateTimeState() {
    return React.useContext(DateTimeContext);
}
