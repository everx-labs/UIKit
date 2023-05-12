import * as React from 'react';

import {
    PressableColors,
    usePressableAnimatedImageTintColorProps,
    usePressableContentColor,
} from '@tonlabs/uikit.controls';
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

    const animatedImageProps = usePressableAnimatedImageTintColorProps(contentColor);

    return <UIAnimatedImage {...props} {...animatedImageProps} />;
}
