import React from 'react';

import {
    UIComponent,
    UISpinnerOverlay,
    UINotice,
    UICompatibilityView,
    UILayoutManager,
} from '@tonlabs/uikit.components';

export default class UISharedComponents extends UIComponent {
    render() {
        return (
            <React.Fragment>
                <UISpinnerOverlay masterSpinner />
                <UINotice />
                <UICompatibilityView />
                <UILayoutManager />
            </React.Fragment>
        ); // UIActionSheet & UIAlertView should be placed above the content
    }
}
