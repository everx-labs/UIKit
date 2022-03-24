import type React from 'react';
import type { ViewStyle, StyleProp } from 'react-native';

export type UIAccountData = {
    address: string;
    name: string;
};

export type CellContainerPropsBase = {
    notActive?: boolean;
    containerStyle: StyleProp<ViewStyle>;
    onPressAccount?: () => void;
};

export type AccountPickerCellProps = CellContainerPropsBase & {
    account?: UIAccountData | null;
    onPressAccount?: () => void;
    displayNameOnly?: boolean;
    right?: React.ReactElement;
};

export type AccountPickerProps = AccountPickerCellProps & {
    title: string;
};
