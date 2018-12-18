import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { Platform, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';

import { UISpinnerOverlay, UILocalized, UIActionSheet, UIAlertView, UIColor } from '../../UIKit';

const ImagePicker = Platform.OS !== 'web' ? require('react-native-image-picker') : null;
const Lightbox = Platform.OS === 'web' ? require('react-images').default : null;
const LightboxMobile = Platform.OS !== 'web' ? require('react-native-lightbox').default : null;

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
};

export default class UIImageView extends Component {
    // constructor
    constructor(props) {
        super(props);
        const { FromCamera, FromGallery, DeletePhoto } = UILocalized;
        this.menuItemsList = [
            {
                key: 'item 1',
                title: FromCamera,
                onPress: () => this.onPickFromCamera(),
            },
            {
                key: 'item 2',
                title: FromGallery,
                onPress: () => this.onPickFromGallery(),
            },
            {
                key: 'item 3',
                title: DeletePhoto,
                textStyle: { color: UIColor.error() },
                onPress: () => this.onDeletePhoto(),
            },
        ];

        this.state = {
            showSpinnerOnPhotoView: false,
            lightboxVisible: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.source) {
            this.hideSpinnerOnPhotoView();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // Events
    onPressPhoto() {
        if (!this.isEditable() && this.isExpandable()) {
            this.props.onPressPhoto(
                this.showSpinnerOnPhotoView,
                this.hideSpinnerOnPhotoView,
            );
            this.setLightboxVisible();
        } else if (this.isEditable() && Platform.OS !== 'web') {
            this.actionSheet.show();
        }
    }

    onPickFromCamera() {
        ImagePicker.launchCamera(photoOptions, (response) => {
            if (response.error) {
                console.warn('[UIImageView] ImagePicker from camera Error: ', response.error);
            } else if (response.didCancel) {
                console.log('[UIImageView] User cancelled ImagePicker from camera');
            } else {
                const source = Platform.OS === 'ios'
                    ? response.uri.replace('file://', '')
                    : response.uri;
                // source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.uploadPhoto(source);
            }
        });
    }

    onPickFromGallery() {
        ImagePicker.launchImageLibrary(photoOptions, (response) => {
            if (response.error) {
                console.warn('[UIImageView] ImagePicker from gallery Error: ', response.error);
            } else if (response.didCancel) {
                console.log('[UIImageView] User cancelled ImagePicker from gallery');
            } else {
                const source = Platform.OS === 'ios'
                    ? response.uri.replace('file://', '')
                    : response.uri;
                // source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.uploadPhoto(source);
            }
        });
    }

    onDeletePhoto() {
        if (!this.mounted) return;
        this.props.onDeletePhoto(
            this.showSpinnerOnPhotoView,
            this.hideSpinnerOnPhotoView,
        );
    }

    // Setters
    setLightboxVisible(lightboxVisible = true) {
        this.setState({ lightboxVisible });
    }

    // Getters
    getPhoto() {
        const photoURI = this.props.source;
        if (photoURI instanceof String || typeof photoURI === 'string') {
            return { uri: photoURI };
        }
        return photoURI;
    }

    getPhotoBig() {
        const photoURI = this.props.sourceBig;
        if (photoURI instanceof String || typeof photoURI === 'string') {
            return { uri: photoURI };
        }
        return photoURI;
    }

    isEditable() {
        return this.props.editable && !this.props.disabled;
    }

    isExpandable() {
        return this.props.expandable;
    }

    isShowSpinnerOnPhotoView() {
        return this.state.showSpinnerOnPhotoView;
    }

    // Actions
    showSpinnerOnPhotoView = (show = true, callback) => {
        if (!this.mounted) return;
        this.setState({
            showSpinnerOnPhotoView: show,
        }, callback);
    }

    hideSpinnerOnPhotoView = () => {
        this.showSpinnerOnPhotoView(false);
    }

    uploadPhoto(source) {
        if (!this.mounted) return;
        this.props.onUploadPhoto(
            source,
            this.showSpinnerOnPhotoView,
            this.hideSpinnerOnPhotoView,
        );
    }

    handleImageChange(e) {
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[0];
        if (!file) {
            console.log('[UIImageView] Canceled load image from file');
            return;
        }
        if (file.size >= 10000000) { // in decimal
            UIAlertView.showAlert(UILocalized.Error, UILocalized.FileIsTooBig, [{
                title: UILocalized.OK,
                onPress: () => {
                    // nothing
                },
            }]);
            return;
        }

        reader.onload = () => {
            console.log('[UIImageView] Image from file was loaded');
            this.uploadPhoto(reader.result);
        };
        reader.readAsDataURL(file);
    }

    // Render
    renderPhotoInputForWeb() {
        if (Platform.OS !== 'web' || !this.isEditable()) {
            return null;
        }
        // TextInput doesn't work here
        return (<input
            ref={(component) => { this.input = component; }}
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
        if (Platform.OS !== 'web') {
            return null;
        }
        const photo = this.getPhoto();
        if (!photo || this.isShowSpinnerOnPhotoView()) {
            return null;
        }
        let photoBig = this.getPhotoBig();
        if (!photoBig) {
            photoBig = photo;
        }
        console.log('[UIImageView] Images:', [{ src: photoBig.uri }]);
        return (
            <Lightbox
                images={[{ src: photoBig.uri }]}
                isOpen={this.state.lightboxVisible}
                onClose={() => this.setLightboxVisible(false)}
                showImageCount={false}
                backdropClosesModal
                enableKeyboardInput
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
                <Image
                    resizeMode="contain"
                    resizeMethod="auto"
                    style={{ flex: 1 }}
                    source={photo}
                />,
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
                <Image
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

    renderActionSheet() {
        if (Platform.OS === 'web') {
            return null;
        }
        return (
            <UIActionSheet
                ref={(component) => { this.actionSheet = component; }}
                needCancelItem={false}
                menuItemsList={this.state.menuItemsList}
                masterActionSheet={false}
            />
        );
    }

    renderPhoto() {
        if (Platform.OS === 'web' || this.isEditable()) {
            return (
                <TouchableOpacity
                    style={[styles.photoContainer, this.props.photoStyle]}
                    onPress={() => this.onPressPhoto()}
                >
                    {this.renderPhotoContent()}
                    {this.renderLightBox()}
                    {this.renderPhotoInputForWeb()}
                </TouchableOpacity>
            );
        }
        const { width, height } = Dimensions.get('window');
        return (
            <LightboxMobile
                style={[styles.photoContainer, this.props.photoStyle]}
                underlayColor={UIColor.overlayWithAlpha(0.32)}
                activeProps={{
                    style: { resizeMode: 'contain', width, height },
                }}
                // for render spinner while photo loading
                renderContent={() => this.renderLightBoxMobileContent()}
                onOpen={() => this.onPressPhoto()}
            >
                {this.renderPhotoContent()}
            </LightboxMobile>
        );
    }

    render() {
        return (
            <View style={[styles.photoContainer, this.props.photoStyle]}>
                {this.renderPhoto()}
                {this.renderSpinnerOverlay()}
                {this.renderActionSheet()}
            </View>
        );
    }
}

UIImageView.defaultProps = {
    source: null,
    sourceBig: null,
    editable: false,
    expandable: true,
    disabled: false,
    photoStyle: null,
    resizeMode: 'cover',
    resizeMethod: 'auto',
    onUploadPhoto: () => {},
    onDeletePhoto: () => {},
    onPressPhoto: () => {},
};

UIImageView.propTypes = {
    source: PropTypes.string,
    sourceBig: PropTypes.string,
    editable: PropTypes.bool,
    expandable: PropTypes.bool,
    disabled: PropTypes.bool,
    photoStyle: StylePropType,
    resizeMode: PropTypes.string,
    resizeMethod: PropTypes.string,
    onUploadPhoto: PropTypes.func,
    onDeletePhoto: PropTypes.func,
    onPressPhoto: PropTypes.func,
};
