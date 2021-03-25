import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import {
    UIBackgroundView,
    ColorVariants,
    UITextView,
    UITextViewProps,
    UIIndicator,
    UIImage,
    UILabel,
    UILabelRoles,
    UILabelColors,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/uikit.localization';

import {
    HEADER_HEIGHT,
    ICON_SEARCHING_INDICATOR_SIZE,
    ICON_SEARCH_SIZE,
} from './constants';

type OnPress = () => void | Promise<void>;

type UISearchBarRightButtonProps = {
    /**
     * Label text for button
     */
    label?: string;
    /**
     * Press handler
     */
    onPress?: OnPress;
    /**
     * Accessibility label for the button for screen readers.
     */
    accessibilityLabel?: string;
};

function renderRightAction({
    label,
    onPress,
    accessibilityLabel,
}: UISearchBarRightButtonProps) {
    if (label == null) {
        return null;
    }

    return (
        <TouchableOpacity
            hitSlop={{
                top: UIConstant.smallContentOffset(),
                bottom: UIConstant.smallContentOffset(),
                left: UIConstant.contentOffset(),
                right: UIConstant.contentOffset(),
            }}
            onPress={onPress}
            style={styles.actionButton}
        >
            <UILabel
                role={UILabelRoles.Action}
                color={UILabelColors.TextAccent}
                accessibilityLabel={accessibilityLabel}
            >
                {label}
            </UILabel>
        </TouchableOpacity>
    );
}

type UISearchBarProps = Omit<UITextViewProps, 'placeholder'> & {
    /**
     * Configuration for right item
     * Action button by default
     */
    headerRight?: (props: UISearchBarRightButtonProps) => React.ReactNode;
    /**
     * Label that will be passed to headerRight
     */
    headerRightLabel?: string;
    /**
     * onPress handler that will be passed to headerRight
     */
    headerRightOnPress?: OnPress;
    /**
     * Alternative string for placeholder
     */
    placeholder?: string;
    /**
     * Whether to show indicator animation on the right side of input
     */
    searching?: boolean;
};

export function UISearchBar({
    headerRight = renderRightAction,
    headerRightLabel,
    headerRightOnPress,
    placeholder,
    searching,
    ...inputProps
}: UISearchBarProps) {
    return (
        <UIBackgroundView style={styles.container}>
            <UIBackgroundView
                style={styles.searchContainer}
                color={ColorVariants.BackgroundSecondary}
            >
                <UIImage
                    source={UIAssets.icons.ui.search}
                    style={styles.searchIcon}
                    tintColor={ColorVariants.IconSecondary}
                />
                <UITextView
                    placeholder={placeholder || uiLocalized.Search}
                    {...inputProps}
                />
                {searching && (
                    <UIIndicator
                        style={styles.loadingIcon}
                        size={ICON_SEARCHING_INDICATOR_SIZE}
                        trackWidth={2}
                    />
                )}
            </UIBackgroundView>
            {headerRight({
                label: headerRightLabel,
                onPress: headerRightOnPress,
            })}
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: UIConstant.smallContentOffset(),
        paddingHorizontal: UIConstant.contentOffset(),
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: UIConstant.mediumBorderRadius(),
        paddingLeft: 10,
        paddingRight: 14,
    },
    searchIcon: {
        width: ICON_SEARCH_SIZE,
        height: ICON_SEARCH_SIZE,
        marginRight: UIConstant.tinyContentOffset(),
    },
    loadingIcon: {
        flex: undefined,
        marginLeft: UIConstant.tinyContentOffset(),
    },
    actionButton: {
        marginLeft: UIConstant.contentOffset(),
    },
});
