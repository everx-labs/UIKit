// @flow
import {
    UIPopoverMenu,
    UIPopoverBackground,
} from './packages/navigation_legacy/src';

// Fix deprecated exports
const UIMenuView = UIPopoverMenu;
const UIMenuBackground = UIPopoverBackground;
export { UIPopoverMenu, UIPopoverBackground, UIMenuBackground, UIMenuView };

export {
    UIActionComponent,
    UIActionIcon,
    UIActionImage,
    UIAlert,
    UIAlertView,
    UIAmountInput,
    UIBadge,
    UIBullet,
    UIButton,
    UIButtonGroup,
    UIBankCardNumberInput,
    UICard,
    UICheckboxItem,
    UICompatibilityView,
    UIComponent,
    UIDateInput,
    UIDetailsInput,
    UIDetailsCheckbox,
    UIDetailsToggle,
    UIDetailsRadio,
    UIDetailsSwitcher,
    UIDetailsView,
    UIDetailsTable,
    UIDot,
    UIDropdownAlert,
    UIEmailInput,
    UIGrid,
    UIGridColumn,
    UIImageButton,
    UILayoutManager,
    UILink,
    UILinkInput,
    UIListHeader,
    UILoadMoreButton,
    UINetworkStatus,
    UINotice,
    UINotificationBadge,
    UINumberInput,
    UIPhoneInput,
    UIPinCodeInput,
    UIPureComponent,
    UIQRCode,
    UIRadioButtonList,
    UIScaleButton,
    UISectionHeader,
    UIContractAddressInput,
    UIPushNotification,
    UISeparator,
    UISlider,
    UISpinnerOverlay,
    UIStepBar,
    UITabView,
    UITag,
    UITextButton,
    UITextInput,
    UIToastMessage,
    UIToggle,
    UITooltip,
    UITransferInput,
    UIUploadFileInput,
    UIUserAgent,
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
    UIActionSheet,
    UIBottomBar,
    UIController,
    UICountryPicker,
    UIModalController,
    UIDialogController,
    UIImageView,
    UIErrorScreen,
    UIBreadCrumbs,
    UIPopover,
    UIScreen,
    UIShareManager,
    UIShareScreen,
    UIUnfold,
} from './packages/navigation_legacy/src';

export {
    UISplitViewController,
    UINavigationBackButton,
    UINavigationBar,
    UINavigationIconButton,
    UINavigationTextButton,
    UINavigator,
    UIAccountPicker,
    UIBalanceView,
    UIAnimatedBalanceView,
    UIFeedback,
    UIPushFeedback,
    UIFlashMessage,
    UIIdleDetector,
    UILandingView,
    UIProfileInitials,
    UISharedComponents,
    UIStubPage,
    UITransactionView,
    UITransitionView,
} from './packages/legacy/src';

export { UIAssets } from './packages/assets/src';

// Types
export type { UIAccountData } from './packages/legacy/src/UIAccountPicker/types/UIAccountData';
export type {
    CreateNavigationOptions,
    ReactNavigation,
} from './packages/legacy/src/UINavigationBar';
export type {
    NavigationProps,
    UINavigationRoute,
    UINavigationRouting,
} from './packages/legacy/src/UINavigator';
export type { UIFeedbackSubmitFunc } from './packages/legacy/src/UIFeedback';
export type { PointerEvents, PositionObject } from './packages/core';
export type {
    UIColorData,
    UIColorThemeNameType,
} from './packages/core/src/UIColor/UIColorTypes';
export type {
    NumberParts,
    StringLocaleInfo,
    NumberPartsOptions,
} from './packages/core/src/UIFunction';
export type { UIActionComponentProps as ActionProps } from './packages/components/src/UIActionComponent';
export type { DetailsList } from './packages/components/src/UIDetailsTable';
export type { MenuItemType } from './packages/navigation_legacy/src/UIActionSheet/MenuItem';
export type { ShareOptions } from './packages/navigation_legacy/src/UIShareManager';
export type { Country } from './packages/navigation_legacy/src/UICountryPicker';
export type {
    ContentInset,
    ControllerProps,
} from './packages/navigation_legacy/src/UIController';
export type {
    ModalControllerProps,
    ModalControllerState,
} from './packages/navigation_legacy/src/UIModalController';
export type { ContentOffset } from './packages/navigation_legacy/src/UIScreen';
