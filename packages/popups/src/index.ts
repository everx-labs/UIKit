import { IUIAlertView, UIAlertView } from './UIAlertView';
import { IUIActionSheet, UIActionSheet } from './UIActionSheet';
import { IUINotice, UINotice } from './UINotice';

const Notice: IUINotice = UINotice;
const ActionSheet: IUIActionSheet = UIActionSheet;
const AlertView: IUIAlertView = UIAlertView;

export const UIPopup = {
    ActionSheet,
    AlertView,
    Notice,
};
