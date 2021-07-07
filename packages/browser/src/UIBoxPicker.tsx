import * as React from 'react';
import { StyleSheet, TouchableOpacity, Platform, View } from 'react-native';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';

import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    UIBackgroundView,
    useTheme,
    ColorVariants,
    UIImage,
    UIBoxButton,
    UIBoxButtonType,
} from '@tonlabs/uikit.hydrogen';
import { UIAssets } from '@tonlabs/uikit.assets';

import { UIPullerSheet } from './UIPullerSheet';

type AbstractBox = { id: number; title: string; publicKey?: string };
type OnSelect<Box extends AbstractBox> = (box: Box) => void;

const Touchable =
    Platform.OS === 'web' ? TouchableOpacity : RNGHTouchableOpacity;

function UIBoxPickerItem<Box extends AbstractBox>({
    onSelect,
    box,
}: {
    box: Box;
    onSelect: OnSelect<Box>;
}) {
    const theme = useTheme();

    return (
        <Touchable
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
            <UILabel style={styles.itemTitle} role={UILabelRoles.Action}>
                {box.title}
            </UILabel>
            {box.publicKey && (
                <UILabel color={UILabelColors.TextSecondary}>
                    {`${box.publicKey.slice(0, 2)} ·· `}
                </UILabel>
            )}
            <UIImage
                source={UIAssets.icons.ui.keyThin}
                tintColor={ColorVariants.IconSecondary}
                style={styles.itemKey}
            />
        </Touchable>
    );
}

export function UIBoxPicker<Box extends AbstractBox>({
    visible,
    onClose,
    onSelect,
    onAdd,
    boxes,
    headerTitle,
    addSignatureTitle,
}: {
    visible: boolean;
    onClose: () => void;
    onSelect: OnSelect<Box>;
    onAdd: () => void;
    boxes: Box[];
    headerTitle: string;
    addSignatureTitle: string;
}) {
    if (boxes.length === 0) {
        return null;
    }

    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIBackgroundView style={styles.sectionHeader}>
                <UILabel
                    role={UILabelRoles.HeadlineFootnote}
                    color={UILabelColors.TextPrimary}
                >
                    {headerTitle}
                </UILabel>
            </UIBackgroundView>
            {boxes.map((box) => (
                <UIBoxPickerItem key={box.id} box={box} onSelect={onSelect} />
            ))}
            {/* TODO: use UILinkButton instead once it's ready! */}
            <View style={styles.addButtonContainer}>
                <UIBoxButton
                    testID="box-picker-add-signature"
                    disabled
                    title={addSignatureTitle}
                    type={UIBoxButtonType.Nulled}
                    onPress={onAdd}
                />
            </View>
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
    addButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 4,
    },
});
