import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { uiLocalized } from '@tonlabs/uikit.localization';
import {
    ColorVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    UIBackgroundView,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';

import type { ConfirmButtonsMessage } from './types';

export function BubbleConfirmSuccessful() {
    return (
        <View style={styles.containerRight}>
            <UIBackgroundView
                color={ColorVariants.BackgroundPositive}
                style={styles.answer}
            >
                <UILabel color={UILabelColors.StaticTextPrimaryLight}>
                    {uiLocalized.Yes}
                </UILabel>
            </UIBackgroundView>
        </View>
    );
}

export function BubbleConfirmDeclined() {
    return (
        <View style={styles.containerRight}>
            <UIBackgroundView
                color={ColorVariants.BackgroundNegative}
                style={styles.answer}
            >
                <UILabel color={UILabelColors.StaticTextPrimaryLight}>
                    {uiLocalized.No}
                </UILabel>
            </UIBackgroundView>
        </View>
    );
}

export function BubbleConfirmButtons({
    onSuccess,
    onDecline,
}: {
    onSuccess: () => void | Promise<void>;
    onDecline: () => void | Promise<void>;
}) {
    const theme = useTheme();

    return (
        <View style={styles.containerLeft}>
            <TouchableOpacity
                testID="confirm_yes"
                style={[
                    styles.button,
                    {
                        marginRight: UIConstant.tinyContentOffset(),
                        borderColor: theme[ColorVariants.LinePositive],
                    },
                ]}
                onPress={onSuccess}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={UILabelColors.TextPositive}
                >
                    {uiLocalized.Yes}
                </UILabel>
            </TouchableOpacity>
            <TouchableOpacity
                testID="confirm_no"
                style={[
                    styles.button,
                    {
                        borderColor: theme[ColorVariants.LineNegative],
                    },
                ]}
                onPress={onDecline}
            >
                <UILabel
                    role={UILabelRoles.ActionCallout}
                    color={UILabelColors.TextNegative}
                >
                    {uiLocalized.No}
                </UILabel>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    containerRight: {
        maxWidth: '100%',
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: UIConstant.smallContentOffset(),
    },
    containerLeft: {
        maxWidth: '100%',
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: UIConstant.smallContentOffset(),
    },
    answer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: UIConstant.tinyContentOffset(),
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        borderRadius: UIConstant.borderRadius(),
        borderBottomRightRadius: 0,
    },
    button: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: UIConstant.tinyContentOffset(),
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        borderRadius: UIConstant.borderRadius(),
    },
});
