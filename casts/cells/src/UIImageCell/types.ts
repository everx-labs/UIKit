import type { ImageSourcePropType } from 'react-native';

export type UIImageCellProps = {
    /**
     * Source of the image
     */
    image: ImageSourcePropType;
    /**
     * UIImageCell title
     */
    title?: string;
    /**
     * UIImageCell caption
     */
    caption?: string;
    /**
     * Used to display the data loading process
     */
    loading?: boolean;
    /**
     * Сallback called by clicking/tapping on the cell
     */
    onPress?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};
