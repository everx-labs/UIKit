import * as React from 'react';
import type { ColorValue } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';

import { UILabelAnimated } from '@tonlabs/uikit.themes';

import type { UIPressableLabelContentProps } from './types';
import { defaultUIPressableLabelColors } from './constants';
import { usePressableContentColor } from '../Pressable';

export function UIPressableLabelContent({
    colors,
    ...uiLabelBasicProps
}: UIPressableLabelContentProps) {
    const contentColors = React.useMemo(() => {
        return colors ?? defaultUIPressableLabelColors;
    }, [colors]);

    const contentColor = usePressableContentColor(contentColors);

    const animatedLabelProps = useAnimatedStyle(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    return <UILabelAnimated {...uiLabelBasicProps} animatedProps={animatedLabelProps} />;
}
