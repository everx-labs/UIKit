import * as React from 'react';
import type { ColorValue } from 'react-native';
import type { UICustomKeyboardView } from '@tonlabs/uikit.inputs';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import { StickersButton } from './StickersButton';
import { StickerPickerKeyboardName, StickersKeyboard } from './StickersKeyboard';
import type { OnPickSticker, UIStickerPackage } from './types';

export function useStickers(
    stickers: UIStickerPackage[],
    onStickerSelected: OnPickSticker,
): UICustomKeyboardView {
    const theme = useTheme();
    const stickersKeyboard = React.useMemo(() => {
        return {
            // onItemSelected,
            button: StickersButton,
            moduleName: StickerPickerKeyboardName,
            component: StickersKeyboard,
            initialProps: {
                stickers,
                theme,
            },
            backgroundColor: theme[ColorVariants.BackgroundSecondary] as ColorValue,
            onEvent: onStickerSelected,
        };
    }, [stickers, onStickerSelected, theme]);

    return stickersKeyboard;
}
