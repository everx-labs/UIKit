import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { View, Text, StyleSheet } from 'react-native';

import UIConstant from '../../helpers/UIConstant';
import UIStyle from '../../helpers/UIStyle';
import UIProfileInitials from '../UIProfileInitials';
import UIProfilePhoto from '../UIProfilePhoto';
import UITextInput from '../UITextInput';

const styles = StyleSheet.create({
    container: {
        marginVertical: UIConstant.contentOffset(),
    },
    profileView: {
        height: 96,
        flexDirection: 'row',
        alignItems: 'center',
    },
    namesView: {
        flex: 1,
        marginLeft: UIConstant.contentOffset(),
    },
});

export default class UIProfileView extends Component {
    // Render
    renderProfilePhoto() {
        const {
            id, initials, editable, photo, onUploadPhoto, onDeletePhoto,
        } = this.props;
        if (!photo && !editable && initials && id) {
            return (
                <UIProfileInitials
                    id={id}
                    initials={initials}
                />
            );
        }
        return (<UIProfilePhoto
            editable={editable}
            source={photo}
            onUploadPhoto={(newPhoto, showHUD, hideHUD) => {
                onUploadPhoto(newPhoto, showHUD, hideHUD);
            }}
            onDeletePhoto={(showHUD, hideHUD) => {
                onDeletePhoto(showHUD, hideHUD);
            }}
        />);
    }

    renderName() {
        const {
            editable, autoCapitalize, name, namePlaceholder,
            onChangeName, hasSecondName, onFocus, onBlur,
        } = this.props;
        return (<UITextInput
            editable={editable}
            value={name}
            placeholder={namePlaceholder}
            autoCapitalize={autoCapitalize}
            maxLength={UIConstant.maxTextLineLength()}
            onChangeText={newValue => onChangeName(newValue)}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            needBorderBottom={hasSecondName}
        />);
    }

    renderSecondName() {
        if (!this.props.hasSecondName) {
            return null;
        }
        const {
            editable, autoCapitalize, secondName, secondNamePlaceholder,
            onChangeSecondName, onFocus, onBlur,
        } = this.props;
        return (<UITextInput
            editable={editable}
            value={secondName}
            placeholder={secondNamePlaceholder}
            autoCapitalize={autoCapitalize}
            maxLength={UIConstant.maxTextLineLength()}
            onChangeText={newValue => onChangeSecondName(newValue)}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
        />);
    }

    renderProfileNames() {
        return (
            <View style={styles.namesView}>
                {this.renderName()}
                {this.renderSecondName()}
            </View>
        );
    }

    renderDetails() {
        const { details } = this.props;
        if (!details) {
            return null;
        }
        return (
            <Text style={[UIStyle.textSecondaryTinyRegular, UIStyle.marginTopTiny]}>
                {details}
            </Text>
        );
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={styles.profileView}>
                    {this.renderProfilePhoto()}
                    {this.renderProfileNames()}
                </View>
                {this.renderDetails()}
            </View>
        );
    }
}

UIProfileView.defaultProps = {
    id: null,
    initials: '',
    containerStyle: {},
    editable: false,
    photo: null,
    hasSecondName: false,
    name: '',
    secondName: '',
    namePlaceholder: '',
    secondNamePlaceholder: '',
    details: null,
    autoCapitalize: 'sentences',
    onChangeName: () => {},
    onChangeSecondName: () => {},
    onUploadPhoto: () => {},
    onDeletePhoto: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

UIProfileView.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    initials: PropTypes.string,
    containerStyle: StylePropType,
    editable: PropTypes.bool,
    photo: PropTypes.string,
    hasSecondName: PropTypes.bool,
    name: PropTypes.string,
    secondName: PropTypes.string,
    namePlaceholder: PropTypes.string,
    secondNamePlaceholder: PropTypes.string,
    details: PropTypes.string,
    autoCapitalize: PropTypes.string,
    onChangeName: PropTypes.func,
    onChangeSecondName: PropTypes.func,
    onUploadPhoto: PropTypes.func,
    onDeletePhoto: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
};
