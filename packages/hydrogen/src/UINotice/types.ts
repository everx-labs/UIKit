
// eslint-disable-next-line no-shadow
export enum UINoticeType {
    Toast = 'Toast',
    Top = 'Top',
    Bottom = 'Bottom',
}

// eslint-disable-next-line no-shadow
export enum UINoticeColor {
    PrimaryInverted = 'PrimaryInverted',
    Secondary = 'Secondary',
    Negative = 'Negative',
}

export type NoticeProps = {
    type: UINoticeType;
    color: UINoticeColor;
    title: string;
    onTap?: () => void;
    testID?: string;
}

export type UINoticeProps = {
    type: UINoticeType;
    color: UINoticeColor;
    visible: boolean;
    title: string;
    onClose?: () => void;
    onTap?: () => void;
    testID?: string;
};
