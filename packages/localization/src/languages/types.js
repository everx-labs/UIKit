// @flow

export type UILocalizedData = {|
    +Account: string,
    +AccountAddress: string,
    +AccountLimitPeriod: {|
        +daily: string,
        +monthly: string,
        +total: string,
        +weekly: string,
    |},
    +AccountLimitRule: {|
        +passportVerification: string,
        +twoFactorAuthentication: string,
    |},
    +Accounts: string,
    +AccountTypeHint: string,
    +Add: string,
    +AddAdministrator: string,
    +AddAProfilePicture: string,
    +AddContact: string,
    +AddDriversLicense: string,
    +AddedBy: string,
    +AddIdentityCard: string,
    +AddingContactIsNotATelegramUser: string,
    +AddInternalPassport: string,
    +AddMembers: string,
    +AddNewLimit: string,
    +AddPassport: string,
    +AddResidencePermit: string,
    +Address: string,
    +Addresses: string,
    +AddressShare: string,
    +AddressURLHint: string,
    +AddSubscribers: string,
    +AddWallet: string,
    +Administrator: string,
    +Administrators: string,
    +Admins: string,
    +AllMembersAreAdmins: string,
    +AllMembersCanAddAndRemoveMembers: string,
    +Amount: string,
    +AnyDetailsSuchAsAge: string,
    +Apartment: string,
    +AtTime: string,
    +BackToHome: string,
    +BackupAccount: string,
    +BackupNow: string,
    +BackupWallet: string,
    +BackupWalletDescription: string,
    +BackupWalletSuggestion: string,
    +BackupWalletTitle: string,
    +Balance: string,
    +BankCardNumber: string,
    +Bio: string,
    +Blacklist: string,
    +BlockUser: string,
    +Cancel: string,
    +ChangeNumber: string,
    +Channel: string,
    +ChannelInfo: string,
    +ChannelName: string,
    +ChatWith: string,
    +CheckingTheCode: string,
    +ChooseDepositToken: string,
    +ChooseFromLibrary: string,
    +Citizenship: string,
    +City: string,
    +ClearHistory: string,
    +Close: string,
    +Code: string,
    +ConfirmAndTransfer: string,
    +Confirmed: string,
    +ConfirmIdentity: string,
    +ConfirmPassword: string,
    +ConnectionHasBeenLost: string,
    +ConnectionStatus: string,
    +Contact: string,
    +Contacts: string,
    +ContactsAccessDenied: string,
    +ContactsGrantAccess: string,
    +ContactsPermissionHasNotBeenGranted: string,
    +Continue: string,
    +ContinueWithPassword: string,
    +ConvertToSupergroup: string,
    +ConvertToSupergroupDetails: string,
    +CopiedToClipboard: string,
    +Copy: string,
    +CopyNumber: string,
    +CopyRight: string,
    +CopyToClipboard: string,
    +Country: string,
    +Create: string,
    +CreateAUsername: string,
    +CreateChannel: string,
    +CreateNewAccount: string,
    +Creator: string,
    +Currencies: string,
    +Date: string,
    +DateSymbols: {|
        +day: string,
        +month: string,
        +year: string,
    |},
    +DecryptingDocument: string,
    +Delete: string,
    +DeleteChannel: string,
    +DeleteDocument: string,
    +DeleteDocumentMessage: string,
    +DeleteGroup: string,
    +DeletePhoto: string,
    +Deposit: string,
    +DescribeYourIssueOrIdea: string,
    +Description: string,
    +DeselectAll: string,
    +Details: string,
    +Disclaimer: string,
    +DiscoverBots: string,
    +DoB: string,
    +DoBMax: string,
    +DoBMin: string,
    +DocumentDeleteDataAndFiles: string,
    +DocumentExpiration: string,
    +DocumentFront: string,
    +DocumentFrontDescription: string,
    +DocumentNumber: string,
    +DocumentRequirements: string,
    +DocumentReverse: string,
    +DocumentReverseDescription: string,
    +DocumentSelfie: string,
    +DocumentSelfieDescription: string,
    +Done: string,
    +Download: string,
    +DoYouWantToBlockThisUser: string,
    +DoYouWantToClearHistory: string,
    +DoYouWantToDeleteChannel: string,
    +DoYouWantToDeleteGroup: string,
    +DoYouWantToDeleteLimit: string,
    +DoYouWantToLeaveChannel: string,
    +DoYouWantToLeaveGroup: string,
    +DoYouWantToLogOut: string,
    +DriversLicense: string,
    +Edit: string,
    +EditDriversLicense: string,
    +EditIdentityCard: string,
    +EditInternalPassport: string,
    +EditLimit: string,
    +EditPassport: string,
    +EditPhoneNumberInstructions: string,
    +EditProfile: string,
    +EditResidencePermit: string,
    +EditUsernameInstructions: string,
    +EmailAddress: string,
    +EnterCorrectDataToField: string,
    +EnterYouNameAndProfilePicture: string,
    +EnterYourNewPhoneNumber: string,
    +Error: string,
    +Events: string,
    +Exchange: string,
    +ExchangeFrom: string,
    +ExchangeTo: string,
    +ExportingBackupPhrase: string,
    +FailedToAddNewContact: string,
    +FailedToCreateNewAccount: string,
    +FailedToCreateWallet: string,
    +FailedToLeaveChannel: string,
    +FailedToLeaveGroup: string,
    +FailedToLoadDocument: string,
    +FailedToSendTransaction: string,
    +FailedToSetLimit: string,
    +fee: string,
    +feeAmount: string,
    +Female: string,
    +FileIsTooBig: string,
    +FillInInformation: string,
    +FillInPersonalDetails: string,
    +FirstName: string,
    +ForALongTime: string,
    +ForgotPassword: string,
    +Friends: string,
    +FromCamera: string,
    +FromGallery: string,
    +Gender: string,
    +GetCode: string,
    +GetNotifiedWhenWeLaunch: string,
    +GivenNames: string,
    +Gram: string,
    +gram: string,
    +Gram01: string,
    +Gram11: string,
    +Gram24: string,
    +Gram50: string,
    +greatMemory: string,
    +Group: string,
    +GroupName: string,
    +GroupPhotoUpdated: string,
    +HashCopiedToClipboard: string,
    +HaveNotReceivedTheCode: string,
    +Here: string,
    +Hide: string,
    +hours: string,
    +hours01: string,
    +hours11: string,
    +hours24: string,
    +hours50: string,
    +IdentificationDocument: string,
    +IdentityCard: string,
    +IdentityDocument: string,
    +immediately: string,
    +Import: string,
    +Important: string,
    +In: string,
    +Info: string,
    +Information: string,
    +InternalPassport: string,
    +InvalidBankCardNumber: string,
    +InvalidCode: string,
    +InvalidContractAddress: string,
    +InvalidDate: string,
    +InvalidEmail: string,
    +InvalidFirstName: string,
    +InvalidLastName: string,
    +InvalidPassword: string,
    +InvalidPhone: string,
    +InvalidPhoneNumber: string,
    +InvalidUsername: string,
    +InviteFriends: string,
    +InvitesYouToWallet: string,
    +LastMonth: string,
    +LastName: string,
    +LastWeek: string,
    +Later: string,
    +LeaveChannel: string,
    +LeaveGroup: string,
    +LegalNotes: string,
    +LimitExceededFor: string,
    +LimitRemoveSuccess: string,
    +Limits: string,
    +LimitSetSuccess: string,
    +LinkCopiedToClipboard: string,
    +LoadMore: string,
    +Login: string,
    +Login_PhoneBannedError: string,
    +Login_PhoneFloodError: string,
    +LogOut: string,
    +MakePublic: string,
    +Male: string,
    +Manage: string,
    +MasterPassword: string,
    +max: string,
    +Member01: string,
    +Member11: string,
    +Member24: string,
    +Member50: string,
    +Members: string,
    +message: {|
        +sending: string,
    |},
    +MessageCopiedToClipboard: string,
    +Messenger: string,
    +MiddleName: string,
    +minutes: string,
    +minutes01: string,
    +minutes11: string,
    +minutes24: string,
    +minutes50: string,
    +moreWords01: string,
    +moreWords11: string,
    +moreWords24: string,
    +moreWords50: string,
    +MyAccount: string,
    +MyMainAccount: string,
    +Name: string,
    +NewAccount: string,
    +NewChannel: string,
    +NewContact: string,
    +NewGroup: string,
    +NewLimit: string,
    +NewMessage: string,
    +NewRecord: string,
    +NewVersionIsAvailable: string,
    +Next: string,
    +No: string,
    +NotChosen: string,
    +NotDefined: string,
    +NotFound: string,
    +NoThankYou: string,
    +NumberCopiedToClipboard: string,
    +NumberIsAlreadyConnectedToATelegramAccount: string,
    +NumberOccupied: string,
    +OK: string,
    +Online: string,
    +OnlyAdminsCanAddAndRemoveMembers: string,
    +OpenSettings: string,
    +operationTime: string,
    +OutOf: string,
    +Passport: string,
    +PassportFetchingStatus: string,
    +PassportNeedsAttention: $ReadOnlyArray<string>,
    +PassportRequestReview: string,
    +PassportSaveError: string,
    +PassportSaveSuccess: string,
    +PassportStatus: $ReadOnlyArray<string>,
    +Password: string,
    +Pay: string,
    +PeopleCanJoinYourChannelByFollowingThisLink: string,
    +PeopleCanShareThisLinkWithOtherAndFindYourChannel: string,
    +Period: string,
    +PersonalDetails: string,
    +Phone: string,
    +PhoneCall: string,
    +PhoneNumber: string,
    +PleaseDoNotCloseTheApp: string,
    +PleaseGoOnline: string,
    +PleaseSelectAChatToStartMessaging: string,
    +PleaseTryAgain: string,
    +PleaseTryLater: string,
    +PleaseUpdate: string,
    +PostalCode: string,
    +PressEmail: string,
    +Prev: string,
    +Private: string,
    +PrivateChannelsCanOnlyBeJoinedViaAnInviteLink: string,
    +Profile: string,
    +Public: string,
    +PublicAccount: string,
    +PublicAccountWarning: string,
    +PublicAddress: string,
    +PublicAddressCopiedToClipboard: string,
    +PublicChannelsCanBeFoundInSearchAnyoneCanJoinThem: string,
    +PushFeedbackLong: string,
    +PushFeedbackShort: string,
    +Receive: string,
    +Recent: string,
    +Recently: string,
    +Recipient: string,
    +Recipients: string,
    +RecoveringDocument: string,
    +Report: string,
    +Request: string,
    +RequestedFiles: string,
    +RequestingContactsPermission: string,
    +Residence: string,
    +ResidencePermit: string,
    +RestoreFrom12Words: string,
    +ReviewAndConfirm: string,
    +RevokeLink: string,
    +SayHello: string,
    +ScanQRCodeWithTONChatApplicationToContinue: string,
    +Search: string,
    +SearchByAccount: string,
    +SearchByToken: string,
    +SearchContacts: string,
    +SearchForMessagesOrUsers: string,
    +SearchForRecipients: string,
    +SearchForTransactions: string,
    +SearchFriends: string,
    +Sec: string,
    +SeedPhrase: string,
    +seedPhraseTypo: string,
    +Select: string,
    +SelectAll: string,
    +SelectCountry: string,
    +SelectResidence: string,
    +SelfieWithPassportOrID: string,
    +Send: string,
    +Sender: string,
    +SendFeedback: string,
    +SendMessage: string,
    +serviceUnavailable: string,
    +Share: string,
    +ShareLink: string,
    +ShareToTalk: string,
    +SingleOperationLimit: string,
    +Skip: string,
    +SmartContractAddress: string,
    +SMSNotice: string,
    +SomethingWentWrong: string,
    +SorryWeCannotDoActionAtTheMoment: string,
    +SorryYouDoNotHaveAnAccessToThisDocument: string,
    +StartMessaging: string,
    +State: string,
    +Status: string,
    +Submit: string,
    +Subscribers: string,
    +Success: string,
    +Surname: string,
    +TakePhoto: string,
    +TakeVideo: string,
    +TelegramCall: string,
    +TermsButtonText: string,
    +TermsCookiesPolicy: string,
    +ThanksForCooperation: string,
    +ThanksForYourFeedback: string,
    +TheRequestedServiceIsDownToGetUpAsapTryAgainLater: string,
    +ThisActionCannotBeUndone: string,
    +ThisLinkOpensChat: string,
    +Today: string,
    +TodayAt: string,
    +Tokens: string,
    +TONLabel: string,
    +TotalBalance: string,
    +Transaction: string,
    +TransactionError: $ReadOnlyArray<string>,
    +TransactionFrom: string,
    +Transactions: string,
    +TransactionStatus: {|
        +aborted: string,
        +rejected: string,
        +sending: string,
    |},
    +TwoStepAuth_EnterPasswordHelp: string,
    +TwoStepAuth_EnterPasswordInvalid: string,
    +TwoStepAuth_FloodError: string,
    +TwoStepAuth_InvalidPasswordError: string,
    +TwoStepAuth_RecoveryCodeExpired: string,
    +TwoStepAuth_RecoveryCodeHelp: string,
    +TwoStepAuth_RecoveryEmailUnavailable: string,
    +TwoStepAuth_RecoveryFailed: string,
    +TwoStepAuth_RecoveryUnavailable: string,
    +TypeMessage: string,
    +Unconfirmed: string,
    +UnreadMessages: string,
    +Update: string,
    +UpdateUsername: string,
    +UpgradingWallet: string,
    +UplimitRule: string,
    +Upload: string,
    +UploadAScan: string,
    +UploadAvatar: string,
    +UserHasNoWallet: string,
    +UserIsNotAuthorized: string,
    +Username: string,
    +Username_CheckingUsername: string,
    +Username_InvalidCharacters: string,
    +Username_InvalidStartsWithNumber: string,
    +Username_InvalidTaken: string,
    +Username_InvalidTooShort: string,
    +Username_UsernameIsAvailable: string,
    +Value: string,
    +ViewPassport: string,
    +Wallet: string,
    +WalletIsNotInitialized: string,
    +WalletQRCodeScannerHint: string,
    +WalletSetup: {|
        +ConfirmLocalPassword: string,
        +ConfirmLocalPasswordContinue: string,
        +ConfirmLocalPasswordDetails: string,
        +ConfirmLocalPasswordHint: string,
        +ConfirmLocalPasswordPlaceholder: string,
        +ConfirmLocalPasswordSuccess: string,
        +ConfirmLocalPasswordWarning: string,
        +CreateANew: string,
        +EncodePhrase: string,
        +IHaveWrittenAndRemembered: string,
        +KeyPhrase: string,
        +KeyPhraseDetails: string,
        +KeyPhraseHint: string,
        +KeyPhrasePlaceholder: string,
        +KeyPhraseWarning: string,
        +LogoText: string,
        +OKContinue: string,
        +PhraseCheck: string,
        +PhraseCheckAgreement: string,
        +PhraseCheckDetails: string,
        +PhraseCheckHint: string,
        +PhraseCheckSuccess: string,
        +PrivateKey: string,
        +PrivateKeyDetails: string,
        +PrivateKeyHint: string,
        +Restore: string,
        +RestoreWallet: string,
        +RestoreWalletDetails: string,
        +Seconds: string,
        +SetLocalPassword: string,
        +SetLocalPasswordContinue: string,
        +SetLocalPasswordDetails: string,
        +SetLocalPasswordHint: string,
        +SetLocalPasswordPlaceholder: string,
        +SetLocalPasswordWarning: string,
    |},
    +Warning: string,
    +Was: string,
    +WeAreSorryButYourBrowserVersionIsNotCompatible: string,
    +WeCanTFindThePageYouReLookingFor: string,
    +WeHaveSentYouACode: string,
    +WelcomeTo000: string,
    +WeNeedYourPassword: string,
    +WeNeedYourPasswordToUpgradeWallet: string,
    +WeNeedYourPhoneNumber: string,
    +WeUseContactsToAllowYouToInviteFriends: string,
    +WeWillSendAnSMSWithConfirmationCode: string,
    +WhatIsYourName: string,
    +WhomWouldYouLikeToAdd: string,
    +WhomWouldYouLikeToMessage: string,
    +WillGetInTouchWithYouSoon: string,
    +Word: string,
    +WriteOffAccount: string,
    +WrongPassword: string,
    +Yes: string,
    +Yesterday: string,
    +YesterdayAt: string,
    +You: string,
    +YouCanAddAdministratorsToHelpYouManageYourChannel: string,
    +YouCanProvideAnOptionalDescriptionForYourChannel: string,
    +YouCanRequestTheCodeAgain: string,
    +YouHaveEnteredAnEmptyCodeFor: string,
    +YouHaveEnteredAnExpiredCodeFor: string,
    +YouHaveEnteredAnInvalidCodeFor: string,
    +YouHaveEnteredAnInvalidFirstNameFor: string,
    +YouHaveEnteredAnInvalidLastNameFor: string,
    +YouHaveEnteredAnInvalidPhoneNumber: string,
    +YouHaveEnteredAnUnacceptableUsername: string,
    +YouHaveEnteredAUsernameWhichIsAlreadyTaken: string,
    +YouHaveEnteredAUsernameWhichIsNotDifferent: string,
    +YouHaveNoConversationsYet: string,
    +YouHaveNoTransactionsYet: string,
    +YouMustUseThePhoneNumberSpecifiedInTheOffer: string,
    +YourEmail: string,
    +YourTransactionCompleted: string,
    +YourTransactionCouldNotBeCompleted: string,
    +YourUsername: string,
    +Chats: {|
        +Bubbles: {|
            +TapToResend: string,
            +TapToSendAgain: string,
        |},
        +DateSeparators: {|
            +Today: string,
            +Yesterday: string,
        |},
        +Alerts: {|
            +MessageTooLong: string,
            +EnableFromSettingsTitle: string,
            +EnableFromSettings: string,
        |},
        +Actions: {|
            +AttachDocument: string,
            +AttachImage: string,
        |},
    |},
|};
