// @flow
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageURISource } from 'react-native/Libraries/Image/ImageSource';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIComponent } from '@tonlabs/uikit.components';
import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIBackgroundView, UIBackgroundViewColors } from '@tonlabs/uikit.hydrogen';
import { UIImageView } from '@tonlabs/uikit.navigation_legacy';


const cameraImage = UIAssets.icons.ui.camera;

type Props = {
    style: ViewStyleProp,
    editable: boolean,
    onUploadPhoto: (source: string, showHUD: () => void, hideHUD: () => void, name: string) => void,
    source: ?ImageURISource,
    onDeletePhoto?: (showHUD: () => void, hideHUD: () => void) => void,
};

const styles = StyleSheet.create({
    container: {
        width: UIConstant.profilePhotoSize(),
        height: UIConstant.profilePhotoSize(),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class UIProfilePhoto extends UIComponent<Props, {}> {
    static defaultProps: Props = {
        style: {},
        editable: false,
        source: null,
        onUploadPhoto: () => {},
        onDeletePhoto: () => {},
    };

    // Render
    renderOverlay() {
        if (!this.props.editable) {
            return null;
        }
        return (
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundOverlay}
                style={[
                    UIStyle.common.absoluteFillObject(),
                    UIStyle.common.profilePhoto(),
                ]}
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
        const {
            editable, style, source, onUploadPhoto, onDeletePhoto,
        } = this.props;
        const photoStyle = editable
            ? [
                UIStyle.common.absoluteFillObject(), UIStyle.common.profilePhoto(),
            ]
            : UIStyle.common.profilePhoto();
        return (
            <View style={[styles.container, style]}>
                {source != null && (
                    <UIImageView
                        source={source}
                        photoStyle={photoStyle}
                        editable={editable}
                        onUploadPhoto={onUploadPhoto}
                        onDeletePhoto={onDeletePhoto}
                    />
                )}
                {this.renderOverlay()}
                {this.renderCameraIcon()}
            </View>
        );
    }
}
