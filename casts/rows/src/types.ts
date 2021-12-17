import type { UILinkProps } from './UILink';
import type { UICurrencyRowProps } from './UICurrencyRow';
import type { UIAccountRowProps } from './UIAccountRow';

export enum UIListRowKind {
    Link = 'link',
    Currency = 'currency',
    Account = 'account',
}

type UIListRowWithPayload<T, P = void> = P extends void
    ? T & { key: string }
    : T & { key: string; payload: P };

type LinkRow = {
    key: string;
    kind: UIListRowKind.Link;
    props: UILinkProps;
};
type CurrencyRow = {
    key: string;
    kind: UIListRowKind.Currency;
    props: UICurrencyRowProps;
};
type AccountRow = {
    key: string;
    kind: UIListRowKind.Account;
    props: UIAccountRowProps;
};

export type UIListRow<P = void> =
    | UIListRowWithPayload<LinkRow, P>
    | UIListRowWithPayload<CurrencyRow, P>
    | UIListRowWithPayload<AccountRow, P>;
export type UIListRows<P = void> = UIListRow<P>[];
