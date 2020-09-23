import UIAccountPicker from './components/UIAccountPicker';
import UIAccountPickerScreen from './components/UIAccountPicker/controllers/UIAccountPickerScreen';
import UIActionComponent from './components/UIActionComponent';
import UIActionIcon from './components/buttons/UIActionIcon';
import UIActionImage from './components/images/UIActionImage';
import UIActionSheet from './components/menus/UIActionSheet';
import UIAlertView from './components/popup/UIAlertView';
import UIAmountInput from './components/input/UIAmountInput';
import UIBackgroundView from './components/products/UIBackgroundView';
import UIBadge from './components/design/UIBadge';
import UIBalanceView from './components/views/UIBalanceView';
import UIAnimatedBalanceView from './components/views/UIAnimatedBalanceView';
import UIBottomBar from './components/products/UIBottomBar';
import UIBullet from './components/docs/UIBullet';
import UIButton from './components/buttons/UIButton';
import UIButtonGroup from './components/buttons/UIButtonGroup';
import UIBankCardNumberInput from './components/input/UIBankCardNumberInput';
import UIBreadCrumbs from './components/navigation/UIBreadCrumbs';
import UICard from './components/views/UICard';
import UIChatInput from './components/chat/UIChatInput';
import UIChatMessageCell from './components/chat/cells/UIChatMessageCell';
import UICheckboxItem from './components/buttons/UICheckboxItem';
import UIColor from './helpers/UIColor';
import UIColorPalette from './helpers/UIColor/UIColorPalette';
import UICompatibilityView from './helpers/UICompatibilityView';
import UIComponent from './components/UIComponent';
import UIConstant from './helpers/UIConstant';
import UIController from './controllers/UIController';
import UICountryPicker from './components/menus/UICountryPicker';
import UICustomSheet from './components/menus/UICustomSheet';
import UIDateInput from './components/input/UIDateInput';
import UIDetailsButton from './components/buttons/UIDetailsButton';
import UIDetailsInput from './components/input/UIDetailsInput';
import UIDetailsToggle from './components/buttons/UIDetailsToggle';
import UIDetailsCheckbox from './components/buttons/UIDetailsCheckbox';
import UIDetailsRadio from './components/buttons/UIDetailsRadio';
import UIDetailsView from './components/views/UIDetailsView';
import UIDetailsTable from './components/layout/UIDetailsTable';
import UIDevice from './helpers/UIDevice';
import UIDialogController from './controllers/UIDialogController';
import UIDot from './components/design/UIDot';
import UIDropdownAlert from './components/popup/UIDropdownAlert';
import UIEmailInput from './components/input/UIEmailInput';
import UIErrorScreen from './controllers/UIErrorScreen';
import UIEventHelper from './helpers/UIEventHelper';
import UIFeedback from './components/products/UIFeedback';
import UIPushFeedback from './components/products/UIPushFeedback';
import UIFlashMessage from './helpers/UIFlashMessage';
import UIFont from './helpers/UIFont';
import UITextStyle from './helpers/UITextStyle';
import UIFunction from './helpers/UIFunction';
import UIGrid from './components/layout/UIGrid';
import UIGridColumn from './components/layout/UIGridColumn';
import UIIdleDetector from './components/UIIdleDetector';
import UIImage from './components/images/UIImage';
import UIImageButton from './components/buttons/UIImageButton';
import UIImageView from './components/images/UIImageView';
import UILabel from './components/text/UILabel';
import UILandingView from './components/views/UILandingView';
import UILayoutManager from './helpers/UILayoutManager';
import UILink from './components/buttons/UILink';
import UILinkInput from './components/input/UILinkInput';
import UIListHeader from './components/text/UIListHeader';
import UILoadMoreButton from './components/buttons/UILoadMoreButton';
import UILocalized from './helpers/UILocalized';
import UIModalController from './controllers/UIModalController';
import UINavigationBackButton from './components/navigation/UINavigationBackButton';
import UINavigationBar from './components/navigation/UINavigationBar';
import UINavigationCloseButton from './components/navigation/UINavigationCloseButton';
import UINavigationIconButton from './components/navigation/UINavigationIconButton';
import UINavigationPlusButton from './components/navigation/UINavigationPlusButton';
import UINavigationTextButton from './components/navigation/UINavigationTextButton';
import UIUnfold from './components/navigation/UIUnfold';
import UINavigator from './helpers/UINavigator';
import UINetworkStatus from './components/notifications/UINetworkStatus';
import UINotice from './components/notifications/UINotice';
import UINotificationBadge from './components/notifications/UINotificationBadge';
import UINumberInput from './components/input/UINumberInput';
import UIPasswordPrompt from './components/popup/UIPasswordPrompt';
import UIPhoneInput from './components/input/UIPhoneInput';
import UIPinCodeInput from './components/input/UIPinCodeInput';
import UIPopover from './components/menus/UIPopover';
import UIPopoverMenu from './components/menus/UIPopoverMenu';
import UIPopoverBackground from './components/menus/UIPopoverBackground';
import UIProfilePhoto from './components/profile/UIProfilePhoto';
import UIProfileInitials from './components/profile/UIProfileInitials';
import UIProfileView from './components/profile/UIProfileView';
import UIPureComponent from './components/UIPureComponent';
import UIQuote from './components/views/UIQuote';
import UIRadioButtonList from './components/buttons/UIRadioButtonList';
import UIScaleButton from './components/buttons/UIScaleButton';
import UIScreen from './controllers/UIScreen';
import UISearchBar from './components/input/UISearchBar';
import UISectionHeader from './components/text/UISectionHeader';
import UISeedPhraseInput from './components/input/UISeedPhraseInput';
import UIContractAddressInput from './components/input/UIContractAddressInput';
import UISeparator from './components/design/UISeparator';
import UIShareManager from './helpers/UIShareManager';
import UIShareScreen from './helpers/UIShareManager/UIShareScreen';
import UISlider from './components/menus/UISlider';
import UISpinnerOverlay from './components/UISpinnerOverlay';
import UISplitViewController from './controllers/UISplitViewController';
import UIStepBar from './components/menus/UIStepBar';
import UIStubPage from './components/products/UIStubPage';
import UIStyle from './helpers/UIStyle';
import UITabView from './components/menus/UITabView';
import UITag from './components/design/UITag';
import UITextButton from './components/buttons/UITextButton';
import UITextInput from './components/input/UITextInput';
import UIToastMessage from './components/notifications/UIToastMessage';
import UITokenCell from './components/products/UITokenCell';
import UIToggle from './components/buttons/UIToggle';
import UITooltip from './components/notifications/UITooltip';
import UITransactionView from './components/views/UITransactionView';
import UITransitionView from './components/views/UITransitionView';
import UIUploadFileInput from './components/input/UIUploadFileInput';
import UIUserAgent from './helpers/UIUserAgent';
import UITransferInput from './components/input/UITransferInput';

