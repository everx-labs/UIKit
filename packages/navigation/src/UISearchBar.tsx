import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import {
    ColorVariants,
    UIBackgroundView,
    UIImage,
    UIIndicator,
    UILabel,
    UILabelColors,
    UILabelRoles,
    UITextView,
    UITextViewProps,
    useUITextViewValue,
    useClearButton,
    useHover,
    useFocused,
    TouchableOpacity,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UIConstant as UINavConstant } from './constants';

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

function useInnerRightAction(
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    searching: boolean | undefined,
    clear: () => void,
) {
    const clearButton = useClearButton(
        inputHasValue,
        isFocused,
        isHovered,
        clear,
    );

    if (searching) {
        return (
            <UIIndicator
                style={styles.loadingIcon}
                size={UINavConstant.iconSearchingIndicatorSize}
                trackWidth={2}
            />
        );
    }

    if (clearButton) {
        return clearButton;
    }

    return null;
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
    onChangeText: onChangeTextProp,
    ...inputProps
}: UISearchBarProps) {
    const [searchText, setSearchText] = React.useState('');
    const ref = React.useRef<TextInput>(null);
    const { inputHasValue, clear } = useUITextViewValue(ref, false, {
        value: searchText,
        ...inputProps,
    });

    const onChangeText = React.useCallback(
        (text: string) => {
            if (onChangeTextProp) {
                onChangeTextProp(text);
            }

            setSearchText(text);
        },
        [onChangeTextProp, setSearchText],
    );

    const onClear = React.useCallback(() => {
        if (onChangeTextProp) {
            onChangeTextProp('');
        }
        setSearchText('');
        clear();
    }, [onChangeTextProp, setSearchText, clear]);

    const { isFocused, onFocus, onBlur } = useFocused(
        inputProps.onFocus,
        inputProps.onBlur,
    );
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const innerRightAction = useInnerRightAction(
        inputHasValue,
        isFocused,
        isHovered,
        searching,
        onClear,
    );

    return (
        <UIBackgroundView
            style={styles.container}
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
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
                    ref={ref}
                    placeholder={placeholder || uiLocalized.Search}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...inputProps}
                />
                {innerRightAction}
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
        minHeight: UINavConstant.headerHeight,
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
        paddingRight: 8,
    },
    searchIcon: {
        width: UINavConstant.iconSearchSize,
        height: UINavConstant.iconSearchSize,
        marginRight: UIConstant.tinyContentOffset(),
    },
    loadingIcon: {
        flex: undefined,
        marginLeft: UIConstant.tinyContentOffset(),
        marginRight: 6,
    },
    actionButton: {
        marginLeft: UIConstant.contentOffset(),
    },
});
