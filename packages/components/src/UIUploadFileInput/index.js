/* eslint-disable global-require */
// @flow
import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIColor, UIConstant, UITextStyle } from '@tonlabs/uikit.core';
import { UILinkButton, UILinkButtonIconPosition, UILinkButtonType } from '@tonlabs/uikit.hydrogen';
import type { UIColorThemeNameType } from '@tonlabs/uikit.core';

import UIComponent from '../UIComponent';

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
    editable?: boolean,
    floatingTitleText?: string,
    floatingTitle: boolean,
    theme?: UIColorThemeNameType,
    onChangeFile: (e: any) => void,
    testID?: string,
};

const uploadFileDefaultProps = {
    containerStyle: {},
    fileType: 'document',
    uploadText: '',
    editable: true,
    floatingTitleText: '',
    floatingTitle: true,
    theme: UIColor.Theme.Light,
    onChangeFile: (e: any) => {},
};

type UploadFileState = {
    file: ?any,
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
        const {
            floatingTitleText, uploadText, theme, floatingTitle,
        } = this.props;
        const text = !this.getFile() ? (floatingTitle ? floatingTitleText : ' ') : floatingTitleText || uploadText;
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
        if (!this.getFile()) {
            return null;
        }

        return (
            <View style={styles.iconCloseButton}>
                <UILinkButton
                    type={UILinkButtonType.Menu}
                    icon={UIAssets.icons.ui.closeRemove}
                    iconPosition={UILinkButtonIconPosition.Middle}
                    onPress={this.deleteFile}
                />
            </View>
        );
    }

    showFilePicker() {
        if (Platform.OS !== 'web') return;
        this.webInput && this.webInput.click();
    }

    renderTextButton() {
        return (
            <UILinkButton
                title={this.getFile() && this.getFile().name || this.props.uploadText}
                onPress={this.props.editable === false ? null : () => this.showFilePicker()}
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