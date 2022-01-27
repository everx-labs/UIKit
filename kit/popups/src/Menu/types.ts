import type React from 'react';
import type { NativeMethods } from 'react-native';

// eslint-disable-next-line no-shadow
export enum UIMenuActionType {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Disabled = 'Disabled',
}

export type UIMenuActionProps = {
    /**
     * Type of UIMenuAction
     */
    type: UIMenuActionType;
    /**
     * Title
     */
    title: string;
    /**
     * The callback that is called when tapping on the action
     */
    onPress: () => void;
};

export type UIMenuContainerChildType = React.ReactElement<UIMenuActionProps>;
export type UIMenuContainerProps = {
    /**
     * State of visibility
     */
    visible: boolean;
    /**
     * A callback that is called when the menu wants to be closed.
     *
     * One have to set `visible` to `false` in this callback,
     * as component is controlled.
     */
    onClose: () => void;
    /**
     * The ref of the element that shows the menu.
     * It is used to position the menu
     */
    targetRef: React.RefObject<NativeMethods>;
    /**
     * List of UIMenuAction
     * There can be no more than one child with the "Cancel" UIMenuActionType.
     */
    children: UIMenuContainerChildType | (UIMenuContainerChildType | UIMenuContainerChildType[])[];
    /**
     * ID for usage in tests
     */
    testID?: string;
};
