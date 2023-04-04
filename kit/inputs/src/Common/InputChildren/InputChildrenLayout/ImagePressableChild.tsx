import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UIAnimatedImage, UIImageProps } from '@tonlabs/uikit.media';

import { defaultInputColorScheme, inputChildrenPressableColors } from '../constants';
import { InputColorScheme } from '../../constants';

type ImagePressableChildProps = Omit<UIImageProps, 'tintColor'> & {
    colorScheme?: InputColorScheme;
};

export function ImagePressableChild({
    colorScheme = InputColorScheme.Default,
    ...props
}: ImagePressableChildProps) {
    const colors = React.useMemo<PressableColors>(() => {
        return inputChildrenPressableColors[colorScheme ?? defaultInputColorScheme];
    }, [colorScheme]);

    const contentColor = usePressableContentColor(colors);

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    return <UIAnimatedImage {...props} animatedProps={animatedImageProps} />;
}
