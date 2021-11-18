// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import type { AccountPickerCellProps } from './types';

export function UIAccountPickerCell({
    containerStyle,
    account,
    onPressAccount,
    displayNameOnly = false,
    notActive = false,
    right,
}: AccountPickerCellProps) {
    const getAccountName = React.useMemo(() => {
        if (displayNameOnly) {
            return account.name || account.address || '';
        }

        return account.address || '';
    }, [account.address, account.name, displayNameOnly]);

    const renderAccount = React.useMemo(() => {
        if (!account) {
            return null;
        }

        const name = getAccountName;

        return (
            <View style={UIStyle.common.flexRow()}>
                <UILabel
                    color={notActive ? UILabelColors.TextPrimary : UILabelColors.TextAccent}
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    role={notActive ? UILabelRoles.ParagraphText : UILabelRoles.Action}
                    style={[UIStyle.common.flex(), UIStyle.margin.rightDefault()]}
                >
                    {name}
                </UILabel>
                {right}
            </View>
        );
    }, [account, getAccountName, notActive, right]);

    const renderFooter = React.useMemo(() => {
        if (!account) {
            return null;
        }

        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphFootnote}
                style={UIStyle.margin.topTiny()}
            >
                {account.name}
            </UILabel>
        );
    }, [account]);

    return notActive ? (
        <View style={containerStyle}>
            {renderAccount}
            {displayNameOnly ? null : renderFooter}
        </View>
    ) : (
        <TouchableOpacity style={containerStyle} onPress={onPressAccount}>
            {renderAccount}
            {displayNameOnly ? null : renderFooter}
        </TouchableOpacity>
    );
}
