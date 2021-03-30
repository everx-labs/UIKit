import * as React from 'react';
import type { ColorValue } from 'react-native';
import type { UICustomKeyboardView } from '@tonlabs/uikit.keyboard';
import { ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';

import { StickersButton } from './StickersButton';
import { StickerPickerKeyboardName, StickersList } from './StickersKeyboard';
import type {
    // OnPickSticker,
    UIStickerPackage,
} from './types';

export function useStickers(
    stickers: UIStickerPackage[],
    // onItemSelected: OnPickSticker,
): UICustomKeyboardView {
    const theme = useTheme();
    const stickersKeyboard = React.useMemo(() => {
        return {
            // onItemSelected,
            button: StickersButton,
            moduleName: StickerPickerKeyboardName,
            component: StickersList,
            initialProps: {
                stickers,
                theme,
            },
            backgroundColor: theme[
                ColorVariants.BackgroundSecondary
            ] as ColorValue,
        };
    }, [stickers, /* onItemSelected, */ theme]);

    return stickersKeyboard;
}
