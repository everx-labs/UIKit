import * as React from 'react';

import { UILabelRoles } from '@tonlabs/uikit.themes';

import { InputFont } from '../../Common';

export function useLabelRoles(font: InputFont | undefined) {
    const labelRoles = React.useMemo(() => {
        switch (font) {
            case InputFont.Surf:
                return {
                    placeholderRole: UILabelRoles.SurfParagraphNormal,
                    floatingLabelExpandedRole: UILabelRoles.SurfParagraphNormal,
                    floatingLabelFoldedRole: UILabelRoles.SurfParagraphSmall,
                    inputMessageRole: UILabelRoles.SurfParagraphSmall,
                };
            case InputFont.Default:
            default:
                return {
                    placeholderRole: UILabelRoles.ParagraphText,
                    floatingLabelExpandedRole: UILabelRoles.ParagraphText,
                    floatingLabelFoldedRole: UILabelRoles.ParagraphLabel,
                    inputMessageRole: UILabelRoles.ParagraphFootnote,
                };
        }
    }, [font]);
    return labelRoles;
}
