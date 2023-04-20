import * as React from 'react';

import { UILabelRoles } from '@tonlabs/uikit.themes';

import { InputFont } from '../../../Common';

export function useFloatingLabelRoles(font: InputFont | undefined) {
    const labelRoles = React.useMemo(() => {
        switch (font) {
            case InputFont.Surf:
                return {
                    expandedLabelRole: UILabelRoles.SurfParagraphNormal,
                    foldedLabelRole: UILabelRoles.SurfParagraphSmall,
                };
            case InputFont.Default:
            default:
                return {
                    expandedLabelRole: UILabelRoles.ParagraphText,
                    foldedLabelRole: UILabelRoles.ParagraphLabel,
                };
        }
    }, [font]);
    return labelRoles;
}
