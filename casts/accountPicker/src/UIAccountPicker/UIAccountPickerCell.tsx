import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import type { AccountPickerCellProps, CellContainerPropsBase } from './types';

type CellContainerProps = CellContainerPropsBase & {
    children: React.ReactNode;
};

function CellContainer({
    children,
    notActive,
    containerStyle,
    onPressAccount,
}: CellContainerProps) {
    if (notActive) {
        return <View style={containerStyle}>{children}</View>;
    }
    return (
        <TouchableOpacity style={containerStyle} onPress={onPressAccount}>
            {children}
        </TouchableOpacity>
    );
}

export function UIAccountPickerCell({
    containerStyle,
    account = null,
    onPressAccount,
    displayNameOnly = false,
    notActive = false,
    right,
}: AccountPickerCellProps) {
    const getAccountName = React.useMemo(() => {
        if (account) {
            if (displayNameOnly) {
                return account.name || account.address || '';
            }

            return account.address || '';
        }
        return '';
    }, [account, displayNameOnly]);

    const accountNameColor = React.useMemo(() => {
        return notActive ? UILabelColors.TextPrimary : UILabelColors.TextAccent;
    }, [notActive]);

    const accountNameRole = React.useMemo(() => {
        return notActive ? UILabelRoles.ParagraphText : UILabelRoles.Action;
    }, [notActive]);

    const renderAccount = React.useMemo(() => {
        if (!account) {
            return null;
        }

        return (
            <View style={UIStyle.common.flexRow()}>
                <UILabel
                    color={accountNameColor}
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    role={accountNameRole}
                    style={[UIStyle.common.flex(), UIStyle.margin.rightDefault()]}
                >
                    {getAccountName}
                </UILabel>
                {right}
            </View>
        );
    }, [account, accountNameColor, accountNameRole, getAccountName, right]);

    const renderFooter = React.useMemo(() => {
        if (!account || displayNameOnly) {
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
    }, [account, displayNameOnly]);

    return (
        <CellContainer
            containerStyle={containerStyle}
            onPressAccount={onPressAccount}
            notActive={notActive}
        >
            {renderAccount}
            {renderFooter}
        </CellContainer>
    );
}
