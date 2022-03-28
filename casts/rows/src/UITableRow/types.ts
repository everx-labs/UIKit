import type BigNumber from 'bignumber.js';

import type { ColorVariants, TypographyVariants, UILabelProps } from '@tonlabs/uikit.themes';
import type { UICurrencyProps, UINumberProps } from '@tonlabs/uicast.numbers';
import type { UILinkButtonProps } from '@tonlabs/uikit.controls';

export enum UITableRowValueKind {
    Currency = 'currency',
    Label = 'label',
    Link = 'link',
    Number = 'number',
}

type UIRowValue<Kind, Props> = { kind: Kind; props: Props; testID?: string };

export type UITableRowValue =
    | UIRowValue<
          UITableRowValueKind.Currency,
          Omit<UICurrencyProps, 'children'> & { amount: BigNumber }
      >
    | UIRowValue<UITableRowValueKind.Label, Omit<UILabelProps, 'children'> & { title: string }>
    | UIRowValue<UITableRowValueKind.Link, UILinkButtonProps>
    | UIRowValue<
          UITableRowValueKind.Number,
          Omit<UINumberProps, 'children'> & { number: BigNumber }
      >;

export type UITableRowProps = {
    testID?: string;
    name: string;
    nameTestID?: string;
    nameColor?: ColorVariants;
    nameVariant?: TypographyVariants;
    value: UITableRowValue;
    caption?: string;
    captionTestID?: string;
    loading: boolean;
    onPress?: () => void;
};
