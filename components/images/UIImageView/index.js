import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { Platform, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';

import UISpinnerOverlay from '../UISpinnerOverlay';
import UILocalized from '../../helpers/UILocalized';
import UIActionSheet from '../menus/UIActionSheet';
import UIAlertView from '../popup/UIAlertView';
import UIColor from '../../helpers/UIColor';
import UIComponent from '../UIComponent';

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

type Props = {
    source: string,
    sourceBig?: string,
    editable?: boolean,
    expandable?: boolean,
    disabled?: boolean,
    photoStyle?: StylePropType,
    resizeMode?: string,
    resizeMethod?: string,
    onUploadPhoto?: () => void,
    onDeletePhoto?: () => void,
    onPressPhoto?: () => void,
};

type State = {
    showSpinnerOnPhotoView: boolean,
    lightboxVisible: boolean,
};

type PickerResponse = {
    error?: Error,
    didCancel?: boolean,
    uri?: string,
};

type PhotoURI = {
    uri: string,
};

type MenuItem = {
    key: string,
    title: string,
    onPress: () => void,
}

export default class UIImageView extends UIComponent<Props, State> {
    // Internals
    menuItemsList: MenuItem[];

    // constructor
    constructor(props: Props) {
        super(props);
        const { FromCamera, FromGallery } = UILocalized;
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
        ];

        this.state = {
            showSpinnerOnPhotoView: false,
            lightboxVisible: false,
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
        ImagePicker.launchCamera(photoOptions, (response: PickerResponse) => {
            if (response.error) {
                console.warn('[UIImageView] ImagePicker from camera Error: ', response.error);
            } else if (response.didCancel) {
                console.log('[UIImageView] User cancelled ImagePicker from camera');
            } else {
                const source = Platform.OS === 'ios'
                    ? response.uri.replace('file://', '')
                    : response.uri;
                // source = { uri: 'data:image/jpeg;base64,' + response.data };
                const name = this.extractImageName(source);
                this.uploadPhoto(source, name);
            }
        });
    }

    onPickFromGallery() {
        ImagePicker.launchImageLibrary(photoOptions, (response: PickerResponse) => {
            if (response.error) {
                console.warn('[UIImageView] ImagePicker from gallery Error: ', response.error);
            } else if (response.didCancel) {
                console.log('[UIImageView] User cancelled ImagePicker from gallery');
            } else {
                const source = Platform.OS === 'ios'
                    ? response.uri.replace('file://', '')
                    : response.uri;
                // source = { uri: 'data:image/jpeg;base64,' + response.data };
                const name = this.extractImageName(source);
                this.uploadPhoto(source, name);
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
    setLightboxVisible(lightboxVisible: boolean = true) {
        this.setStateSafely({ lightboxVisible });
    }

    // Getters
    getPhoto(): PhotoURI {
        const photoURI = this.props.source;
        if (photoURI instanceof String || typeof photoURI === 'string') {
            return { uri: photoURI };
        }
        return photoURI;
    }

    getPhotoBig(): PhotoURI {
        const photoURI = this.props.sourceBig;
        if (photoURI instanceof String || typeof photoURI === 'string') {
            return { uri: photoURI };
        }
        return photoURI;
    }

    isEditable(): boolean {
        return this.props.editable && !this.props.disabled;
    }

    isExpandable(): boolean {
        return this.props.expandable;
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
                title: UILocalized.DeletePhoto,
                textStyle: { color: UIColor.error() },
                onPress: () => this.onDeletePhoto(),
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
            this.uploadPhoto(reader.result, name);
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
                needCancelItem
                menuItemsList={this.menuItemsList}
                masterActionSheet={false}
            />
        );
    }

    renderPhoto() {
        if (Platform.OS === 'web' || this.isEditable()) {
            return (
                <TouchableOpacity
                    onPress={() => this.onPressPhoto()}
                    style={[styles.photoContainer, { alignItems: this.props.alignItems }]}
                >
                    <View style={this.props.containerStyle}>
                        {this.renderPhotoContent()}
                        {this.props.children}
                    </View>
                    {this.renderLightBox()}
                    {this.renderPhotoInputForWeb()}
                </TouchableOpacity>
            );
        }
        const { width, height } = Dimensions.get('window');
        return (
            <LightboxMobile
                style={[styles.photoContainer, { alignItems: this.props.alignItems }]}
                underlayColor={UIColor.overlayWithAlpha(0.32)}
                activeProps={{
                    style: { resizeMode: 'contain', width, height },
                }}
                // for render spinner while photo loading
                renderContent={() => this.renderLightBoxMobileContent()}
                onOpen={() => this.onPressPhoto()}
            >
                <View style={this.props.containerStyle}>
                    {this.renderPhotoContent()}
                    {this.props.children}
                </View>
            </LightboxMobile>
        );
    }

    render() {
        return (
            <View style={styles.photoContainer}>
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
    alignItems: 'center',
    photoStyle: null,
    containerStyle: null,
    resizeMode: 'cover',
    resizeMethod: 'auto',
    onUploadPhoto: () => {},
    onDeletePhoto: null,
    onPressPhoto: () => {},
};

UIImageView.propTypes = {
    source: PropTypes.string,
    sourceBig: PropTypes.string,
    editable: PropTypes.bool,
    expandable: PropTypes.bool,
    disabled: PropTypes.bool,
    alignItems: PropTypes.string,
    containerStyle: StylePropType,
    photoStyle: StylePropType,
    resizeMode: PropTypes.string,
    resizeMethod: PropTypes.string,
    onUploadPhoto: PropTypes.func,
    onDeletePhoto: PropTypes.func,
    onPressPhoto: PropTypes.func,
};
