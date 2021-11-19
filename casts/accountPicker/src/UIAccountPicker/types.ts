import type React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

export type UIAccountData = {
    address: string;
    name: string;
    hdIndex: number;
    balance: number;
    public: boolean;
};

export type CellContainerPropsBase = {
    notActive?: boolean;
    containerStyle: ViewStyleProp;
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
