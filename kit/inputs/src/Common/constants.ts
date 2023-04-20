import { ColorVariants } from '@tonlabs/uikit.themes';

export enum InputColorScheme {
    Default = 'default',
    Secondary = 'secondary',
}
type BackgroundColors = {
    regular: ColorVariants;
    disabled: ColorVariants;
};

export const inputBackgroundColorsScheme: Record<InputColorScheme, BackgroundColors> = {
    [InputColorScheme.Default]: {
        regular: ColorVariants.BackgroundBW,
        disabled: ColorVariants.BackgroundTertiary,
    },
    [InputColorScheme.Secondary]: {
        regular: ColorVariants.BackgroundSecondary,
        disabled: ColorVariants.BackgroundTertiary,
    },
};

export enum InputFont {
    Default = 'Default',
    Surf = 'Surf',
}
