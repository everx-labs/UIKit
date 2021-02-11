import * as React from 'react';
import type { UICustomKeyboardItem } from '@tonlabs/uikit.keyboard';
import { useTheme } from '@tonlabs/uikit.hydrogen';

import { StickersButton } from './StickersButton';
import { StickerPickerKeyboardName, StickersList } from './StickersKeyboard';
import type { OnPickSticker, UIStickerPackage } from './types';

export function useStickers(
    stickers: UIStickerPackage[],
    onItemSelected: OnPickSticker,
): UICustomKeyboardItem {
    const theme = useTheme();
    const stickersKeyboard = React.useMemo(() => {
        return {
            button: StickersButton,
            kbID: StickerPickerKeyboardName,
            component: StickersList,
            props: {
                stickers,
                theme,
            },
            onItemSelected,
        };
    }, [stickers, onItemSelected, theme]);

    return stickersKeyboard;
}
