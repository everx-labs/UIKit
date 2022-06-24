import * as React from 'react';
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import type { UISheetProps } from '../UISheet/UISheet';
import { UIMobileModalSheet } from './UIMobileModalSheet';
import { UIDesktopModalSheet } from './UIDesktopModalSheet';

const getIsMobile = (width: number, dividerWidth: number) => width <= dividerWidth;

export type UIModalSheetProps = UISheetProps & {
    maxMobileWidth: number;
    fixedMobileContainerHeight?: number;
    style?: StyleProp<ViewStyle>;
};

export function useIsMobile(maxMobileWidth: number) {
    const { width } = useWindowDimensions();

    return React.useMemo(() => {
        return getIsMobile(width, maxMobileWidth);
    }, [width, maxMobileWidth]);
}

export function UIModalSheet({ maxMobileWidth, style: styleProp, ...rest }: UIModalSheetProps) {
    const isMobile = useIsMobile(maxMobileWidth);
    const theme = useTheme();

    const style = React.useMemo(
        () => [
            styleProp,
            {
                backgroundColor: theme[ColorVariants.BackgroundPrimary],
            },
        ],
        [styleProp, theme],
    );

    if (isMobile) {
        return <UIMobileModalSheet {...rest} style={style} />;
    }

    return <UIDesktopModalSheet {...rest} style={style} />;
}
