import { useEffect, memo } from 'react';
import { NativeModules } from 'react-native';

import { useIsDarkColor } from './useIsDarkColor';
import { ColorVariants } from './Colors';

const { UIKitThemesAndroidNavigationBarModule } = NativeModules;

export const UIAndroidNavigationBar = memo(function UIAndroidNavigationBar({
    color = ColorVariants.BackgroundPrimary,
}: {
    color?: ColorVariants;
}) {
    const isDark = useIsDarkColor(color);

    useEffect(() => {
        if (UIKitThemesAndroidNavigationBarModule == null) {
            return;
        }

        UIKitThemesAndroidNavigationBarModule.setAppearance(
            isDark ? 'light-content' : 'dark-content',
        );
    }, [isDark]);

    return null;
});
