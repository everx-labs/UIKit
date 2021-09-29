import { createContext, useContext } from 'react';
import type { PickerPropsType } from '../../types';
import type { Utils } from '../utils';

export const CalendarContext = createContext<PickerPropsType<Utils>>({} as PickerPropsType<Utils>);

export const useCalendar = () => {
    return useContext(CalendarContext);
};
