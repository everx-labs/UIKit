import type { UILinkProps } from './UILink';
import type { UICurrencyRowProps } from './UICurrencyRow';
import type { UIAccountRowProps } from './UIAccountRow';

export enum UIListRowKind {
    Link = 'link',
    Currency = 'currency',
    Account = 'account',
}

type UIListRowWithPayload<T, P = void> = P extends void ? T : T & { payload: P };

type LinkRow = {
    kind: UIListRowKind.Link;
    props: UILinkProps;
};
type CurrencyRow = {
    kind: UIListRowKind.Currency;
    props: UICurrencyRowProps;
};
type AccountRow = {
    kind: UIListRowKind.Account;
    props: UIAccountRowProps;
};

export type UIListRow<P = void> =
    | UIListRowWithPayload<LinkRow, P>
    | UIListRowWithPayload<CurrencyRow, P>
    | UIListRowWithPayload<AccountRow, P>;
export type UIListRows<P = void> = UIListRow<P>[];
