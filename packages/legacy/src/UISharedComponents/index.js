import React from 'react';

import { UIComponent, UISpinnerOverlay } from '@tonlabs/uikit.components';

export default class UISharedComponents extends UIComponent {
    render() {
        return (
            <>
                <UISpinnerOverlay masterSpinner />
            </>
        ); // UIActionSheet & UIAlertView should be placed above the content
    }
}
