import type { OnItemSelected } from '@tonlabs/uikit.keyboard';

export type UISticker = {
    name: string;
    keywords?: string[];
    url: string;
};

export type UIStickerPackage = {
    id: string;
    date: number;
    description: string;
    name: string;
    stickers: UISticker[];
};

export type PickedSticker = { url: string; name: string; package: string };

export type OnPickSticker = OnItemSelected<PickedSticker>;
