// eslint-disable-next-line no-shadow
export enum UISwitcherVariant {
    Select = 'Select',
    Radio = 'Radio',
    Check = 'Check',
    Toggle = 'Toggle',
}

export type UISwitcherProps = {
    /**
     * Variant of the switcher
     */
    variant: UISwitcherVariant;
    /**
     * Is the switcher active
     * The component is controlled by this prop
     */
    active: boolean;
    /**
     * Disabled status of the switcher
     * disable onPress if true and change styles
     */
    disabled?: boolean;
    /**
     * The callback that is called by clicking/tapping on the switcher
     */
    onPress?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

// eslint-disable-next-line no-shadow
export enum IconSwitcherState {
    NotActive = 0,
    Active = 1,
}

// eslint-disable-next-line no-shadow
export enum PressSwitcherState {
    NotPressed = 0,
    Pressed = 1,
}

// eslint-disable-next-line no-shadow
export enum SwitcherState {
    Active = 0,
    Hovered = 1,
    Pressed = 2,
}
