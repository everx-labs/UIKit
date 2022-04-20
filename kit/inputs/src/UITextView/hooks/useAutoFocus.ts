import { TextInput, Platform } from 'react-native';

export function useAutoFocus(ref: React.Ref<TextInput>, autoFocus: boolean | undefined) {
    if (Platform.OS === 'ios' && (global as any).UIKIT_NAVIGATION_AUTO_FOCUS_PATCH != null) {
        // See @tonlabs/uicast.stack-navigator -> useAutoFocus
        return (global as any).UIKIT_NAVIGATION_AUTO_FOCUS_PATCH(ref, autoFocus);
    }

    return autoFocus;
}
