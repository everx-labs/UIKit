import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UICurrency, UINumber } from '@tonlabs/uicast.numbers';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILinkButton } from '@tonlabs/uikit.controls';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';

import { UITableRowValueKind } from './types';
import type { UITableRowValue, UITableRowProps } from './types';

function renderTableValue(value: UITableRowValue) {
    const { testID, kind, props } = value;

    switch (kind) {
        case UITableRowValueKind.Currency:
            return (
                <UICurrency
                    testID={testID}
                    integerColor={UILabelColors.TextPrimary}
                    integerVariant={UILabelRoles.NarrowMonoText}
                    decimalColor={UILabelColors.TextPrimary}
                    decimalVariant={UILabelRoles.NarrowMonoText}
                    {...props}
                >
                    {props.amount}
                </UICurrency>
            );
        case UITableRowValueKind.Label:
            return (
                <UILabel
                    testID={testID}
                    color={UILabelColors.TextSecondary}
                    role={UILabelRoles.NarrowParagraphText}
                    {...props}
                >
                    {props.title}
                </UILabel>
            );
        case UITableRowValueKind.Link:
            return <UILinkButton testID={testID} {...props} />;
        case UITableRowValueKind.Number:
            return (
                <UINumber
                    testID={testID}
                    integerColor={UILabelColors.TextPrimary}
                    integerVariant={UILabelRoles.NarrowMonoText}
                    decimalColor={UILabelColors.TextSecondary}
                    decimalVariant={UILabelRoles.NarrowMonoText}
                    {...props}
                >
                    {props.number}
                </UINumber>
            );
        default:
            return null;
    }
}

export const UITableRow = React.memo(function UITableRow({
    testID,
    name,
    nameTestID,
    nameColor = UILabelColors.TextPrimary,
    nameVariant = UILabelRoles.NarrowParagraphText,
    value,
    caption,
    captionTestID,
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
            <View style={styles.rowContainer}>
                <UISkeleton show={loading} style={styles.skeleton}>
                    <View style={styles.nameContainer}>
                        <UILabel testID={nameTestID} color={nameColor} role={nameVariant}>
                            {name}
                        </UILabel>
                    </View>
                </UISkeleton>
                <UISkeleton show={loading} style={styles.skeleton}>
                    <View style={styles.valueContainer}>{renderTableValue(value)}</View>
                </UISkeleton>
            </View>
            {caption != null ? (
                <UILabel
                    testID={captionTestID}
                    color={UILabelColors.TextSecondary}
                    role={UILabelRoles.NarrowParagraphNote}
                    style={styles.caption}
                >
                    {caption}
                </UILabel>
            ) : null}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    skeleton: {
        borderRadius: UILayoutConstant.borderRadius,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameContainer: {
        flex: 1,
        marginRight: UILayoutConstant.smallContentOffset,
    },
    valueContainer: {
        flex: 1,
        marginLeft: UILayoutConstant.smallContentOffset,
    },
    caption: {
        marginTop: UILayoutConstant.tinyContentOffset,
    },
});
