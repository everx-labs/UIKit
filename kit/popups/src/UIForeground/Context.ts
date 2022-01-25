import * as React from 'react';
import type { ColumnStatus } from './types';

export const ColumnStatusContext = React.createContext<ColumnStatus>({
    disabled: undefined,
    negative: undefined,
    columnType: 'Primary',
    columnState: 'NonPressable',
});
