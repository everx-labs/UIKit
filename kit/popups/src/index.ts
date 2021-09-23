import { IUIAlertView, UIAlertView } from './UIAlertView';
import { IUIActionSheet, UIActionSheet } from './UIActionSheet';
import { IUINotice, UINotice } from './UINotice';
import { UICardSheet, UIBottomSheet, UIFullscreenSheet, UISheet } from './Sheets';

export * from './Notice/types';
export * from './ActionSheet/types';
export * from './UIAlert/types';
export * from './Sheets';

export * from './AnimationHelpers';

const Notice: IUINotice = UINotice;
const ActionSheet: IUIActionSheet = UIActionSheet;
const AlertView: IUIAlertView = UIAlertView;

export const UIPopup = {
    ActionSheet,
    AlertView,
    Notice,
};

export const UIPopups = {
    UIPopup,
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UISheet,
};
