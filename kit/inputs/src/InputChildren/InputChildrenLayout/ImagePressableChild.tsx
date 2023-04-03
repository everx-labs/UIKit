import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UIAnimatedImage, UIImageProps } from '@tonlabs/uikit.media';

import { defaultInputColorScheme, inputChildrenColors } from '../constants';
import { InputChildrenColorScheme } from '../types';

type ImagePressableChildProps = Omit<UIImageProps, 'tintColor'> & {
    colorScheme?: InputChildrenColorScheme;
};

export function ImagePressableChild({
    colorScheme = InputChildrenColorScheme.Default,
    ...props
}: ImagePressableChildProps) {
    const colors = React.useMemo<PressableColors>(() => {
        return inputChildrenColors[colorScheme ?? defaultInputColorScheme];
    }, [colorScheme]);

    const contentColor = usePressableContentColor(colors);

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    return <UIAnimatedImage {...props} animatedProps={animatedImageProps} />;
}
