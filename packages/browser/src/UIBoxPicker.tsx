import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
    TouchableOpacity,
    UILabel,
    UILabelColors,
    UILabelRoles,
    UIBackgroundView,
    UIImage,
    UIBoxButton,
    UIBoxButtonType,
} from '@tonlabs/uikit.hydrogen';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';

import { UIPullerSheet } from './UIPullerSheet';

type AbstractBox = {
    id: number;
    title: string;
    publicKey?: string;
    serialNumber?: string;
};
type OnSelect<Box extends AbstractBox> = (box: Box) => void;

function UIBoxPickerItem<Box extends AbstractBox>({
    onSelect,
    box,
}: {
    box: Box;
    onSelect: OnSelect<Box>;
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
                onSelect(box);
            }}
        >
            {box.serialNumber && ( // Draw a SC icon before the title if serialNumber is present
                <UIImage source={UIAssets.icons.security.card} style={styles.securityCard} />
            )}

            <UILabel style={styles.itemTitle} role={UILabelRoles.Action}>
                {box.title}
            </UILabel>

            {box.publicKey != null && (
                <>
                    <UILabel color={UILabelColors.TextSecondary}>
                        {`${box.publicKey.slice(0, 2)} ·· `}
                    </UILabel>
                    <UIImage
                        source={UIAssets.icons.ui.keyThin}
                        tintColor={ColorVariants.IconSecondary}
                        style={styles.itemKey}
                    />
                </>
            )}
        </TouchableOpacity>
    );
}

export function UIBoxPicker<Box extends AbstractBox>({
    visible,
    onClose,
    onSelect,
    onAdd,
    boxes,
    headerTitle,
    addTitle,
}: {
    visible: boolean;
    onClose: () => void;
    onSelect: OnSelect<Box>;
    onAdd?: () => void;
    boxes: Box[];
    headerTitle: string;
    addTitle: string;
}) {
    if (boxes.length === 0) {
        return null;
    }

    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIBackgroundView style={styles.sectionHeader}>
                <UILabel role={UILabelRoles.HeadlineFootnote} color={UILabelColors.TextPrimary}>
                    {headerTitle}
                </UILabel>
            </UIBackgroundView>
            {boxes.map(box => (
                <UIBoxPickerItem key={box.id} box={box} onSelect={onSelect} />
            ))}
            {/* TODO: use UILinkButton instead once it's ready! */}
            {onAdd && (
                <View style={styles.addButtonContainer}>
                    <UIBoxButton
                        testID="box-picker-add"
                        disabled
                        title={addTitle}
                        type={UIBoxButtonType.Nulled}
                        onPress={onAdd}
                    />
                </View>
            )}
        </UIPullerSheet>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    itemTitle: {
        flex: 1,
    },
    itemKey: {
        height: 30,
        aspectRatio: 1,
    },
    securityCard: {
        height: 24,
        aspectRatio: 1,
        marginRight: 8,
    },
    addButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 4,
    },
});
