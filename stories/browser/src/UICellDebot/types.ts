import type { ImageSourcePropType } from 'react-native';

export type UICellDebotProps = {
    /**
     * Source of the image
     */
    image: ImageSourcePropType;
    /**
     * UICellDebot title
     */
    title?: string;
    /**
     * UICellDebot caption
     */
    caption?: string;
    /**
     * Used to display the data loading process
     */
    loading?: boolean;
    /**
     * Callback called by clicking/tapping on the cell
     */
    onPress?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};
