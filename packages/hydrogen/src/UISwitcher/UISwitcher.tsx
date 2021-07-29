import * as React from 'react';
import { IconSwitcher } from './IconSwitcher';
import { UISwitcherProps, UISwitcherVariant } from './types';

export const UISwitcher: React.FC<UISwitcherProps> = (
    props: UISwitcherProps,
) => {
    switch (props.variant) {
        case UISwitcherVariant.Select:
        case UISwitcherVariant.Radio:
        case UISwitcherVariant.Check:
        case UISwitcherVariant.Toggle:
        default:
            return <IconSwitcher {...props} />;
    }
};
