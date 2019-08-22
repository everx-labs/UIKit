// @flow

import React from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIConstant from '../../../helpers/UIConstant';
import UIDevice from '../../../helpers/UIDevice';
import UIFont from '../../../helpers/UIFont';
import UILocalized from '../../../helpers/UILocalized';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UITextButton from '../../buttons/UITextButton';
import type { ReactNavigation } from '../../navigation/UINavigationBar';
import UITextInput from '../UITextInput';
import UIComponent from '../../UIComponent';

import UIDummyNavigationBar from './UIDummyNavigationBar';

import icoGlass from '../../../assets/ico-glass/ico-glass.png';
const styles = StyleSheet.create({
    searchInput: {
        width: null,
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: UIConstant.contentOffset(),
    },
    bottomSeparator: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        backgroundColor: UIColor.light(),
    },
});

type Props = {
    testID?: string,
    value?: string,
    placeholder?: string,
    onChangeExpression?: (text: string) => void,
    navigation?: ReactNavigation,
    onSetIntegratedHeader?: (header: React$Node) => React$Node,
    containerStyle: ViewStyleProp,
    bottomSeparator: boolean,
    renderGlass: boolean,
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
        renderGlass: false,
    };

    static handleHeader(navigation: ReactNavigation) {
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
        this.setFocused(true);
        this.hideHeader();
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
            <Image source={icoGlass} style={[UIStyle.alignSelfCenter, UIStyle.marginRightDefault]} />
        );
    }

    renderCancelButton() {
        if (!this.isFocused()) {
            return null;
        }
        return (
            <UITextButton
                title={UILocalized.Cancel}
                onPress={() => this.onCancel()}
            />
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
            value, placeholder, onChangeExpression, testID, containerStyle, bottomSeparator,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        const separator = bottomSeparator ? <View style={styles.bottomSeparator} /> : null;
        return (
            <View>
                <View
                    style={[
                        styles.searchContainer,
                        containerStyle,
                    ]}
                >
                    {this.renderGlass()}
                    <UITextInput
                        {...testIDProp}
                        ref={(component) => {
                            this.textInput = component;
                        }}
                        value={value}
                        placeholder={placeholder}
                        returnKeyType="search"
                        containerStyle={styles.searchInput}
                        textStyle={UIFont.smallRegular()}
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
