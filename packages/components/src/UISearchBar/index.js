// @flow
// Deprecated
import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIConstant,
    UIDevice,
    UIFont,
    UIColor,
    UIStyle,
} from '@uikit/core';

import UITextInput from '../UITextInput';
import UIComponent from '../UIComponent';

import UIDummyNavigationBar from './UIDummyNavigationBar';

import icoGlass from '@uikit/assets/ico-glass/search-thin.png';
import icoClear from '@uikit/assets/ico-clear/ico-clear.png';

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
    },
    textStyle: {
        ...UIFont.bodyRegular(),
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        marginHorizontal: UIConstant.contentOffset(),
    },
    bottomSeparator: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        backgroundColor: UIColor.light(),
    },
    cancelButton: {
        justifyContent: 'center',
        marginLeft: UIConstant.smallContentOffset(),
    },
});

type Props = {
    testID?: string,
    value?: string,
    placeholder?: string,
    onChangeExpression?: (text: string) => void,
    navigation?: any,
    onSetIntegratedHeader?: (header: React$Node) => React$Node,
    containerStyle: ViewStyleProp,
    bottomSeparator: boolean,
    bottomSeparatorStyle?: ViewStyleProp,
    renderGlass: boolean,
    onFocus?: () => void,
    autoFocus?: boolean,
}

type State = {
    focused: boolean,
}

export default class UISearchBar extends UIComponent<Props, State> {
    static defaultProps = {
        value: '',
        placeholder: '',
        onChangeExpression: () => {},
        containerStyle: {},
        bottomSeparator: true,
        bottomSeparatorStyle: {},
        renderGlass: false,
        onFocus: () => {},
        autoFocus: false,
    };

    static handleHeader(navigation: any) {
        // TODO: won't work with reactt-navigation v5
        const { params } = navigation.state;
        return params ? params.headerProp : null;
    }

    // Constructor
    textInput: ?UITextInput;
    UIDummyNavigationBar: ?UIDummyNavigationBar;

    constructor(props: Props) {
        super(props);

        this.state = {
            focused: false,
        };
    }

    // Events
    onFocusHandler = () => {
        const { onFocus } = this.props;
        this.setFocused(true);
        this.hideHeader();
        if (onFocus) {
            onFocus();
        }
    };

    onBlurHandler = (force: boolean = false) => {
        if (this.props.value !== '' && !force) {
            return;
        }
        this.setFocused(false);
        this.showHeader();
    };

    onChangeExpression = (text: string) => {
        if (this.props.onChangeExpression) {
            this.props.onChangeExpression(text);
        }
    };

    onCancel = () => {
        this.onChangeExpression('');
        if (this.textInput && this.textInput.isFocused()) {
            this.textInput.blur(); // onBlurHandler will be called when props.value is already ''.
        } else {
            this.onBlurHandler(true);
        }
    };

    // Setters
    setFocused(focused: boolean) {
        if (!this.mounted) {
            return;
        }
        this.setStateSafely({ focused });
    }

    // Getters
    getValue(): string {
        return this.props.value || '';
    }

    isFocused() {
        return this.state.focused;
    }

    // Actions
    calcMarginTop() {
        return this.isFocused() ? UIDevice.statusBarHeight() : 0;
    }

    focus() {
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    hideHeader() {
        if (this.hasHeader()) {
            this.setHeader(this.renderUIDummyNavigationBar());
        }
    }

    showHeader() {
        if (this.hasHeader()) {
            if (this.UIDummyNavigationBar) {
                this.UIDummyNavigationBar.animateRollDown(() => {
                    this.setHeader(null);
                });
            } else {
                this.setHeader(null);
            }
        }
    }

    hasHeader() {
        return this.props.onSetIntegratedHeader
            ? true
            : UIDevice.isMobile() && this.props.navigation;
    }

    setHeader(header: React$Node) {
        if (this.props.onSetIntegratedHeader) {
            this.props.onSetIntegratedHeader(header);
        } else if (this.props.navigation) {
            this.props.navigation.setParams({ headerProp: header ? { header } : null });
        }
    }

    // render
    renderGlass() {
        const { renderGlass } = this.props;

        if (!renderGlass) {
            return null;
        }

        return (
            <Image
                source={icoGlass}
                style={[
                    UIStyle.alignSelfCenter,
                    UIStyle.marginRightSmall,
                ]}
            />
        );
    }

    renderCancelButton() {
        const { value } = this.props;

        if (!this.isFocused() || !value?.length) {
            return null;
        }

        return (
            <TouchableOpacity style={styles.cancelButton} onPress={() => this.onCancel()}>
                <Image
                    testID="search_bar_cancel"
                    source={icoClear}
                />
            </TouchableOpacity>
        );
    }

    renderUIDummyNavigationBar() {
        return (
            <UIDummyNavigationBar
                ref={(component) => {
                    this.UIDummyNavigationBar = component;
                }}
            />
        );
    }

    render() {
        const {
            value,
            placeholder,
            testID,
            containerStyle,
            bottomSeparator,
            bottomSeparatorStyle,
            autoFocus,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        const separator = bottomSeparator
            ? <View style={[styles.bottomSeparator, bottomSeparatorStyle]} />
            : null;

        return (
            <View style={containerStyle}>
                <View style={styles.searchContainer}>
                    {this.renderGlass()}
                    <UITextInput
                        {...testIDProp}
                        ref={(component) => {
                            this.textInput = component;
                        }}
                        autoFocus={autoFocus}
                        value={value}
                        placeholder={placeholder}
                        returnKeyType="search"
                        textStyle={styles.textStyle}
                        containerStyle={styles.searchInput}
                        onFocus={this.onFocusHandler}
                        onBlur={this.onBlurHandler}
                        onChangeText={this.onChangeExpression}
                    />
                    {this.renderCancelButton()}
                </View>
                {separator}
            </View>
        );
    }
}
