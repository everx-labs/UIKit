import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIImage } from '@tonlabs/uikit.media';
import { TouchableOpacity, UIBoxButton, UIBoxButtonType } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
} from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIBottomSheet, useIntrinsicSizeScrollView } from '@tonlabs/uikit.popups';
import { ScrollView } from '@tonlabs/uikit.scrolls';

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
    return (
        <TouchableOpacity
            style={[styles.item]}
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
                        tintColor={ColorVariants.TextSecondary}
                        style={styles.itemKey}
                    />
                </>
            )}
        </TouchableOpacity>
    );
}

type CommonBoxPickerProps<Box extends AbstractBox> = {
    onSelect: OnSelect<Box>;
    onAdd?: () => void;
    boxes: Box[];
    headerTitle: string;
    addTitle: string;
};

function UIBoxPickerContent<Box extends AbstractBox>({
    headerTitle,
    boxes,
    addTitle,
    onAdd,
    onSelect,
}: CommonBoxPickerProps<Box>) {
    const { style: scrollIntrinsicStyle, onContentSizeChange } = useIntrinsicSizeScrollView();
    return (
        <>
            <UIBackgroundView style={styles.sectionHeader}>
                <UILabel role={UILabelRoles.HeadlineFootnote} color={UILabelColors.TextPrimary}>
                    {headerTitle}
                </UILabel>
            </UIBackgroundView>
            <ScrollView
                contentContainerStyle={styles.itemContentContainerStyle}
                containerStyle={scrollIntrinsicStyle}
                onContentSizeChange={onContentSizeChange}
            >
                {boxes.map(box => (
                    <UIBoxPickerItem key={box.id} box={box} onSelect={onSelect} />
                ))}
            </ScrollView>
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
        </>
    );
}

export function UIBoxPicker<Box extends AbstractBox>({
    visible,
    onClose,
    ...rest
}: {
    visible: boolean;
    onClose: () => void;
} & CommonBoxPickerProps<Box>) {
    if (rest.boxes.length === 0) {
        return null;
    }

    return (
        <UIBottomSheet visible={visible} onClose={onClose}>
            <UIBoxPickerContent {...rest} />
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    itemContentContainerStyle: {
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
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
    },
});
