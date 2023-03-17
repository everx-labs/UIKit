import * as React from 'react';
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import type { UISheetProps } from '../UISheet/UISheet';
import { UIMobileModalSheet } from './UIMobileModalSheet';
import { UIDesktopModalSheet } from './UIDesktopModalSheet';

const getIsMobile = (width: number, dividerWidth: number) => width <= dividerWidth;

export type UIModalSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
    maxMobileWidth: number;
    /**
     * Whether UIBottomSheet has a header
     * Default: false
     */
    hasHeader?: boolean;
    /**
     * Background color of the UIBottomSheet
     */
    backgroundColor?: ColorVariants;
};

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
