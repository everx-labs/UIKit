import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type BigNumber from 'bignumber.js';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UICurrency, UICurrencyProps } from '@tonlabs/uicast.numbers';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import type { UILabelProps } from '@tonlabs/uikit.themes';
import { UILinkButton, UILinkButtonProps } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';

export enum UITableRowValueKind {
    Currency = 'currency',
    Label = 'label',
    Link = 'link',
}

type UIRowValue<Kind, Props> = { kind: Kind; props: Props; testID?: string };

export type UITableRowValue =
    | UIRowValue<
          UITableRowValueKind.Currency,
          Omit<UICurrencyProps, 'children'> & { amount: BigNumber }
      >
    | UIRowValue<UITableRowValueKind.Label, Omit<UILabelProps, 'children'> & { title: string }>
    | UIRowValue<UITableRowValueKind.Link, UILinkButtonProps>;

export type UITableRowProps = {
    testID?: string;
    name: string;
    nameTestID?: string;
    value: UITableRowValue;
    loading: boolean;
    onPress?: () => void;
};

function renderTableValue(value: UITableRowValue) {
    const { testID, kind, props } = value;

    switch (kind) {
        case UITableRowValueKind.Currency:
            return (
                <UICurrency
                    testID={testID}
                    integerColor={UILabelColors.TextPrimary}
                    integerVariant={UILabelRoles.NarrowMonoNote}
                    decimalColor={UILabelColors.TextPrimary}
                    decimalVariant={UILabelRoles.NarrowMonoNote}
                    {...props}
                >
                    {props.amount}
                </UICurrency>
            );
        case UITableRowValueKind.Label:
            return (
                <UILabel
                    testID={testID}
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.NarrowParagraphNote}
                    {...props}
                >
                    {props.title}
                </UILabel>
            );
        case UITableRowValueKind.Link:
            return <UILinkButton testID={testID} {...props} />;
        default:
            return null;
    }
}

export const UITableRow = React.memo(function UITableRow({
    testID,
    name,
    nameTestID,
    value,
    loading,
    onPress,
}: UITableRowProps) {
    return (
        <TouchableOpacity
            testID={testID}
            onPress={onPress}
            disabled={!onPress}
            style={styles.container}
        >
            <UISkeleton show={loading}>
                <View style={styles.nameContainer}>
                    <UILabel
                        testID={nameTestID}
                        color={UILabelColors.TextSecondary}
                        role={UILabelRoles.NarrowParagraphNote}
                    >
                        {name}
                    </UILabel>
                </View>
            </UISkeleton>
            <UISkeleton show={loading}>
                <View style={styles.valueContainer}>{renderTableValue(value)}</View>
            </UISkeleton>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameContainer: {
        marginRight: UILayoutConstant.contentInsetVerticalX2,
    },
    valueContainer: {
        marginLeft: UILayoutConstant.contentInsetVerticalX2,
    },
});
