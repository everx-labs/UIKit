import React from 'react';
import UIComponent from '../UIComponent';
import UISpinnerOverlay from '../UISpinnerOverlay';
import UINotice from '../notifications/UINotice';
import UIAlertView from '../popup/UIAlertView';
import UIDropdownAlert from '../popup/UIDropdownAlert';
import UIActionSheet from '../menus/UIActionSheet';
import UICustomSheet from '../menus/UICustomSheet';
import UICompatibilityView from '../../helpers/UICompatibilityView';
import UILayoutManager from '../../helpers/UILayoutManager';

export default class UISharedComponents extends UIComponent {
    render() {
        return (
            <React.Fragment>
                <UISpinnerOverlay masterSpinner />
                <UINotice />
                <UIAlertView />
                <UIDropdownAlert />
                <UIActionSheet />
                <UICustomSheet />
                <UICompatibilityView />
                <UILayoutManager />
            </React.Fragment>
        );
    }
}
