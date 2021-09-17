import * as React from 'react';
import { IconSwitcher } from './IconSwitcher';
import { ToggleSwitcher } from './ToggleSwitcher';
import { UISwitcherProps, UISwitcherVariant } from './types';

export const UISwitcher: React.FC<UISwitcherProps> = (props: UISwitcherProps) => {
    switch (props.variant) {
        case UISwitcherVariant.Toggle:
            return <ToggleSwitcher {...props} />;
        case UISwitcherVariant.Select:
        case UISwitcherVariant.Radio:
        case UISwitcherVariant.Check:
        default:
            return <IconSwitcher {...props} />;
    }
};
