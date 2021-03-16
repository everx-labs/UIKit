import * as React from 'react';
import { UIFoldingNotice, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

const icon = require('../assets/icon/img.png');
// const symbol = require('../assets/symbol/symbol.png');

export function UIPromoNotice() {
    const [visible, setVisible] = React.useState(true);
    const [folded, setFolded] = React.useState(false);

    // use effect for hiding or showing promo notice on the screen
    // also for folding or not state

    return (
        <UIFoldingNotice
            visible={visible}
            folded={folded}
            icon={icon}
        >
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.ParagraphFootnote}
            >
                Download application
            </UILabel>
        </UIFoldingNotice>
    );
}
