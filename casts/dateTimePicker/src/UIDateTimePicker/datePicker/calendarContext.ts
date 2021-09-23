import { createContext, useContext } from 'react';
import type { PickerPropsType } from '../../types';

export const CalendarContext = createContext<PickerPropsType>({} as PickerPropsType);

export const useCalendar = () => {
    return useContext(CalendarContext);
};
