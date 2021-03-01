import * as React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ScrollView,
    TouchableOpacity as RNGHTouchableOpacity,
} from 'react-native-gesture-handler';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    UIBottomSheet,
    UILabel,
    UILabelColors,
    UILabelRoles,
    UIBackgroundView,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

import type { AddressInputAccount, AddressInputAccountData } from './types';

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

const PULLER_HEIGHT = 12;

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
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    const paddingBottom = Math.max(
        insets?.bottom || 0,
        UIConstant.contentOffset(),
    );

    return (
        <UIBottomSheet
            visible={visible}
            onClose={onClose}
            style={[
                styles.list,
                {
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
            ]}
        >
            <ScrollView
                bounces={false}
                style={{
                    maxHeight:
                        height -
                        (StatusBar.currentHeight ?? 0) -
                        insets.top -
                        PULLER_HEIGHT,
                }}
                contentContainerStyle={{
                    paddingBottom,
                }}
            >
                <UIBackgroundView style={styles.pullerContainer}>
                    <UIBackgroundView
                        color={ColorVariants.BackgroundNeutral}
                        style={styles.puller}
                    />
                </UIBackgroundView>
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
            </ScrollView>
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    pullerContainer: {
        height: PULLER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    puller: {
        width: 32,
        height: 2,
        borderRadius: 2,
        marginHorizontal: UIConstant.smallContentOffset(),
    },
    list: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
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
