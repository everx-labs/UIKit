import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorVariants } from '@tonlabs/uikit.themes';

import type { UISheetProps } from '../UISheet/UISheet';

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

export type UIMobileModalSheetProps = UIModalSheetProps & {
    style?: StyleProp<ViewStyle>;
};

export type UIDesktopModalSheetProps = UIModalSheetProps & { style?: StyleProp<ViewStyle> };

export type ModalSheetHeaderProps = {
    /**
     * Background color of the UIBottomSheet
     */
    backgroundColor?: ColorVariants;
    /**
     * TestID for testing purposes
     */
    testID?: string;
};
