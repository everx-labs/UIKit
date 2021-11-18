import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

export type UIAccountData = {
    address: string;
    name: string;
    hdIndex: number;
    balance: number;
    public: boolean;
};

export type AccountPickerCellProps = {
    account: UIAccountData;
    onPressAccount?: () => void;
    displayNameOnly?: boolean;
    notActive?: boolean;
    right?: any;
    containerStyle: ViewStyleProp;
};

export type AccountPickerProps = AccountPickerCellProps & {
    title: string;
};
