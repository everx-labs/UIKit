import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NestedInModalContext } from '../ModalNavigator/createModalNavigator';
import { NestedInSplitContext } from '../SplitNavigator/createSplitNavigator';

export function useStackTopInsetStyle() {
    const { top } = useSafeAreaInsets();
    const { isSplitted } = React.useContext(NestedInSplitContext);
    const closeModal = React.useContext(NestedInModalContext);

    const topInsetStyle = React.useMemo(() => {
        if (isSplitted) {
            return null;
        }
        if (closeModal) {
            return null;
        }

        return {
            paddingTop: top,
        };
    }, [isSplitted, closeModal, top]);

    return topInsetStyle;
}
