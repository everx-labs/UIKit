import React from 'react';

import {
    UIComponent,
    UISpinnerOverlay,
    UINotice,
    UIAlertView,
    UIDropdownAlert,
    UIActionSheet,
    UICustomSheet,
    UICompatibilityView,
    UILayoutManager,
} from '@uikit/components';

export default class UISharedComponents extends UIComponent {
    render() {
        return (
            <React.Fragment>
                <UISpinnerOverlay masterSpinner />
                <UINotice />
                <UIDropdownAlert />
                <UICustomSheet />
                <UIActionSheet />
                <UIAlertView />
                <UICompatibilityView />
                <UILayoutManager />
            </React.Fragment>
        ); // UIActionSheet & UIAlertView should be placed above the content
    }
}
