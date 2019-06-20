/* eslint-disable global-require */
// @flow
import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';
import UITextButton from '../../buttons/UITextButton';

import type { UIColorThemeNameType } from '../../../helpers/UIColor/UIColorTypes';

import iconClose from '../../../assets/ico-close/remove.png';

const styles = StyleSheet.create({
    container: {
        paddingTop: UIConstant.tinyContentOffset(),
        paddingBottom: UIConstant.smallContentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCloseButton: {
        width: UIConstant.buttonHeight(),
        height: UIConstant.buttonHeight(),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

type UploadFileInputProps = {
    containerStyle: ViewStyleProp,
    fileType?: string,
    uploadText: string,
    floatingTitleText?: string,
    theme?: UIColorThemeNameType,
    onChangeFile: (e: any) => void,
    testID?: string,
};

const uploadFileDefaultProps = {
    containerStyle: {},
    fileType: 'document',
    uploadText: '',
    floatingTitleText: '',
    theme: UIColor.Theme.Light,
    onChangeFile: (e: any) => {},
};

type UploadFileState = {
    file: ?any,
};

type WebInput = {
  click: (e: any) => void,
};

// FOR WEB OBLY, TODO: iOS, Android support
export default class UIUploadFileInput<Props, State> extends UIComponent<Props & UploadFileInputProps, any & UploadFileState> {
    static defaultProps: UploadFileInputProps = uploadFileDefaultProps;
    webInput: ?HTMLInputElement;

    constructor(props: Props & UploadFileInputProps) {
        super(props);

        this.state = {
            file: null,
        };

        this.webInput = null;
    }

    getFile() {
        return this.state.file;
    }

    onChangeFile(e: any) {
        const [file] = e.target.files || [null];
        if (file) {
            this.setStateSafely({ file });
            this.props.onChangeFile && this.props.onChangeFile(file);
        } // else - means upload was cancelled, so don't need to update anything
    }

    renderFloatingTitle() {
        const { floatingTitleText, uploadText, theme } = this.props;
        const text = !this.getFile() ? ' ' : floatingTitleText || uploadText;
        const colorStyle = UIColor.textTertiaryStyle(theme);

        return (
            <Text style={[UITextStyle.tinyRegular, colorStyle]}>
                {text}
            </Text>
        );
    }

    deleteFile = () => {
        this.props.onChangeFile && this.props.onChangeFile(null);
        this.setStateSafely({ file: null });
        this.webInput && (this.webInput.value = '');
    }

    renderAction() {
        const { theme } = this.props;
        if (!this.getFile()) {
            return null;
        }

        return (
            <UITextButton
                buttonStyle={styles.iconCloseButton}
                iconColor={UIColor.black()}
                icon={iconClose}
                onPress={this.deleteFile}
            />
        );
    }

    showFilePicker() {
        if (Platform.OS !== 'web') return;
        this.webInput && this.webInput.click();
    }

    renderTextButton() {
        return (
            <UITextButton
                title={this.getFile() && this.getFile().name || this.props.uploadText}
                onPress={() => this.showFilePicker()}
            />
        );
    }

    renderUploadInput() {
        return (
            <View style={[styles.container]}>
                {this.renderWebInput()}
                {this.renderTextButton()}
                {this.renderAction()}
            </View>
        );
    }

    render() {
        return (
            <View style={[this.props.containerStyle]}>
                {this.renderFloatingTitle()}
                {this.renderUploadInput()}
            </View>
        );
    }

    renderWebInput() {
        if (Platform.OS !== 'web') {
            return null;
        }
        const { testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        const invisibleInputStyle = {
            opacity: 0,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
        };

        return (<input
            ref={(component) => { this.webInput = component; }}
            {...testIDProp}
            type="file"
            name="image"
            className="inputClass"
            onChange={e => this.onChangeFile(e)}
            disabled={false}
            accept={this.props.fileType === 'document' ? 'application/pdf' : 'image/*'}
            style={invisibleInputStyle}
        />);
    }
}
