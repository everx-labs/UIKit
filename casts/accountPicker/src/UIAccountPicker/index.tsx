import React from 'react';
import { StyleSheet, View } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { AccountPickerProps } from './types';
import { UIAccountPickerCell } from './UIAccountPickerCell';

export function UIAccountPicker({
    title = '',
    account,
    onPressAccount,
    displayNameOnly = false,
    notActive,
    right,
    containerStyle,
}: AccountPickerProps) {
    const renderTitle = React.useMemo(() => {
        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphLabel}
                style={style.title}
            >
                {title}
            </UILabel>
        );
    }, [title]);

    const renderAccountCell = React.useMemo(() => {
        if (!account) {
            return null;
        }

        return (
            <UIAccountPickerCell
                account={account}
                onPressAccount={onPressAccount}
                displayNameOnly={displayNameOnly}
                notActive={notActive}
                right={right}
                containerStyle={containerStyle}
            />
        );
    }, [account, containerStyle, displayNameOnly, notActive, onPressAccount, right]);

    return (
        <View testID={`rebalance_asset_picker_${title || 'default'}`} style={containerStyle}>
            {renderTitle}
            {renderAccountCell}
        </View>
    );
}

const style = StyleSheet.create({
    title: {
        marginBottom: UILayoutConstant.contentInsetVerticalX1,
    },
});
