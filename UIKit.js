// @flow
import {
    UIPopoverMenu,
    UIPopoverBackground,
} from './packages/navigation/src';

// Fix deprecated exports
const UIMenuView = UIPopoverMenu;
const UIMenuBackground = UIPopoverBackground;
export {
    UIPopoverMenu,
    UIPopoverBackground,
    UIMenuBackground,
    UIMenuView,
};

export {
    UIActionComponent,
    UIActionIcon,
    UIActionImage,
    UIAlert,
    UIAlertView,
    UIAmountInput,
    UIBackgroundView,
    UIBadge,
    UIBanner,
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
    UIImage,
    UIImageButton,
    UILabel,
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
    UISearchBar,
    UISectionHeader,
    UISeedPhraseInput,
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
    UIController,
    UICountryPicker,
    UICustomSheet,
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
} from './packages/navigation/src';

export {
    UIBottomBar,
    UIDetailsButton,
    UISplitViewController,
    UINavigationBackButton,
    UINavigationBar,
    UINavigationCloseButton,
    UINavigationIconButton,
    UINavigationPlusButton,
    UINavigationTextButton,
    UINavigator,
    UIAccountPicker,
    UIAccountPickerScreen,
    UIBalanceView,
    UIAnimatedBalanceView,
    UIFeedback,
    UIPushFeedback,
    UIFlashMessage,
    UIIdleDetector,
    UILandingView,
    UIProfilePhoto,
    UIProfileInitials,
    UIProfileView,
    UIQuote,
    UISharedComponents,
    UIStubPage,
    UITokenCell,
    UITransactionView,
    UITransitionView,
} from './packages/legacy/src';

export {
    UIChatInput,
    UIChatMessageCell,
    UIChatActionCell,
    UIChatDocumentCell,
    UIChatImageCell,
    UIChatStickerCell,
    UIChatTransactionCell,
    ChatMessageContent,
    ChatMessageMetaContent,
    ChatMessageStatus,
    TypeOfTransaction,
    TypeOfAction,
    TypeOfActionDirection,
} from './packages/chat/src';

export { default as UIAssets } from './packages/assets';

export { uiLocalized as UILocalized } from './packages/localization';

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
export type {
    PointerEvents,
    PositionObject,
} from './packages/core/types';
export type {
    UIColorData,
    UIColorThemeNameType,
} from './packages/core/src/UIColor/UIColorTypes';
export type {
    NumberParts,
    StringLocaleInfo,
    NumberPartsOptions,
} from './packages/core/src/UIFunction';
export type { ActionProps } from './packages/components/src/UIActionComponent';
export type { DetailsList } from './packages/components/src/UIDetailsTable';
export type { LabelRoleValue } from './packages/components/src/UILabel';
export type { MenuItemType } from './packages/navigation/src/UIActionSheet/MenuItem';
export type { ShareOptions } from './packages/navigation/src/UIShareManager';
export type { Country } from './packages/navigation/src/UICountryPicker';
export type {
    ContentInset,
    ControllerProps,
} from './packages/navigation/src/UIController';
export type {
    ModalControllerProps,
    ModalControllerState,
} from './packages/navigation/src/UIModalController';
export type { ContentOffset } from './packages/navigation/src/UIScreen';
export type {
    UISticker,
    UIStickerPackage,
    UIChatCellInfo,
    ChatMessageStatusType,
    UIChatMessage,
} from './packages/chat/src/extras';
