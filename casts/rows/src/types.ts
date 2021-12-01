import type { UILinkProps } from './UILink';
import type { UICurrencyRowProps } from './UICurrencyRow';

export enum UIListRowKind {
    Link = 'link',
    Currency = 'currency',
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

export type UIListRow<P = void> =
    | UIListRowWithPayload<LinkRow, P>
    | UIListRowWithPayload<CurrencyRow, P>;
export type UIListRows<P = void> = UIListRow<P>[];
