import { useEffect } from 'react';

import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export function UIAndroidNavigationBar({
    color = ColorVariants.BackgroundPrimary,
    isLight = true,
}: {
    color: ColorVariants;
    isLight?: boolean;
}) {
    const theme = useTheme();

    useEffect(() => {
        changeNavigationBarColor(theme[color] as string, isLight, true);
    }, [theme, color, isLight]);

    return null;
}
