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
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIAssets } from '@tonlabs/uikit.assets';

import type { SigningBox } from './types';
import { UIPullerSheet } from './UIPullerSheet';

type OnSelect = (signingBox: SigningBox) => void;

const Touchable =
    Platform.OS === 'web' ? TouchableOpacity : RNGHTouchableOpacity;

function UISignaturePickerItem({
    onSelect,
    signingBox,
}: {
    signingBox: SigningBox;
    onSelect: OnSelect;
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
                onSelect(signingBox);
            }}
        >
            <UILabel style={styles.itemTitle} role={UILabelRoles.Action}>
                {signingBox.title}
            </UILabel>
            <UILabel color={UILabelColors.TextSecondary}>
                {`${signingBox.publicKey.slice(0, 2)} ·· `}
            </UILabel>
            <UIImage
                source={UIAssets.icons.ui.keyThin}
                tintColor={ColorVariants.IconSecondary}
                style={styles.itemKey}
            />
        </Touchable>
    );
}

export function UISignaturePicker({
    visible,
    onClose,
    onSelect,
    onAddSignature,
    signingBoxes,
}: {
    visible: boolean;
    onClose: () => void;
    onSelect: OnSelect;
    onAddSignature: () => void;
    signingBoxes: SigningBox[];
}) {
    if (signingBoxes.length === 0) {
        return null;
    }

    return (
        <UIPullerSheet visible={visible} onClose={onClose}>
            <UIBackgroundView style={styles.sectionHeader}>
                <UILabel
                    role={UILabelRoles.HeadlineFootnote}
                    color={UILabelColors.TextPrimary}
                >
                    {uiLocalized.Browser.SigningBox.Signatures}
                </UILabel>
            </UIBackgroundView>
            {signingBoxes.map((box) => (
                <UISignaturePickerItem
                    key={box.id}
                    signingBox={box}
                    onSelect={onSelect}
                />
            ))}
            {/* TODO: use UILinkButton instead once it's ready! */}
            <View style={styles.addButtonContainer}>
                <UIBoxButton
                    testID="signing-box-add-signature"
                    disabled
                    title={uiLocalized.Browser.SigningBox.AddSignature}
                    type={UIBoxButtonType.Nulled}
                    onPress={onAddSignature}
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
