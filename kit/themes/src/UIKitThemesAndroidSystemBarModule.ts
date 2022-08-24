import { NativeModules, StatusBarStyle } from 'react-native';

/** Native Module */
type UIKitThemesAndroidSystemBarModule = {
    /** Native method */
    setAppearance: (barStyle: StatusBarStyle) => void;
};

export const UIKitThemesAndroidSystemBarModule: UIKitThemesAndroidSystemBarModule =
    NativeModules.UIKitThemesAndroidSystemBarModule as UIKitThemesAndroidSystemBarModule;
