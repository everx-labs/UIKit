import type { UICustomKeyboardView } from '../useCustomKeyboard';

export type UIInputAccessoryViewProps = {
    children: React.ReactNode;
    managedScrollViewNativeID?: string;
    customKeyboardView?: UICustomKeyboardView;
};
