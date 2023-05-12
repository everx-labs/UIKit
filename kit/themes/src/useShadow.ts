import React from 'react';
import { Platform } from 'react-native';
import { useTheme, ColorVariants, DarkTheme } from './Colors';

function useShadowParameters(isDarkTheme: boolean) {
    return React.useMemo(() => {
        /**
         * We need different opacity for different platforms in a dark theme,
         * because different platforms make different color mixing in shadows.
         */
        const opacity = Platform.select({
            android: isDarkTheme ? 0.3 : 0.1,
            ios: isDarkTheme ? 1 : 0.1,
            default: isDarkTheme ? 0.7 : 0.1,
        });
        /**
         * We need to apply different opacity for different Theme mode
         * and we can't do it through color because of the wrong color mixing on Android.
         */
        return {
            1: {
                offset: {
                    width: 0,
                    height: 1,
                },
                opacity,
                radius: 2,
            },
            2: {
                offset: {
                    width: 0,
                    height: 3,
                },
                opacity,
                radius: 8,
            },
            3: {
                offset: {
                    width: 0,
                    height: 6,
                },
                opacity,
                radius: 16,
            },
            4: {
                offset: {
                    width: 0,
                    height: 4,
                },
                opacity,
                radius: 16,
            },
            5: {
                offset: {
                    width: 0,
                    height: 8,
                },
                opacity,
                radius: 20,
            },
            6: {
                offset: {
                    width: -1,
                    height: 1,
                },
                opacity,
                radius: 32,
            },
        };
    }, [isDarkTheme]);
}

export function useShadow(level: 1 | 2 | 3 | 4 | 5 | 6) {
    const theme = useTheme();
    const isDarkTheme = React.useMemo(
        () => theme[ColorVariants.Shadow] === DarkTheme.Shadow,
        [theme],
    );
    const shadowParameters = useShadowParameters(isDarkTheme);
    return React.useMemo(
        () => ({
            shadowColor: theme[ColorVariants.Shadow],
            shadowOffset: shadowParameters[level].offset,
            shadowOpacity: shadowParameters[level].opacity,
            shadowRadius: shadowParameters[level].radius,
        }),
        [theme, level, shadowParameters],
    );
}
