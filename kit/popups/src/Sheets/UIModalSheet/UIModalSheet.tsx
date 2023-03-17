import * as React from 'react';
import { useWindowDimensions } from 'react-native';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import { UIMobileModalSheet } from './UIMobileModalSheet';
import { UIDesktopModalSheet } from './UIDesktopModalSheet';
import type { UIModalSheetProps } from './types';

const getIsMobile = (width: number, dividerWidth: number) => width <= dividerWidth;

export function useIsMobile(maxMobileWidth: number) {
    const { width } = useWindowDimensions();

    return React.useMemo(() => {
        return getIsMobile(width, maxMobileWidth);
    }, [width, maxMobileWidth]);
}

export function UIModalSheet(props: UIModalSheetProps) {
    const {
        maxMobileWidth,
        style: styleProp,
        backgroundColor = ColorVariants.BackgroundPrimary,
    } = props;
    const isMobile = useIsMobile(maxMobileWidth);
    const theme = useTheme();

    const style = React.useMemo(
        () => [
            styleProp,
            {
                backgroundColor: theme[backgroundColor],
            },
        ],
        [backgroundColor, styleProp, theme],
    );

    if (isMobile) {
        return <UIMobileModalSheet {...props} style={style} />;
    }

    return <UIDesktopModalSheet {...props} style={style} />;
}
