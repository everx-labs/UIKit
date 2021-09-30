import { createContext } from 'react';

import { PickerPropsType } from '../../types';
import type { Utils } from '../utils';

export const CalendarContext = createContext<PickerPropsType<Utils>>({} as PickerPropsType<Utils>);
