import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { TextInput, Text, View, StyleSheet } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    container: {
        //
    },
    textView: {
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default class UIDetailsInput extends UIComponent {
    // Getters
    isFocused() {
        return this.textInput && this.textInput.isFocused();
    }

    // Actions
    focus() {
        this.textInput.focus();
    }

    blur() {
        this.textInput.blur();
    }

    // Render
    renderFloatingTitle() {
        const { floatingTitle, placeholder, details } = this.props;

        if (!floatingTitle || !details || !details.length) return null;

        return (
            <Text style={UIStyle.textTertiaryTinyRegular}>
                {placeholder}
            </Text>
        );
    }

    renderTextInput() {
        const {
            details,
            placeholder,
            onFocus,
            onBlur,
            onChangeText,
            onSubmitEditing,
            maxLength,
            editable,
            autoCapitalize,
            keyboardType,
            returnKeyType,
        } = this.props;
        const returnKeyTypeProp = returnKeyType ? { returnKeyType } : null;
        const maxLengthProp = maxLength ? { maxLength } : null;
        return (<TextInput
            ref={(component) => { this.textInput = component; }}
            value={details}
            placeholder={placeholder}
            editable={editable}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            {...returnKeyTypeProp}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            onChangeText={text => onChangeText(text)}
            onSubmitEditing={() => onSubmitEditing()}
            style={[UIStyle.textPrimaryBodyRegular, { flex: 1, lineHeight: null }]}
            selectionColor={UIColor.primary()}
            {...maxLengthProp}
        />);
    }

    renderCounter() {
        if (!this.props.showSymbolsLeft) return null;

        const { details, maxLength } = this.props;
        return (
            <Text
                style={[
                    UIStyle.textSecondaryBodyRegular,
                    { marginRight: UIConstant.smallContentOffset() },
                ]}
            >
                {maxLength - details.length}
            </Text>
        );
    }

    renderToken() {
        const { token } = this.props;
        if (!token) return null;
        return (
            <Text style={UIStyle.textSecondaryBodyRegular}>
                {token}
            </Text>
        );
    }

    renderTextView() {
        const { hideBottomLine } = this.props;
        const bottomLine = hideBottomLine ? {} : UIStyle.borderBottom;
        return (
            <View style={[styles.textView, bottomLine]}>
                {this.renderTextInput()}
                {this.renderCounter()}
                {this.renderToken()}
            </View>
        );
    }

    renderComment() {
        const { comment, commentStyle } = this.props;
        if (!comment) {
            return null;
        }
        return (
            <Text
                style={[
                    UIStyle.textSecondaryCaptionRegular,
                    UIStyle.marginTopTiny,
                    UIStyle.marginBottomSmall,
                    commentStyle,
                ]}
            >
                {comment}
            </Text>
        );
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                {this.renderFloatingTitle()}
                {this.renderTextView()}
                {this.renderComment()}
            </View>
        );
    }
}

UIDetailsInput.defaultProps = {
    containerStyle: {},
    floatingTitle: true,
    details: '',
    comment: '',
    placeholder: UILocalized.Details,
    maxLength: null,
    showSymbolsLeft: false,
    token: null,
    hideBottomLine: false,
    autoCapitalize: 'sentences',
    keyboardType: 'default',
    returnKeyType: null,
    editable: true,
    commentStyle: {},
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
};

UIDetailsInput.propTypes = {
    containerStyle: StylePropType,
    floatingTitle: PropTypes.bool,
    details: PropTypes.string,
    comment: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    showSymbolsLeft: PropTypes.bool,
    token: PropTypes.string,
    hideBottomLine: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    keyboardType: PropTypes.string,
    returnKeyType: PropTypes.string,
    editable: PropTypes.bool,
    commentStyle: StylePropType,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
};
