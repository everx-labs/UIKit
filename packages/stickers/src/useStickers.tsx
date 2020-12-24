import * as React from 'react';
import type { UICustomKeyboardItem } from '@tonlabs/uikit.keyboard';

import { StickersButton } from './StickersButton';
import { StickerPickerKeyboardName, StickersList } from './StickersKeyboard';
import type { OnPickSticker, UIStickerPackage } from './types';

export function useStickers(
    stickers: UIStickerPackage[],
    onItemSelected: OnPickSticker,
): UICustomKeyboardItem {
    const stickersKeyboard = React.useMemo(() => {
        return {
            button: StickersButton,
            kbID: StickerPickerKeyboardName,
            component: StickersList,
            props: {
                stickers,
            },
            onItemSelected,
        };
    }, [stickers, onItemSelected]);

    return stickersKeyboard;
}
