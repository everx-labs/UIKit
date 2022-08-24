/* eslint-disable global-require */
import FontFaceObserver from 'fontfaceobserver-es';

import '../assets/css/Inter-Regular.css';
import '../assets/css/Inter-Medium.css';
import '../assets/css/Inter-SemiBold.css';
import '../assets/css/Inter-Light.css';
import '../assets/css/Manrope-Bold.css';
import '../assets/css/Manrope-ExtraBold.css';
import '../assets/css/Manrope-Medium.css';
import '../assets/css/Manrope-Regular.css';
import '../assets/css/Manrope-SemiBold.css';

import { Font, ManropeFont, getIsLegacyTypographyEnabled } from '../Typography';
import { FontLegacy, InterFont } from '../TypographyLegacy';

const SYSTEM_FONTS =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

function setupFontsCss(font: Font) {
    const headElement = document.getElementsByTagName('head')[0];

    const styleNode = headElement.appendChild(document.createElement('style'));
    const styleHTML = `
body {
    font-family: ${SYSTEM_FONTS};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.fonts-loaded body {
    font-family: '${font.medium.fontFamily}', ${SYSTEM_FONTS};
}
.fonts-loaded strong {
    font-family: '${font.bold.fontFamily}', ${SYSTEM_FONTS};
}
.fonts-loaded em {
    font-family: '${font.regular.fontFamily}', ${SYSTEM_FONTS};
}
.fonts-loaded strong em,
.fonts-loaded em strong {
    font-family: '${font.semiBold.fontFamily}', ${SYSTEM_FONTS};
}
`;

    styleNode.innerHTML = styleHTML;
}

function setupFontsCssLegacy(font: FontLegacy) {
    const headElement = document.getElementsByTagName('head')[0];

    const styleNode = headElement.appendChild(document.createElement('style'));
    const styleHTML = `
body {
    font-family: ${SYSTEM_FONTS};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
async function loadFonts(font: Font | FontLegacy) {
    // Optimization for Repeat Views
    if (sessionStorage.foutFontsLoaded) {
        document.documentElement.className += ' fonts-loaded';
    }

    await Promise.all(
        Object.values(font).map(fontVariant => {
            const observer = new FontFaceObserver(fontVariant.fontFamily);
            return observer.load();
        }),
    );

    document.documentElement.className += ' fonts-loaded';

    sessionStorage.foutFontsLoaded = true;
}

const isSettedUp = false;

export function useWebFonts(): void {
    // React.useEffect is not suitable here, as it should be done strictly once
    if (isSettedUp) {
        return;
    }

    if (getIsLegacyTypographyEnabled()) {
        setupFontsCssLegacy(InterFont);
        loadFonts(InterFont);
    } else {
        setupFontsCss(ManropeFont);
        loadFonts(ManropeFont);
    }
}
