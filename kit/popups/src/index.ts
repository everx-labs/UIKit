import { IUIAlertView, UIAlertView } from './UIAlertView';
import { IUIActionSheet, UIActionSheet } from './UIActionSheet';
import { IUINotice, UINotice } from './UINotice';
import { UICardSheet, UIBottomSheet, UIFullscreenSheet, UISheet } from './Sheets';
import { UIPushNotice } from './UIPushNotice';

export type { UIPushNoticeContentPublicProps } from './UIPushNotice';

export * from './Notice/types';
export * from './ActionSheet/types';
export * from './UIAlert/types';
export * from './Sheets';
export * from './UIPushNotice';
export * from './Foreground';

export * from './AnimationHelpers';

const Notice: IUINotice = UINotice;
const ActionSheet: IUIActionSheet = UIActionSheet;
const AlertView: IUIAlertView = UIAlertView;
const Push: typeof UIPushNotice = UIPushNotice;

export const UIPopup = {
    ActionSheet,
    AlertView,
    Notice,
    Push,
};

export const UIPopups = {
    UIPopup,
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UISheet,
};
