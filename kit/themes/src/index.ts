import * as AnimateableText from './AnimateableText';
import * as Colors from './Colors';
import * as Typography from './Typography';
import * as UIBackgroundView from './UIBackgroundView';
import * as UILabel from './UILabel';
import * as UIStatusBar from './UIStatusBar';

import * as useWebFonts from './useWebFonts';
import * as makeStyles from './makeStyles';
import * as useColorParts from './useColorParts';
import * as useColorShades from './useColorShades';
import * as useIsDarkColor from './useIsDarkColor';

export * from './AnimateableText';
export * from './Colors';
export * from './Typography';
export * from './UIBackgroundView';
export * from './UILabel';
export * from './UIStatusBar';
export * from './UIAndroidNavigationBar';

export * from './useWebFonts';
export * from './makeStyles';
export * from './useColorParts';
export * from './useColorShades';
export * from './useIsDarkColor';

export * from './makeRNSvgReanimatedCompat';

export const UIThemes = {
    AnimateableText,
    Colors,
    Typography,
    UIBackgroundView,
    UILabel,
    UIStatusBar,

    useWebFonts,
    makeStyles,
    useColorParts,
    useColorShades,
    useIsDarkColor,
};
export default UIThemes;
