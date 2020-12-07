/* eslint-disable global-require */
export type FontVariant = {
    fontFamily: string;
};

export type Font = {
    regular: FontVariant;
    medium: FontVariant;
    semiBold: FontVariant;
    light: FontVariant;
};

export const InterFont: Font = {
    semiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    light: {
        fontFamily: 'Inter-Light',
    },
    medium: {
        fontFamily: 'Inter-Medium',
    },
    regular: {
        fontFamily: 'Inter-Regular',
    },
};