// Types
import type { UIAccountData } from './components/UIAccountPicker/types/UIAccountData';
import type {
    AnyComponent,
    CreateNavigationOptions,
    ReactNavigation,
} from './components/navigation/UINavigationBar';
import type {
    NavigationProps,
    UINavigationRoute,
    UINavigationRouting,
} from './helpers/UINavigator';
import type { ActionProps } from './components/UIActionComponent';
import type {
    PointerEvents,
    PositionObject,
} from './types';
import type { ContentInset } from './controllers/UIController';
import type { DetailsList } from './components/layout/UIDetailsTable';
import type { LabelRoleValue } from './components/text/UILabel';
import type {
    UIColorData,
    UIColorThemeNameType,
} from './helpers/UIColor/UIColorTypes';
import type { MenuItemType } from './components/menus/UIActionSheet/MenuItem';
import type { UIFeedbackSubmitFunc } from './components/products/UIFeedback';
import type { ContentOffset } from './controllers/UIScreen';
import type { NumberParts, StringLocaleInfo } from './helpers/UIFunction';
import type { UISticker, UIStickerPackage } from './components/chat/extras';
import type { ShareOptions } from './helpers/UIShareManager';

// deprecated
const UIMenuView = UIPopoverMenu;
const UIMenuBackground = UIPopoverBackground;

