import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Image } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIImageView from '../../images/UIImageView';
import UIComponent from '../../UIComponent';

const cameraImage = require('../../../assets/ico-camera/ico-camera.png');

const styles = StyleSheet.create({
    container: {
        width: UIConstant.profilePhotoSize(),
        height: UIConstant.profilePhotoSize(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        backgroundColor: UIColor.overlay20(),
    },
});

export default class UIProfilePhoto extends UIComponent {
    // Render
    renderOverlay() {
        if (!this.props.editable) {
            return null;
        }
        return (
            <View
                style={[UIStyle.absoluteFillObject, UIStyle.profilePhoto, styles.overlay]}
                pointerEvents="none"
            />
        );
    }

    renderCameraIcon() {
        if (!this.props.editable) {
            return null;
        }
        return (
            <View pointerEvents="none">
                <Image source={cameraImage} />
            </View>
        );
    }

    render() {
        const { absoluteFillObject, profilePhoto } = UIStyle;
        const photoStyle = this.props.editable
            ? StyleSheet.flatten([absoluteFillObject, profilePhoto])
            : profilePhoto;
        return (
            <View style={[styles.container, this.props.style]}>
                <UIImageView
                    source={this.props.source}
                    photoStyle={photoStyle}
                    editable={this.props.editable}
                    onUploadPhoto={this.props.onUploadPhoto}
                    onDeletePhoto={this.props.onDeletePhoto}
                />
                {this.renderOverlay()}
                {this.renderCameraIcon()}
            </View>
        );
    }
}

UIProfilePhoto.defaultProps = {
    style: {},
    editable: false,
    source: null,
    onUploadPhoto: () => {},
    onDeletePhoto: () => {},
};

UIProfilePhoto.propTypes = {
    style: StylePropType,
    editable: PropTypes.bool,
    source: PropTypes.string,
    onUploadPhoto: PropTypes.func,
    onDeletePhoto: PropTypes.func,
};
