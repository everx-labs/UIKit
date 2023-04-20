import * as React from 'react';

import { UILabelRoles } from '@tonlabs/uikit.themes';

import { InputFont } from '../constants';

export function useInputChildrenLabelRole(font: InputFont | undefined) {
    const labelRole = React.useMemo(() => {
        switch (font) {
            case InputFont.Surf:
                return UILabelRoles.SurfActionNormal;
            case InputFont.Default:
            default:
                return UILabelRoles.Action;
        }
    }, [font]);

    return labelRole;
}
