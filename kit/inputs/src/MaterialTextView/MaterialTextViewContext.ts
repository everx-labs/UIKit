import * as React from 'react';

import type { MaterialTextViewContextType } from './types';
import { defaultMaterialTextViewColorScheme } from './constants';

export const MaterialTextViewContext = React.createContext<MaterialTextViewContextType>({
    colorScheme: defaultMaterialTextViewColorScheme,
});
