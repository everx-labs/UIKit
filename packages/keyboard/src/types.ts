import type { ColorValue } from 'react-native';

export type OnHeightChange = (height: number) => void;

export type OnItemSelected<T = any> = (
    id: string | undefined,
    item: T,
) => void | Promise<void>;

export type UICustomKeyboardView = {
    moduleName: string;
    button: React.ComponentType<any>;
    component: React.ComponentType<any>;
    initialProps?: Record<string, unknown>;
    backgroundColor?: ColorValue;
    // onItemSelected: OnItemSelected;
};

export type UIInputAccessoryViewProps = {
    children: React.ReactNode;
    managedScrollViewNativeID?: string;
    customKeyboardView?: UICustomKeyboardView;
};
