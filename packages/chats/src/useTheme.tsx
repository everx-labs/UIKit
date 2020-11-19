import * as React from 'react';

import { UIColor } from '@tonlabs/uikit.core';

const ThemeContext = React.createContext(UIColor.Theme.Light);

export function useTheme() {
    return React.useContext(ThemeContext);
}
