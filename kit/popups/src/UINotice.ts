import {
    IUINotice,
    UINotice as NoticeView,
    UINoticeColor,
    UINoticeDuration,
    UINoticeType,
} from './Notice';

export * from './Notice/types';

// @ts-expect-error
// ts doesn't understand that we assign prop types later, and want to see it right away
export const UINotice: IUINotice = NoticeView;
UINotice.Type = UINoticeType;
UINotice.Color = UINoticeColor;
UINotice.Duration = UINoticeDuration;
