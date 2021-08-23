import React from 'react';

import {
    UIComponent,
    UISpinnerOverlay,
    UINotice,
    UIDropdownAlert,
    UICompatibilityView,
    UILayoutManager,
} from '@tonlabs/uikit.components';

export default class UISharedComponents extends UIComponent {
    render() {
        return (
            <React.Fragment>
                <UISpinnerOverlay masterSpinner />
                <UINotice />
                <UIDropdownAlert />
                <UICompatibilityView />
                <UILayoutManager />
            </React.Fragment>
        ); // UIActionSheet & UIAlertView should be placed above the content
    }
}
