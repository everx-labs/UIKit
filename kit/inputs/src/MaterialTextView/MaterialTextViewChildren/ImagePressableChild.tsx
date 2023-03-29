import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UIAnimatedImage, UIImageProps } from '@tonlabs/uikit.media';

import { defaultPressableChildColors } from './constants';

type ImagePressableChildProps = Omit<UIImageProps, 'tintColor'> & {
    colors?: PressableColors;
};

export function ImagePressableChild({ colors, ...restProps }: ImagePressableChildProps) {
    const contentColors = React.useMemo(() => {
        return colors ?? defaultPressableChildColors;
    }, [colors]);

    const contentColor = usePressableContentColor(contentColors);

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    return <UIAnimatedImage {...restProps} animatedProps={animatedImageProps} />;
}
