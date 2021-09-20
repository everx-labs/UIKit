// @flow
export const UIColorThemeName = {
    light: 'light',
    dark: 'dark',
    action: 'action',
};

export type UIColorThemeNameType = 'light' | 'dark' | 'action';

export type UIColorData = string;

export type UIColorThemeData = {
    borderBottom: {
        light: UIColorData,
        normal: UIColorData,
        focused: UIColorData,
        hover: UIColorData,
    },
    text: {
        primary: {
            normal: UIColorData,
            disabled: UIColorData,
            tapped: UIColorData,
            hover: UIColorData,
        },
        secondary: UIColorData,
        tertiary: UIColorData,
        quaternary: UIColorData,
        action: UIColorData,
        paragraph: UIColorData,
        caution: UIColorData,
        placeholder: UIColorData,
        accent: UIColorData,
        positive: UIColorData,
        negative: UIColorData,
    },
    background: {
        primary: UIColorData,
        primaryInverted: UIColorData,
        secondary: UIColorData,
        tertiary: UIColorData,
        quarter: UIColorData,
        quinary: UIColorData,
        whiteLight: UIColorData,
        positive: UIColorData,
        negative: UIColorData,
        brake: UIColorData,
    },
    button: {
        background: {
            normal: UIColorData,
            tapped: UIColorData,
            hover: UIColorData,
        },
        title: {
            normal: UIColorData,
            disabled: UIColorData,
        },
    },
    detailsInput: {
        comment: UIColorData,
        amount: {
            placeholder: UIColorData,
        },
    },
};
