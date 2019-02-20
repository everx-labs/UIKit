import type { Node } from 'react';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';

import UIController from '../UIController';
import UIColor from '../../helpers/UIColor';
import UIConstant from '../../helpers/UIConstant';
import UIDevice from '../../helpers/UIDevice';
import UIFont from '../../helpers/UIFont';
import UIStyle from '../../helpers/UIStyle';
import UIProfilePhoto from '../../components/profile/UIProfilePhoto';
import UIDialogTextInput from './UIDialogTextInput';

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: UIDevice.statusBarHeight() + UIDevice.navigationBarHeight(),
    },
    titleView: {
        minHeight: 72,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    titleText: {
        textAlign: 'center',
        ...UIFont.bodyRegular(),
        color: UIColor.textPrimary(),
        // width: '100%', // Fix for Firefox (UPD: breaks layout on the phone)
    },
    subtitleView: {
        marginTop: UIConstant.mediumContentOffset(),
        minHeight: 72,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    subtitleText: {
        textAlign: 'center',
        ...UIFont.captionMedium(),
        color: UIColor.primary(),
        // width: '100%', // Fix for Firefox (UPD: breaks layout on the phone)
    },
    bottomView: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        width: '100%',
        maxWidth: UIConstant.elasticWidthMax(),
    },
});

/**
 this.textInputAutoFocus = true;
 this.textInputSecureTextEntry = false;
 this.auxTextInput
 */
class UIDialogController extends UIController {
    static styles() {
        return styles;
    }

    // constructor
    constructor(props) {
        super(props);

        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Pan;
        this.hasTextInput = false;
        this.textInputAutoFocus = true;
        this.textInputSecureTextEntry = false;

        this.onSubmitEditingTextInput = () => {
            if (this.auxTextInput) {
                this.auxTextInput.focus();
            }
        };

        this.marginBottom = new Animated.Value(0);
        this.state = {
            input: '',
            auxInput: '',
            photo: null,
            showIndicator: false,
        };
    }

    // Events
    onChangeInput(text) {
        this.setInput(text);
    }

    onChangeAuxInput(text) {
        this.setAuxInput(text);
    }

    onUploadPhoto(photo) {
        this.setStateSafely({
            photo,
        });
    }

    // Setters
    setInput(input) {
        this.setStateSafely({ input });
    }

    setAuxInput(auxInput) {
        this.setStateSafely({ auxInput });
    }

    setContentInset(contentInset) {
        super.setContentInset(contentInset);
        Animated.spring(this.marginBottom, {
            toValue: Math.max(0, contentInset.bottom - this.getSafeAreaInsets().bottom),
            duration: UIConstant.animationDuration(),
        }).start();
    }

    // Getters
    getMarginBottom() {
        return this.marginBottom;
    }

    getInput() {
        return this.state.input;
    }

    getAuxInput() {
        return this.state.auxInput;
    }

    getPhoto() {
        return this.state.photo;
    }

    // Render
    renderTitleView() {
        if (!this.title) {
            return null;
        }
        return (
            <View style={styles.titleView}>
                <Text
                    style={styles.titleText}
                    numberOfLines={3}
                >
                    {this.title}
                </Text>
            </View>
        );
    }

    renderPhotoView() {
        if (!this.hasPhotoView) {
            return null;
        }
        return (
            <UIProfilePhoto
                style={UIStyle.marginTopMedium}
                editable
                source={this.getPhoto()}
                onUploadPhoto={(photo, showHUD, hideHUD) => {
                    this.onUploadPhoto(photo, showHUD, hideHUD);
                }}
            />
        );
    }

    renderTextInput() {
        if (this.hasPhotoView) {
            return null;
        }
        if (!this.hasTextInput) {
            return null;
        }
        const keyboardTypeProp = this.textInputKeyboardType
            ? { keyboardType: this.textInputKeyboardType }
            : null;
        const maxLengthProp = this.textInputMaxLength > 0
            ? { maxLength: this.textInputMaxLength }
            : null;
        return (<UIDialogTextInput
            ref={(component) => { this.textInput = component; }}
            style={UIStyle.marginTopMedium}
            editable={!this.shouldShowIndicator()}
            autoFocus={this.textInputAutoFocus}
            autoCapitalize="words"
            textAlign="center"
            returnKeyType="next"
            beginningTag={this.textInputBeginningTag}
            tagSeparator={this.textInputTagSeparator}
            placeholder={this.textInputPlaceholder}
            secureTextEntry={this.textInputSecureTextEntry}
            {...keyboardTypeProp}
            {...maxLengthProp}
            value={this.getInput()}
            onChangeText={value => this.onChangeInput(value)}
            onSubmitEditing={() => this.onSubmitEditingTextInput()}
        />);
    }

    renderAuxTextInput() {
        if (!this.hasAuxTextInput) {
            return null;
        }
        return (<UIDialogTextInput
            ref={(component) => { this.auxTextInput = component; }}
            style={UIStyle.marginTopDefault}
            editable={!this.shouldShowIndicator()}
            autoCapitalize="words"
            textAlign="center"
            returnKeyType="done"
            placeholder={this.auxTextInputPlaceholder}
            value={this.getAuxInput()}
            onChangeText={value => this.onChangeAuxInput(value)}
            onSubmitEditing={() => this.signUp()}
        />);
    }

    renderSubtitle() {
        return null;
    }

    renderSubtitleView() {
        const subtitle = this.renderSubtitle();
        return subtitle ? <View style={styles.subtitleView}>{subtitle}</View> : null;
    }

    renderBottom() {
        return null;
    }

    renderBottomView() {
        const bottom = this.renderBottom();
        return bottom ? <View style={styles.bottomView}>{bottom}</View> : null;
    }

    renderSafely() {
        return (
            <Animated.View
                style={{ flex: 1, marginBottom: this.getMarginBottom() }}
            >
                <ScrollView
                    style={UIStyle.screenContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[UIStyle.pageContainer, styles.scrollContainer]}
                    keyboardShouldPersistTaps="handled"
                >
                    {this.renderTitleView()}
                    {this.renderPhotoView()}
                    {this.renderTextInput()}
                    {this.renderAuxTextInput()}
                    {this.renderSubtitleView()}
                </ScrollView>
                {this.renderBottomView()}
            </Animated.View>
        );
    }
}

export default UIDialogController;
