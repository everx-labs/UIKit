import * as React from 'react';
import { StyleSheet } from 'react-native';

import { TouchableOpacity } from '@tonlabs/uikit.controls';
import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';
import { ScrollView } from '@tonlabs/uikit.scrolls';
import { UIBottomSheet, useIntrinsicSizeScrollView } from '@tonlabs/uikit.popups';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { AddressInputAccount, AddressInputAccountData } from './types';

type OnSelect = (address: string) => void;

type UIAccountPickerCommonProps = {
    onSelect: OnSelect;
    sections: AddressInputAccountData[];
};

function UIAccountPickerItem({
    onSelect,
    address,
    balance,
    description,
}: AddressInputAccount & {
    onSelect: OnSelect;
}) {
    const theme = useTheme();

    return (
        <TouchableOpacity
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
                <UILabel role={UILabelRoles.ParagraphNote} color={UILabelColors.TextSecondary}>
                    {description}
                </UILabel>
            ) : null}
        </TouchableOpacity>
    );
}

function UIAccountPickerSheetContent({ sections, onSelect }: UIAccountPickerCommonProps) {
    const { style: scrollIntrinsicStyle, onContentSizeChange } = useIntrinsicSizeScrollView();
    return (
        <ScrollView
            contentContainerStyle={styles.itemContentContainerStyle}
            // @ts-expect-error
            containerStyle={scrollIntrinsicStyle}
            onContentSizeChange={onContentSizeChange}
        >
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
                    {data.map(account => (
                        <UIAccountPickerItem
                            key={account.address}
                            {...account}
                            onSelect={onSelect}
                        />
                    ))}
                </React.Fragment>
            ))}
        </ScrollView>
    );
}

export function UIAccountPicker({
    visible,
    onClose,
    ...accountPickerProps
}: {
    visible: boolean;
    onClose: () => void;
} & UIAccountPickerCommonProps) {
    return (
        <UIBottomSheet visible={visible} onClose={onClose}>
            <UIAccountPickerSheetContent {...accountPickerProps} />
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingVertical: 8,
    },
    itemContentContainerStyle: {
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    item: {
        paddingVertical: 12,
    },
    itemBalance: {
        marginBottom: 4,
    },
});
