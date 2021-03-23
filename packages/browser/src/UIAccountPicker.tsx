import * as React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';

import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    UIBackgroundView,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

import type { AddressInputAccount, AddressInputAccountData } from './types';
import { UIPullerSheet } from './UIPullerSheet';

type OnSelect = (address: string) => void;

function UIAccountPickerItem({
    onSelect,
    address,
    balance,
    description,
}: AddressInputAccount & {
    onSelect: OnSelect;
}) {
    const theme = useTheme();
    const Touchable =
        Platform.OS === 'web' ? TouchableOpacity : RNGHTouchableOpacity;

    return (
        <Touchable
            style={[
                styles.item,
                {
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
            ]}
            onPress={() => {
                onSelect(address);
            }}
        >
            <UILabel style={styles.itemBalance}>{balance}</UILabel>
            {description != null ? (
                <UILabel
                    role={UILabelRoles.ParagraphNote}
                    color={UILabelColors.TextSecondary}
                >
                    {description}
                </UILabel>
            ) : null}
        </Touchable>
    );
}

export function UIAccountPicker({
    visible,
    onClose,
    onSelect,
    sections,
}: {
    visible: boolean;
    onClose: () => void;
    onSelect: OnSelect;
    sections: AddressInputAccountData[];
}) {
    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            {sections.map(({ title, data }) => (
                <React.Fragment key={title}>
                    <UIBackgroundView style={styles.sectionHeader}>
                        <UILabel
                            role={UILabelRoles.HeadlineFootnote}
                            color={UILabelColors.TextPrimary}
                        >
                            {title}
                        </UILabel>
                    </UIBackgroundView>
                    {data.map((account) => (
                        <UIAccountPickerItem
                            key={account.address}
                            {...account}
                            onSelect={onSelect}
                        />
                    ))}
                </React.Fragment>
            ))}
        </UIPullerSheet>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    itemBalance: {
        marginBottom: 4,
    },
});
