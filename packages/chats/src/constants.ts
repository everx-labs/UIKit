import { Platform } from 'react-native';

export const URI_TON_SURF = 'uri.ton.surf';

const GRID_LINE_HEIGHT = 4;

export const RegExpConstants = {
    domain: /.+\/\/|www.|\/.+/g,
    protocol: /^https?:\/\//,
    urlPattern:
        /(https?:\/\/|www\.)[-а-яА-Яa-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-а-яА-Яa-zA-Z0-9@:%_\+.~#?&\/=]*[-а-яА-Яa-zA-Z0-9@:%_\+~#?&\/=])*/i,
};

export const UIConstant = {
    mediaImagePartOfScreen: Platform.select<number>({
        web: 3 / 12,
        default: 3 / 4,
    }),
    mediaImageMaxSizesAspectRatio: 9 / 16,
    lightbox: {
        animationDisplayDelay: 50,
        verticalHeaderPadding: 6,
        hitSlop: {
            top: 16,
            left: 16,
            bottom: 16,
            right: 16,
        },
        swipeToCloseThreshold: 1 / 5,
        moveDeceleration: 0.995,
    },
    contentInsetVerticalX2: 2 * GRID_LINE_HEIGHT,
    contentInsetVerticalX3: 3 * GRID_LINE_HEIGHT,
    contentInsetVerticalX4: 4 * GRID_LINE_HEIGHT,

    contentOffset: 16,
};
