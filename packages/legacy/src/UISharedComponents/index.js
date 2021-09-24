import React from 'react';

import {
    UIComponent,
    UISpinnerOverlay,
    UICompatibilityView,
    UILayoutManager,
} from '@tonlabs/uikit.components';

export default class UISharedComponents extends UIComponent {
    render() {
        return (
            <>
                <UISpinnerOverlay masterSpinner />
                <UICompatibilityView />
                <UILayoutManager />
            </>
        ); // UIActionSheet & UIAlertView should be placed above the content
    }
}
