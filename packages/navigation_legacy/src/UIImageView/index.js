/* eslint-disable global-require */
// @flow
import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageURISource } from 'react-native/Libraries/Image/ImageSource';

import { UIColor, UIStyle, UIConstant } from '@tonlabs/uikit.core';
import {
    UISpinnerOverlay,
    UIAlertView,
    UIComponent,
} from '@tonlabs/uikit.components';
import { UIImage, UILabelColors } from '@tonlabs/uikit.hydrogen';

import { uiLocalized } from '@tonlabs/uikit.localization';

import UIActionSheet from '../UIActionSheet';
import type { MenuItemType } from '../UIActionSheet/MenuItem';

let ImagePicker;
let Lightbox;
let LightboxMobile;

if (Platform.OS === 'web') {
    // TODO: we should use our new Lightbox built with reanimated here
    // but since UIImageView isn't used anywere for now
    // it's not that important
    // require('./LightboxStyle');
    // Lightbox = require('react-image-lightbox').default;
} else {
    ImagePicker = require('react-native-image-picker');
    // LightboxMobile = require('react-native-lightbox').default;
    // TODO: we should use our new Lightbox built with reanimated here
    // but since UIImageView isn't used anywere for now
    // it's not that important
    LightboxMobile = null;
}

const styles = StyleSheet.create({
    photoContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

const photoOptions = {
    quality: 1.0,
    maxWidth: 960,
    maxHeight: 960,
    rotation: 0,
    storageOptions: {
        skipBackup: true,
    },
    mediaType: 'photo',
    // We had a crash here: https://github.com/FactorBench/react-native-image-picker/blob/develop/ios/ImagePickerManager.m#L374
    // So looks like disabling this option could fix it
    noData: true,
};

type Props = {
    testID?: ?string,
    source: string | ImageURISource,
    sourceBig?: ImageURISource,
    editable?: boolean,
    expandable?: boolean,
    disabled?: boolean,
    photoStyle?: ViewStyleProp,
    resizeMode?: string,
    resizeMethod?: string,
    onUploadPhoto: (source: string, showHUD: () => void, hideHUD: () => void, name: string) => void,
    onDeletePhoto?: (showHUD: () => void, hideHUD: () => void) => void,
    onPressPhoto: (showHUD: () => void, hideHUD: () => void) => void,
    onError?: (error: Error) => void,
};

type State = {
    showSpinnerOnPhotoView: boolean,
    lightboxVisible: boolean,
    navbarHeight: number,
};

type PickerResponse = {
    didCancel: boolean,
    error: string,
    uri: string,
};

export default class UIImageView extends UIComponent<Props, State> {
    static defaultProps = {
        source: { uri: '' },
        sourceBig: undefined,
        editable: false,
        expandable: true,
        disabled: false,
        photoStyle: null,
        resizeMode: 'cover',
        resizeMethod: 'auto',
        onUploadPhoto: () => {},
        onDeletePhoto: undefined,
        onPressPhoto: () => {},
        testID: null,
    };

    // Internals
    menuItemsList: MenuItemType[];

    // constructor
    constructor(props: Props) {
        super(props);
        const { FromCamera, FromGallery } = uiLocalized;
        this.menuItemsList = [
            {
                key: 'item 1',
                title: FromCamera,
                onPress: this.onPickFromCamera,
            },
            {
                key: 'item 2',
                title: FromGallery,
                onPress: this.onPickFromGallery,
            },
        ];

        this.state = {
            showSpinnerOnPhotoView: false,
            lightboxVisible: false,
            navbarHeight: 0,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.needsDeleteOption();
        if (this.props.source) {
            this.hideSpinnerOnPhotoView();
        }
    }

    // Events
    onImageLayout = () => {
        if (Platform.OS !== 'android') {
            return;
        }

        const screenHeight = Dimensions.get('screen').height;
        const windowHeight = Dimensions.get('window').height;
        const navbarHeight = (screenHeight - windowHeight) - (StatusBar.currentHeight || 0);
        if (navbarHeight !== this.state.navbarHeight) {
            this.setStateSafely({ navbarHeight });
        }
    }

    onPressPhoto = () => {
        if (!this.isEditable() && this.isExpandable()) {
            this.props.onPressPhoto(
                this.showSpinnerOnPhotoView,
                this.hideSpinnerOnPhotoView,
            );
            this.setLightboxVisible();
        } else if (this.isEditable() && Platform.OS !== 'web') {
            UIActionSheet.show(this.menuItemsList);
        }
    };

    onPickFromCamera = () => {
        if (!ImagePicker) {
            return;
        }
        ImagePicker.launchCamera(photoOptions, (response: PickerResponse) => {
            if (response.error) {
                this.onPickImageError(new Error(response.error));
                console.warn('[UIImageView] ImagePicker from camera Error: ', response.error);
            } else if (response.didCancel) {
                console.log('[UIImageView] User cancelled ImagePicker from camera');
            } else {
                const { uri } = response;
                if (!uri) {
                    return;
                }
                const source = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                // Please take a look at `noData` option, before you going to uncomment this
                // We had a crash because of that
                // source = { uri: 'data:image/jpeg;base64,' + response.data };
                const name = this.extractImageName(source);
                this.uploadPhoto(source, name);
            }
        });
    };

    onPickFromGallery = () => {
        if (!ImagePicker) {
            return;
        }
        ImagePicker.launchImageLibrary(photoOptions, (response: PickerResponse) => {
            if (response.error) {
                this.onPickImageError(new Error(response.error));
                console.warn('[UIImageView] ImagePicker from gallery Error: ', response.error);
            } else if (response.didCancel) {
                console.log('[UIImageView] User cancelled ImagePicker from gallery');
            } else {
                const { uri } = response;
                if (!uri) {
                    return;
                }
                const source = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                // Please take a look at `noData` option, before you going to uncomment this
                // We had a crash because of that
                // source = { uri: 'data:image/jpeg;base64,' + response.data };
                const name = this.extractImageName(source);
                this.uploadPhoto(source, name);
            }
        });
    };

    onPickImageError(error: Error) {
        if (this.props.onError) {
            this.props.onError(error);
        }
    }

    onDeletePhoto = () => {
        if (!this.mounted || !this.props.onDeletePhoto) {
            return;
        }
        this.props.onDeletePhoto(
            this.showSpinnerOnPhotoView,
            this.hideSpinnerOnPhotoView,
        );
    };

    // Used to open the input dialog directly using ref.
    input: any;
    openDialog() {
        if (Platform.OS === 'web' && this.input) {
            this.input.click();
        } else {
            this.onPressPhoto();
        }
    }

    // Setters
    setLightboxVisible(lightboxVisible: boolean = true) {
        this.setStateSafely({ lightboxVisible });
    }

    // Getters
    getPhoto(): ImageURISource {
        const photoURI = this.props.source;
        if (typeof photoURI === 'string') {
            return { uri: photoURI };
        }
        return photoURI;
    }

    getPhotoBig(): ?ImageURISource {
        const photoURI = this.props.sourceBig;
        if (typeof photoURI === 'string') {
            return { uri: photoURI };
        }
        return photoURI;
    }

    isEditable(): boolean {
        return !!this.props.editable && !this.props.disabled;
    }

    isExpandable(): boolean {
        return !!this.props.expandable;
    }

    isShowSpinnerOnPhotoView(): boolean {
        return this.state.showSpinnerOnPhotoView;
    }

    // Actions
    extractImageName(e: any): string {
        const source = Platform.OS === 'web' ? e.target.files[0] : e;
        let fileName = '';
        if (Platform.OS === 'web') {
            fileName = source.name;
        } else {
            const tmp = source.split('/');
            fileName = tmp[tmp.length - 1];
        }

        return fileName;
    }

    needsDeleteOption() {
        if (this.props.onDeletePhoto) {
            this.menuItemsList.push({
                key: 'item 3',
                title: uiLocalized.DeletePhoto,
                titleStyle: UILabelColors.TextNegative,
                onPress: this.onDeletePhoto,
            });
        }
    }

    showSpinnerOnPhotoView = (show: boolean = true, callback?: () => void) => {
        this.setStateSafely({
            showSpinnerOnPhotoView: show,
        }, callback);
    }

    hideSpinnerOnPhotoView = () => {
        this.showSpinnerOnPhotoView(false);
    }

    uploadPhoto(source: string, name: string) {
        if (!this.mounted) return;

        this.props.onUploadPhoto(
            source,
            this.showSpinnerOnPhotoView,
            this.hideSpinnerOnPhotoView,
            name,
        );
    }

    handleImageChange(e: any) {
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[0];
        const name = this.extractImageName(e);
        if (!file) {
            console.log('[UIImageView] Canceled load image from file');
            return;
        }
        if (file.size >= UIConstant.maxFileSize()) { // in decimal
            const msg = uiLocalized.formatString(uiLocalized.FileIsTooBig, UIConstant.maxFileSize() / 1000000);
            UIAlertView.showAlert(uiLocalized.Error, msg, [{ title: uiLocalized.OK }]);
            return;
        }

        reader.onload = () => {
            console.log('[UIImageView] Image from file was loaded');
            const photo: any = reader.result;
            this.uploadPhoto(photo, name);
        };
        reader.readAsDataURL(file);
    }

    // Render
    renderPhotoInputForWeb() {
        if (Platform.OS !== 'web' || !this.isEditable()) {
            return null;
        }
        const { testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        // TextInput doesn't work here
        return (<input
            ref={(component) => { this.input = component; }}
            {...testIDProp}
            type="file"
            name="image"
            className="inputClass"
            onChange={e => this.handleImageChange(e)}
            disabled={false}
            accept="image/*"
            style={{
                opacity: 0,
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
            }}
        />);
    }

    renderSpinnerOverlay() {
        return (
            <UISpinnerOverlay
                containerStyle={this.props.photoStyle}
                visible={this.state.showSpinnerOnPhotoView}
            />
        );
    }

    renderLightBox() {
        if (Platform.OS !== 'web' || !Lightbox) {
            return null;
        }

        if (!this.state.lightboxVisible) {
            return null;
        }

        const photo: ?ImageURISource = this.getPhoto();
        if (!photo || this.isShowSpinnerOnPhotoView()) {
            return null;
        }

        let photoBig: ?ImageURISource = this.getPhotoBig();
        if (!photoBig) {
            photoBig = photo;
        }

        return (
            <Lightbox
                mainSrc={photoBig.uri}
                onCloseRequest={() => this.setLightboxVisible(false)}
            />
        );
    }

    // this for render spinner while big photo loading
    // but with it animation little worse, angles of photo are square
    // need to make research
    // without it photo renders small until big will be loaded
    renderLightBoxMobileContent() {
        let photo = this.getPhoto();
        if (photo) {
            const photoBig = this.getPhotoBig();
            if (photoBig) {
                photo = photoBig;
            }
            return ([
                <UISpinnerOverlay
                    visible={this.state.showSpinnerOnPhotoView}
                />,
                <View
                    style={[UIStyle.Common.flex(), { top: this.state.navbarHeight }]}
                    onLayout={this.onImageLayout}
                >
                    <UIImage
                        resizeMode={this.props.resizeMode}
                        resizeMethod={this.props.resizeMethod}
                        style={UIStyle.Common.flex()}
                        source={photo}
                    />
                </View>,
            ]);
        }
        return ([
            <UISpinnerOverlay
                visible={this.state.showSpinnerOnPhotoView}
            />,
            <View style={styles.photoContainer} />,
        ]);
    }

    renderPhotoContent() {
        let photo = this.getPhoto();
        if (photo) {
            const photoBig = this.getPhotoBig();
            if (photoBig) {
                photo = photoBig;
            }
            return (
                <UIImage
                    resizeMode={this.props.resizeMode}
                    resizeMethod={this.props.resizeMethod}
                    style={[styles.photoContainer, this.props.photoStyle]}
                    source={photo}
                />
            );
        }
        return (
            <View style={[styles.photoContainer, this.props.photoStyle]} />
        );
    }

    renderPhoto() {
        if (Platform.OS === 'web' || this.isEditable()) {
            const { testID } = this.props;
            const testIDProp = testID ? { testID } : null;
            return (
                <TouchableOpacity
                    {...testIDProp}
                    style={[styles.photoContainer, this.props.photoStyle]}
                    onPress={() => this.onPressPhoto()}
                >
                    {this.renderPhotoContent()}
                    {this.renderLightBox()}
                    {this.renderPhotoInputForWeb()}
                </TouchableOpacity>
            );
        }
        if (!LightboxMobile) {
            return null;
        }
        const { width, height } = Dimensions.get('window');
        const expandable = this.isExpandable() ? (
            <LightboxMobile
                style={[styles.photoContainer, this.props.photoStyle]}
                underlayColor={UIColor.overlayWithAlpha(0.32)}
                activeProps={{
                    style: { resizeMode: 'contain', width, height },
                }}
                // for render spinner while photo loading
                renderContent={() => this.renderLightBoxMobileContent()}
                onOpen={this.onPressPhoto}
            >
                {this.renderPhotoContent()}
            </LightboxMobile>
        ) : this.renderPhotoContent();

        return expandable;
    }

    render() {
        return (
            <View style={[styles.photoContainer, this.props.photoStyle]}>
                {this.renderPhoto()}
                {this.renderSpinnerOverlay()}
            </View>
        );
    }
}
