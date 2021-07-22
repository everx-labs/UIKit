// eslint-disable-next-line no-shadow
export enum UINoticeType {
    TopToast = 'TopToast',
    BottomToast = 'BottomToast',
    Top = 'Top',
    Bottom = 'Bottom',
}

// eslint-disable-next-line no-shadow
export enum UINoticeColor {
    PrimaryInverted = 'PrimaryInverted',
    Secondary = 'Secondary',
    Negative = 'Negative',
}

// eslint-disable-next-line no-shadow
export enum UINoticeDuration {
    Long = 'Long',
    Short = 'Short',
}

export type NoticeProps = {
    type: UINoticeType;
    color: UINoticeColor;
    title: string;
    onTap?: () => void;
    testID?: string;
};

export type UINoticeProps = {
    type: UINoticeType;
    color: UINoticeColor;
    visible: boolean;
    title: string;
    duration?: UINoticeDuration; // By default: UINoticeDuration.Long
    onClose?: () => void;
    onTap?: () => void;
    testID?: string;
};

export type ToastNoticeProps = UINoticeProps & {
    onCloseAnimationEnd: () => void;
    suspendClosingTimer: () => void;
    continueClosingTimer: () => void;
};
