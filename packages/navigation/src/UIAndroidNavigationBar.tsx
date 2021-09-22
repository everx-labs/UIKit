import { useEffect } from 'react';

import { useIsDarkColor } from '@tonlabs/uikit.themes';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
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
