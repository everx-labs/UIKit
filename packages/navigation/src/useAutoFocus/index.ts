import type { TextInput } from 'react-native';

// @ts-ignore
// eslint-disable-next-line import/extensions, import/no-unresolved
import { useAutoFocus as useAutoFocusHook } from './useAutoFocus';

export const useAutoFocus: (
    ref: React.Ref<TextInput>,
    autoFocus: boolean | undefined,
) => boolean | undefined = useAutoFocusHook;

(global as any).UIKIT_NAVIGATION_AUTO_FOCUS_PATCH = useAutoFocusHook;
