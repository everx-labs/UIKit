import * as React from 'react';

import type { UIDateTimePickerMode, DateTimeState, DateTimeAction } from './types';

type DateTimeStateContext = {
    mode: UIDateTimePickerMode;
    state: DateTimeState;
    dispatch: React.Dispatch<DateTimeAction>;
    min?: Date;
    max?: Date;
    isAmPmTime?: boolean;
};

// TODO: change type!!!
const DateTimeContext = React.createContext<DateTimeStateContext>({} as DateTimeStateContext);

export const DateTimeStateProvider = DateTimeContext.Provider;

export function useDateTimeState() {
    return React.useContext(DateTimeContext);
}
