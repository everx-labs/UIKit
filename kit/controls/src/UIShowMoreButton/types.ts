import type { UIShowMoreButtonHeight, UIShowMoreButtonType } from './constants';

export type UIShowMoreButtonProps = {
    /**
     * Text content of the button
     */
    label: string;
    /**
     * Type of the button
     * @default UIShowMoreButtonType.Default
     */
    type?: UIShowMoreButtonType;
    /**
     * Shows the "loading" state of the button
     */
    progress?: boolean;
    /**
     * Size of the button
     * @default UIShowMoreButtonHeight.Medium
     */
    height?: UIShowMoreButtonHeight;
    /**
     * Callback that calls when button was tapped
     */
    onPress?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};
