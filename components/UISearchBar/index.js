import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

import UIConstant from '../../helpers/UIConstant';
import UIDevice from '../../helpers/UIDevice';
import UIFont from '../../helpers/UIFont';
import UILocalized from '../../helpers/UILocalized';
import UIColor from '../../helpers/UIColor';
import UITextButton from '../UITextButton';
import UITextInput from '../UITextInput';

import UIDummyNavigationBar from './UIDummyNavigationBar';

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

class UISearchBar extends Component {
    static handleHeader(navigation) {
        const { params } = navigation.state;
        return params ? params.headerProp : null;
    }

    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // Events
    onFocusHandler() {
        this.setFocused(true);
        this.hideHeader();
    }

    onBlurHandler(force = false) {
        if (this.props.value !== '' && !force) {
            return;
        }
        this.setFocused(false);
        this.showHeader();
    }

    onCancel() {
        this.props.onChangeExpression('');
        if (this.textInput && this.textInput.isFocused()) {
            this.textInput.blur(); // onBlurHandler will be called when props.value is already ''.
        } else {
            this.onBlurHandler(true);
        }
    }

    // Setters
    setFocused(focused) {
        if (!this.mounted) {
            return;
        }
        this.setState({ focused });
    }

    // Getters
    isFocused() {
        return this.state.focused;
    }

    // Actions
    calcMarginTop() {
        return this.isFocused() ? UIDevice.statusBarHeight() : 0;
    }

    hideHeader() {
        if (UIDevice.isMobile() && this.props.navigation) {
            const headerProp = { header: this.renderUIDummyNavigationBar() };
            this.props.navigation.setParams({ headerProp });
        }
    }

    showHeader() {
        if (UIDevice.isMobile() && this.props.navigation) {
            if (this.UIDummyNavigationBar) {
                this.UIDummyNavigationBar.animateRollDown(() => {
                    this.props.navigation.setParams({ headerProp: null });
                });
            } else {
                this.props.navigation.setParams({ headerProp: null });
            }
        }
    }

    // render
    renderCancelButton() {
        if (!this.isFocused()) return null;
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
                ref={(component) => { this.UIDummyNavigationBar = component; }}
            />
        );
    }

    render() {
        const {
            value, placeholder, onChangeExpression,
        } = this.props;

        return (
            <View>
                <View
                    style={[
                        styles.searchContainer,
                    ]}
                >
                    <UITextInput
                        ref={(component) => { this.textInput = component; }}
                        value={value}
                        placeholder={placeholder}
                        returnKeyType="search"
                        containerStyle={styles.searchInput}
                        textStyle={UIFont.smallRegular()}
                        onFocus={() => this.onFocusHandler()}
                        onBlur={() => this.onBlurHandler()}
                        onChangeText={newExpression => onChangeExpression(newExpression)}
                    />
                    {this.renderCancelButton()}
                </View>
                <View style={styles.bottomSeparator} />
            </View>
        );
    }
}

export default UISearchBar;

UISearchBar.defaultProps = {
    value: '',
    placeholder: '',
    onChangeExpression: () => {},
    navigation: null,
};

UISearchBar.propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChangeExpression: PropTypes.func,
    navigation: PropTypes.object,
};
