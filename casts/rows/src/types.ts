import type { UIAccountRowProps } from './UIAccountRow';
import type { UICurrencyRowProps } from './UICurrencyRow';
import type { UILinkProps } from './UILink';

export enum UIKitListRowKind {
    Account = 'account',
    Currency = 'currency',
    Link = 'link',
}

export type UIListRow<Kind, Props, Payload = void> = Payload extends void
    ? { kind: Kind; props: Props; key: string }
    : { kind: Kind; props: Props; key: string; payload: Payload };

export type UIKitListRow<P = void> =
    | UIListRow<UIKitListRowKind.Account, UIAccountRowProps, P>
    | UIListRow<UIKitListRowKind.Currency, UICurrencyRowProps, P>
    | UIListRow<UIKitListRowKind.Link, UILinkProps, P>;

export type UIKitListRows<P = void> = UIKitListRow<P>[];
