import React from 'react';
import { View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
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
                style={UIStyle.margin.bottomTiny()}
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

    const title2 = title || 'default';
    return (
        <View testID={`rebalance_asset_picker_${title2}`} style={containerStyle}>
            {renderTitle}
            {renderAccountCell}
        </View>
    );
}
