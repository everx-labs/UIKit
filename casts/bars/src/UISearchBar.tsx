import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
    UITextView,
    UITextViewProps,
    useUITextViewValue,
    InputClearButton,
    useFocused,
    UITextViewRef,
} from '@tonlabs/uikit.inputs';
import { UIImage } from '@tonlabs/uikit.media';
import { UIIndicator, TouchableOpacity, useHover } from '@tonlabs/uikit.controls';
import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
} from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/localization';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

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

function renderRightAction({ label, onPress, accessibilityLabel }: UISearchBarRightButtonProps) {
    if (label == null) {
        return null;
    }

    return (
        <TouchableOpacity
            hitSlop={{
                top: UILayoutConstant.contentInsetVerticalX2,
                bottom: UILayoutConstant.contentInsetVerticalX2,
                left: UILayoutConstant.contentOffset,
                right: UILayoutConstant.contentOffset,
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

/**
 * This is a container for the right action to align it vertically
 * and make it to not affect the input height
 */
function InnerRightActionContainer({ children }: { children: React.ReactNode }) {
    return <View style={styles.rightInnerActionContainer}>{children}</View>;
}

function InnerRightAction({
    inputHasValue,
    isFocused,
    isHovered,
    searching,
    onClear,
}: {
    inputHasValue: boolean;
    isFocused: boolean;
    isHovered: boolean;
    searching: boolean | undefined;
    onClear: () => void;
}) {
    if (searching) {
        return (
            <InnerRightActionContainer>
                <UIIndicator
                    style={styles.loadingIcon}
                    size={UINavConstant.iconSearchingIndicatorSize}
                    trackWidth={2}
                />
            </InnerRightActionContainer>
        );
    }

    if (inputHasValue && (isFocused || isHovered)) {
        return (
            <InnerRightActionContainer>
                <InputClearButton clear={onClear} />
            </InnerRightActionContainer>
        );
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
    const ref = React.useRef<UITextViewRef>(null);
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

    const { isFocused, onFocus, onBlur } = useFocused(inputProps.onFocus, inputProps.onBlur);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    return (
        <UIBackgroundView
            style={styles.container}
            // @ts-ignore
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
                <InnerRightAction
                    inputHasValue={inputHasValue}
                    isFocused={isFocused}
                    isHovered={isHovered}
                    searching={searching}
                    onClear={onClear}
                />
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
        minHeight: UILayoutConstant.headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: UILayoutConstant.contentInsetVerticalX2,
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        paddingLeft: 10,
    },
    searchIcon: {
        width: UINavConstant.iconSearchSize,
        height: UINavConstant.iconSearchSize,
        marginRight: UILayoutConstant.tinyContentOffset,
    },
    loadingIcon: {
        flex: undefined,
        marginHorizontal: UILayoutConstant.tinyContentOffset,
    },
    actionButton: {
        marginLeft: UILayoutConstant.contentOffset,
    },
    rightInnerActionContainer: {
        alignSelf: 'stretch',
        width: UILayoutConstant.iconSize + UILayoutConstant.smallContentOffset * 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflow: 'hidden',
    },
});
