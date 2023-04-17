import React from 'react';
import { UIIndicator } from '@tonlabs/uikit.controls';
import { TypographyVariants, UILabel, ColorVariants } from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';
import { View, StyleSheet } from 'react-native';

import { CountryPickerContext } from './CountryPickerContext';

function renderLoading() {
    return <UIIndicator />;
}

function renderEmptyList() {
    return (
        <>
            <UILabel role={TypographyVariants.TitleMedium} color={ColorVariants.TextSecondary}>
                {uiLocalized.CountryPicker.CountryNotFindTitle}
            </UILabel>
            <UILabel role={TypographyVariants.Action} color={ColorVariants.TextSecondary}>
                {uiLocalized.CountryPicker.CountryNotFindDetails}
            </UILabel>
        </>
    );
}
export function ListEmptyComponent() {
    const { loading } = React.useContext(CountryPickerContext);

    const renderContent = React.useMemo(() => {
        if (loading) {
            return renderLoading();
        }
        return renderEmptyList();
    }, [loading]);

    return <View style={styles.emptyContainer}>{renderContent}</View>;
}

const styles = StyleSheet.create({
    emptyContainer: {
        paddingTop: 48,
        alignItems: 'center',
    },
});
