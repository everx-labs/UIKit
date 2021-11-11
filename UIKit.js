// @flow
import { UIPopoverMenu, UIPopoverBackground } from './packages/navigation_legacy/src';

// Fix deprecated exports
const UIMenuView = UIPopoverMenu;
const UIMenuBackground = UIPopoverBackground;
export { UIPopoverMenu, UIPopoverBackground, UIMenuBackground, UIMenuView };

export {
    UIActionComponent,
    UIComponent,
    UIDetailsView,
    UIDetailsTable,
    UILink,
    UILoadMoreButton,
    UINetworkStatus,
    UIPureComponent,
    UIScaleButton,
    UISpinnerOverlay,
    UITransferInput,
} from './packages/components/src';

export {
    UIColor,
    UIColorPalette,
    UIConstant,
    UIDevice,
    UIEventHelper,
    UIFont,
    UITextStyle,
    UIFunction,
    UIStyle,
} from './packages/core/src';

export {
    UIController,
    UICountryPicker,
    UIModalController,
    UIDialogController,
    UIPopover,
    UIScreen,
    UIShareManager,
    UIShareScreen,
} from './packages/navigation_legacy/src';

export {
    UIAccountPicker,
    UIIdleDetector,
    UIProfileInitials,
    UISharedComponents,
} from './packages/legacy/src';

// $FlowExpectedError
export { UIAssets } from './kit/assets/src';

// Types
export type { UIAccountData } from './packages/legacy/src/UIAccountPicker/types/UIAccountData';
export type { PointerEvents, PositionObject } from './packages/core';
export type { UIColorData, UIColorThemeNameType } from './packages/core/src/UIColor/UIColorTypes';
export type {
    NumberParts,
    StringLocaleInfo,
    NumberPartsOptions,
} from './packages/core/src/UIFunction';
export type { UIActionComponentProps as ActionProps } from './packages/components/src/UIActionComponent';
export type { DetailsList } from './packages/components/src/UIDetailsTable';
export type { MenuItemType } from './packages/navigation_legacy/src/UIPopoverMenu/MenuItem';
export type { ShareOptions } from './packages/navigation_legacy/src/UIShareManager';
export type { Country } from './packages/navigation_legacy/src/UICountryPicker';
export type { ContentInset } from './packages/navigation_legacy/src/UIController';
