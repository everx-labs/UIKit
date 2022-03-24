import type { UILinkProps } from './UILink';
import type { UICurrencyRowProps } from './UICurrencyRow';
import type { UIAccountRowProps } from './UIAccountRow';

export enum UIKitListRowKind {
    Link = 'link',
    Currency = 'currency',
    Account = 'account',
}

export type UIListRow<Kind, Props, Payload = void> = Payload extends void
    ? { kind: Kind; props: Props; key: string }
    : { kind: Kind; props: Props; key: string; payload: Payload };

export type UIKitListRow<P = void> =
    | UIListRow<UIKitListRowKind.Link, UILinkProps, P>
    | UIListRow<UIKitListRowKind.Currency, UICurrencyRowProps, P>
    | UIListRow<UIKitListRowKind.Account, UIAccountRowProps, P>;

export type UIKitListRows<P = void> = UIKitListRow<P>[];
