import { IUIAlertView, UIAlertView } from './UIAlertView';
import { IUIActionSheet, UIActionSheet } from './UIActionSheet';
import { IUINotice, UINotice } from './UINotice';
import { UICardSheet, UIBottomSheet, UIFullscreenSheet, UIModalSheet } from './Sheets';
import { UIPushNotice } from './UIPushNotice';
import { IUIMenu, UIMenu } from './UIMenu';

export type { UIPushNoticeContentPublicProps } from './UIPushNotice';

export * from './Notice/types';
export * from './ActionSheet/types';
export * from './UIAlert/types';
export * from './Sheets';
export * from './UIPushNotice';

const Notice: IUINotice = UINotice;
const ActionSheet: IUIActionSheet = UIActionSheet;
const AlertView: IUIAlertView = UIAlertView;
const Push: typeof UIPushNotice = UIPushNotice;
const Menu: IUIMenu = UIMenu;

export const UIPopup = {
    ActionSheet,
    AlertView,
    Notice,
    Push,
    Menu,
};

export const UIPopups = {
    UIPopup,
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UIModalSheet,
    UIMenu,
};
