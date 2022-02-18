import type { StyleProp, ViewStyle } from 'react-native';

export type ScrollableAdditionalProps = {
    containerStyle?: StyleProp<ViewStyle>;
    automaticallyAdjustKeyboardInsets?: boolean;
};
