import { IUIAlertView, UIAlertView } from './UIAlertView';
import { IUIActionSheet, UIActionSheet } from './UIActionSheet';
import { IUINotice, UINotice } from './UINotice';
import {
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UIModalSheet,
    UIShareSheet,
} from './Sheets';
import { UIPushNotice } from './UIPushNotice';
import { UIInteractiveNotice } from './UIInteractiveNotice';
import { IUIMenu, UIMenu } from './UIMenu';
import { UITooltip } from './Tooltip';

export type { UIPushNoticeContentPublicProps } from './UIPushNotice';

export * from './ActionSheet/types';
export * from './Notice/types';
export * from './Menu/types';
export * from './UIAlert/types';
export * from './Sheets';
export * from './UIPushNotice';
export * from './UIInteractiveNotice';

const Notice: IUINotice = UINotice;
const ActionSheet: IUIActionSheet = UIActionSheet;
const AlertView: IUIAlertView = UIAlertView;
const Push: typeof UIPushNotice = UIPushNotice;
const InteractiveNotice: typeof UIInteractiveNotice = UIInteractiveNotice;
const Menu: IUIMenu = UIMenu;
const Tooltip: typeof UITooltip = UITooltip;

export const UIPopup = {
    ActionSheet,
    AlertView,
    Notice,
    InteractiveNotice,
    Push,
    Menu,
    Tooltip,
};

export const UIPopups = {
    UIPopup,
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UIModalSheet,
    UIShareSheet,
    UIMenu,
    Tooltip,
};
