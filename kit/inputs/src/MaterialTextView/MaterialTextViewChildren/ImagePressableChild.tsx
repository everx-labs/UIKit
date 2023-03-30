import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedProps } from 'react-native-reanimated';

import { PressableColors, usePressableContentColor } from '@tonlabs/uikit.controls';
import { UIAnimatedImage, UIImageProps } from '@tonlabs/uikit.media';

import { MaterialTextViewContext } from '../MaterialTextViewContext';
import { materialTextViewChildrenColors } from '../constants';

type ImagePressableChildProps = Omit<UIImageProps, 'tintColor'>;

export function ImagePressableChild(props: ImagePressableChildProps) {
    const { colorScheme } = React.useContext(MaterialTextViewContext);

    const colors = React.useMemo<PressableColors>(() => {
        return materialTextViewChildrenColors[colorScheme];
    }, [colorScheme]);

    const contentColor = usePressableContentColor(colors);

    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value as ColorValue,
        };
    });

    return <UIAnimatedImage {...props} animatedProps={animatedImageProps} />;
}