export * from './helpers/UILocalized';

export {
    UIAccountPicker,
    UIAccountPickerScreen,
    UIActionComponent,
    UIActionIcon,
    UIActionImage,
    UIActionSheet,
    UIAlertView,
    UIAmountInput,
    UIBackgroundView,
    UIBadge,
    UIBalanceView,
    UIAnimatedBalanceView,
    UIBottomBar,
    UIBullet,
    UIButton,
    UIButtonGroup,
    UIBankCardNumberInput,
    UIBreadCrumbs,
    UICard,
    UIChatInput,
    UIChatMessageCell,
    UICheckboxItem,
    UIColor,
    UIColorPalette,
    UICompatibilityView,
    UIComponent,
    UIConstant,
    UIController,
    UICountryPicker,
    UICustomSheet,
    UIDateInput,
    UIDetailsButton,
    UIDetailsInput,
    UIDetailsTable,
    UIDetailsToggle,
    UIDetailsCheckbox,
    UIDetailsRadio,
    UIDetailsView,
    UIDevice,
    UIDialogController,
    UIDot,
    UIDropdownAlert,
    UIEmailInput,
    UIErrorScreen,
    UIEventHelper,
    UIFeedback,
    UIPushFeedback,
    UIFlashMessage,
    UIFont,
    UIFunction,
    UIGrid,
    UIGridColumn,
    UITextStyle,
    UIIdleDetector,
    UIImage,
    UIImageButton,
    UIImageView,
    UILabel,
    UILandingView,
    UILayoutManager,
    UILink,
    UILinkInput,
    UIListHeader,
    UILoadMoreButton,
    UILocalized,
    UIMenuBackground,
    UIMenuView,
    UIModalController,
    UINavigationBackButton,
    UINavigationBar,
    UINavigationCloseButton,
    UINavigationIconButton,
    UINavigationPlusButton,
    UINavigationTextButton,
    UIUnfold,
    UINavigator,
    UINetworkStatus,
    UINotice,
    UINotificationBadge,
    UINumberInput,
    UIPasswordPrompt,
    UIPhoneInput,
    UIPinCodeInput,
    UIPopover,
    UIPopoverMenu,
    UIPopoverBackground,
    UIProfileInitials,
    UIProfilePhoto,
    UIProfileView,
    UIPureComponent,
    UIQuote,
    UIRadioButtonList,
    UIScaleButton,
    UIScreen,
    UISearchBar,
    UISectionHeader,
    UISeedPhraseInput,
    UIContractAddressInput,
    UISeparator,
    UIShareManager,
    UIShareScreen,
    UISlider,
    UISpinnerOverlay,
    UISplitViewController,
    UIStepBar,
    UIStubPage,
    UIStyle,
    UITabView,
    UITag,
    UITextButton,
    UITextInput,
    UIToastMessage,
    UIToggle,
    UITokenCell,
    UITooltip,
    UITransactionView,
    UITransferInput,
    UITransitionView,
    UIUploadFileInput,
    UIUserAgent,
};

export type {
    AnyComponent,
    CreateNavigationOptions,
    NavigationProps,
    ActionProps,
    MenuItemType,
    NumberParts,
    StringLocaleInfo,
    PointerEvents,
    PositionObject,
    ReactNavigation,
    ContentInset,
    ContentOffset,
    DetailsList,
    LabelRoleValue,
    UIAccountData,
    UIColorData,
    UIColorThemeNameType,
    UINavigationRoute,
    UINavigationRouting,
    UIFeedbackSubmitFunc,
    UISticker,
    UIStickerPackage,
    ShareOptions,
};
