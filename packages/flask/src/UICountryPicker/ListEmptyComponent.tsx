import React from 'react';
import { ColorVariants, TypographyVariants, UIIndicator, UILabel } from '@tonlabs/uikit.hydrogen';
import { CountryPickerContext } from './CountryPickerContext';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { View, StyleSheet } from 'react-native';

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
export const ListEmptyComponent = () => {
    const { loading } = React.useContext(CountryPickerContext);

    const renderContent = React.useMemo(
        () => (loading ? renderLoading() : renderEmptyList()),
        [loading],
    );

    return <View style={styles.emptyContainer}>{renderContent}</View>;
};

const styles = StyleSheet.create({
    emptyContainer: {
        paddingTop: 48,
        alignItems: 'center',
    },
});
