import type { StyleProp, ViewStyle } from 'react-native';

export type ScrollableAdditionalProps = {
    containerStyle?: StyleProp<ViewStyle>;
    automaticallyAdjustKeyboardInsets?: boolean;
    /**
     * The prop behaviour controlls whether
     * when keyboard insets are applied automatically
     * `contentInset`s should be summed up to final applied insets
     * or it should be excluded from them.
     *
     * By default - exclusive.
     */
    keyboardInsetAdjustmentBehavior?: 'inclusive' | 'exclusive';
};
