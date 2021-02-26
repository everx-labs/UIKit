import { useEffect } from 'react';

import {
    useTheme,
    ColorVariants,
    useIsDarkColor,
} from '@tonlabs/uikit.hydrogen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export function UIAndroidNavigationBar({
    color = ColorVariants.BackgroundPrimary,
}: {
    color?: ColorVariants;
}) {
    const theme = useTheme();

    const isDark = useIsDarkColor(color);

    useEffect(() => {
        changeNavigationBarColor(theme[color] as string, !isDark, true);
    }, [theme, color, isDark]);

    return null;
}
