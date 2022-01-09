import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NestedInModalContext } from '@tonlabs/uicast.modal-navigator';

export function useStackTopInsetStyle(hasTopInset: boolean) {
    const { top } = useSafeAreaInsets();
    const closeModal = React.useContext(NestedInModalContext);

    const topInsetStyle = React.useMemo(() => {
        if (!hasTopInset) {
            return null;
        }
        if (closeModal) {
            return null;
        }

        return {
            paddingTop: top,
        };
    }, [hasTopInset, closeModal, top]);

    return topInsetStyle;
}
