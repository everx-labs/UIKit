import { IUIAlertView, UIAlertView } from './UIAlertView';
import { IUIActionSheet, UIActionSheet } from './UIActionSheet';
import { IUINotice, UINotice } from './UINotice';
import { UIPushNotice } from './UIPushNotice';
export type { UIPushNoticeContentPublicProps } from './UIPushNotice';

export * from './Notice/types';
export * from './ActionSheet/types';
export * from './UIAlert/types';

const Notice: IUINotice = UINotice;
const ActionSheet: IUIActionSheet = UIActionSheet;
const AlertView: IUIAlertView = UIAlertView;

export const UIPopup = {
    ActionSheet,
    AlertView,
    Notice,
    Push: UIPushNotice,
};

export { UIPushNotice };
