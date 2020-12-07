import { Platform } from 'react-native';
import FontFaceObserver from 'fontfaceobserver-es';

import InterRegularPath from '../assets/css/Inter-Regular.css';
import InterMediumPath from '../assets/css/Inter-Medium.css';
import InterSemiBoldPath from '../assets/css/Inter-SemiBold.css';
import InterLightPath from '../assets/css/Inter-Light.css';

type FontVariant = {
    fontFamily: string;
    cssUrl: string;
};

type Font = {
    regular: FontVariant;
    medium: FontVariant;
    semiBold: FontVariant;
    light: FontVariant;
};

export const InterFont: Font = {
    semiBold: {
        fontFamily: 'Inter-SemiBold',
        cssUrl: InterSemiBoldPath,
    },
    light: {
        fontFamily: 'Inter-Light',
        cssUrl: InterLightPath,
    },
    medium: {
        fontFamily: 'Inter-Medium',
        cssUrl: InterMediumPath,
    },
    regular: {
        fontFamily: 'Inter-Regular',
        cssUrl: InterRegularPath,
    },
};

const SYSTEM_FONTS =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

function setupFontsCss(font: Font) {
    const headElement = document.getElementsByTagName('head')[0];

    const styleNode = headElement.appendChild(document.createElement('style'));
    const styleHTML = `
body {
    font-family: ${SYSTEM_FONTS};
}
.fonts-loaded body {
    font-family: '${font.regular.fontFamily}', ${SYSTEM_FONTS};
}
.fonts-loaded strong {
    font-family: '${font.semiBold.fontFamily}', ${SYSTEM_FONTS};
}
.fonts-loaded em {
    font-family: '${font.light.fontFamily}', ${SYSTEM_FONTS};
}
.fonts-loaded strong em,
.fonts-loaded em strong {
    font-family: '${font.medium.fontFamily}', ${SYSTEM_FONTS};
}
`;

    styleNode.innerHTML = styleHTML;
}

// https://www.zachleat.com/web/comprehensive-webfonts/#foft%2C-or-fout-with-two-stage-render
async function loadFonts(font: Font) {
    // Optimization for Repeat Views
    if (sessionStorage.foutFontsLoaded) {
        document.documentElement.className += ' fonts-loaded';
    }

    await Promise.all(
        Object.values(font).map((fontVariant) => {
            const observer = new FontFaceObserver(fontVariant.fontFamily);
            return observer.load();
        }),
    );

    document.documentElement.className += ' fonts-loaded';

    sessionStorage.foutFontsLoaded = true;
}

const isSettedUp = false;

export function useWebFonts(): void {
    if (Platform.OS !== 'web') {
        return;
    }

    // React.useEffect is not suitable here, as it should be done strictly once
    if (isSettedUp) {
        return;
    }

    setupFontsCss(InterFont);
    loadFonts(InterFont);
}
