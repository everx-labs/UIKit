import * as React from 'react';

export const UIBrowserInputOnHeightChangeContext = React.createContext<
    ((height: number) => void) | undefined
>(undefined);

export function useUIBrowserInputOnHeightChange() {
    return React.useContext(UIBrowserInputOnHeightChangeContext);
}
