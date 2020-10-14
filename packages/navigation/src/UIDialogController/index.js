/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    LayoutAnimation,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
    UIColor,
    UIConstant,
    UIFont,
    UIStyle,
} from '@uikit/core';
import {
    UIProfilePhoto,
} from '@uikit/components';

import UIController from '../UIController';
import UIDialogTextInput from './UIDialogTextInput';

const styles = StyleSheet.create({
    scrollContainer: {
        justifyContent: 'center',
        paddingTop: UIConstant.normalContentOffset(),
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
    subtitleContainer: {
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
    contentContainer: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: UIColor.white(),
    },
    bottomContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: UIColor.backgroundPrimary(),
        maxWidth: UIConstant.elasticWidthMax(),
    },
});

/**
 * Configuration Options
 * ---------------------
 * this.title = null
 * this.hasPhotoView = false
 * this.hasTextInput = false
 * this.hasAuxTextInput = false
 * this.testID = undefined
 * this.textInputPlaceholder = undefined
 * this.textInputAutoFocus = true
 * this.textInputSecureTextEntry = false
 * this.textInputKeyboardType = undefined
 * this.textInputMaxLength = undefined
 * this.textInputBeginningTag = undefined
 * this.textInputTagSeparator = undefined
 * this.auxTextInputPlaceholder = undefined
 *
 * Overridable
 * -----------
 * renderSubtitle()
 * renderContent()
 * renderBottom()
 * renderOverlay()
 */
class UIDialogController extends UIController {
    static styles() {
        return styles;
    }

    // constructor
    constructor(props) {
        super(props);

        this.wrapContentInScrollView = true;
        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Pan;
        this.title = undefined;
        this.hasPhotoView = false;
        this.hasTextInput = false;
        this.hasAuxTextInput = false;
        this.testID = undefined;
        this.textInputPlaceholder = undefined;
        this.textInputAutoFocus = true;
        this.textInputSecureTextEntry = false;
        this.textInputKeyboardType = undefined;
        this.textInputMaxLength = undefined;
        this.textInputBeginningTag = undefined;
        this.textInputTagSeparator = undefined;
        this.auxTextInputPlaceholder = undefined;

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
            bottomPanelHeight: 0,
        };
    }

    // Events
    onChangeInput = (text) => {
        this.setInput(text);
    };

    onChangeAuxInput = (text) => {
        this.setAuxInput(text);
    };

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

    setContentInset(contentInset, animation) {
        super.setContentInset(contentInset, animation);
        const bottomInset = Math.max(0, contentInset.bottom);
        const { duration, easing } = animation || {
            duration: UIConstant.animationDuration(),
            easing: LayoutAnimation.Types.keyboard,
        };
        // TODO: think how to use `useNativeDriver` here
        Animated.timing(this.marginBottom, {
            toValue: bottomInset,
            duration,
            easing: UIController.getEasingFunction(easing),
            useNativeDriver: false,
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

    getContentContainerStyle() {
        return null;
    }

    getBottomPanelHeight() {
        return this.state.bottomPanelHeight || 0;
    }

    // Render
    renderTitle() {
        if (!this.title) {
            return null;
        }
        return (
            <View style={styles.titleView}>
                <Text style={styles.titleText} numberOfLines={3}>{this.title}</Text>
            </View>
        );
    }

    renderPhoto() {
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
        if (!this.hasTextInput || this.hasPhotoView) {
            return null;
        }
        const keyboardTypeProp = this.textInputKeyboardType
            ? { keyboardType: this.textInputKeyboardType }
            : null;
        const maxLengthProp = this.textInputMaxLength > 0
            ? { maxLength: this.textInputMaxLength }
            : null;
        return (<UIDialogTextInput
            ref={(component) => {
                this.textInput = component;
            }}
            style={UIStyle.marginTopMedium}
            editable={!this.shouldShowIndicator()}
            autoFocus={this.textInputAutoFocus}
            textAlign="center"
            returnKeyType="next"
            beginningTag={this.textInputBeginningTag}
            tagSeparator={this.textInputTagSeparator}
            placeholder={this.textInputPlaceholder}
            secureTextEntry={this.textInputSecureTextEntry}
            {...keyboardTypeProp}
            {...maxLengthProp}
            value={this.getInput()}
            onChangeText={this.onChangeInput}
            onSubmitEditing={this.onSubmitEditingTextInput}
        />);
    }

    renderAuxTextInput() {
        if (!this.hasAuxTextInput) {
            return null;
        }
        return (<UIDialogTextInput
            ref={(component) => {
                this.auxTextInput = component;
            }}
            style={UIStyle.marginTopDefault}
            editable={!this.shouldShowIndicator()}
            autoCapitalize="words"
            textAlign="center"
            returnKeyType="done"
            placeholder={this.auxTextInputPlaceholder}
            value={this.getAuxInput()}
            onChangeText={this.onChangeAuxInput}
            onSubmitEditing={() => this.signUp()}
        />);
    }

    renderSubtitle() {
        return null;
    }

    renderSubtitleContainer() {
        const subtitle = this.renderSubtitle();
        return subtitle ? <View style={styles.subtitleContainer}>{subtitle}</View> : null;
    }

    renderBottom() {
        return null;
    }

    renderBottomContainer() {
        let bottom = this.renderBottom();
        if (Array.isArray(bottom)) {
            bottom = <React.Fragment>{bottom}</React.Fragment>;
        }
        return (
            <View
                style={styles.bottomContainer}
                onLayout={this.onLayoutBottomContainer}
            >
                {bottom}
            </View>
        );
    }

    renderContent() {
        return null;
    }

    onLayoutBottomContainer = (e) => {
        const { height } = e.nativeEvent.layout;

        if (!height) {
            return;
        }

        const bottomPanelHeight = Math.round(height);

        if (bottomPanelHeight !== this.state.bottomPanelHeight) {
            this.setStateSafely({
                bottomPanelHeight,
            });
        }
    };

    renderContentContainer() {
        let content = this.renderContent();
        if (Array.isArray(content)) {
            content = <React.Fragment>{content}</React.Fragment>;
        }
        return content ? <View style={styles.contentContainer}>{content}</View> : null;
    }

    renderOverlay() {
        return null;
    }

    renderSafely() {
        const content = (
            <React.Fragment>
                {this.renderTitle()}
                {this.renderPhoto()}
                {this.renderTextInput()}
                {this.renderAuxTextInput()}
                {this.renderSubtitleContainer()}
                {this.renderContentContainer()}
            </React.Fragment>
        );
        const testIDProp = this.testID ? { testID: `${this.testID}_wrapper` } : null;
        const wrappedContent = this.wrapContentInScrollView ? (
            <ScrollView
                {...testIDProp}
                style={UIStyle.container.screen()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    UIStyle.container.page(),
                    styles.scrollContainer,
                    this.getContentContainerStyle(),
                    { paddingBottom: this.getBottomPanelHeight() },
                ]}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
            >
                {content}
            </ScrollView>
        ) : (
            <View
                {...testIDProp}
                style={[
                    UIStyle.container.screen(),
                    UIStyle.container.page(),
                    this.getContentContainerStyle(),
                    { paddingBottom: this.getBottomPanelHeight() },
                ]}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
            >
                {content}
            </View>
        );
        const animatedContainerStyle = {
            flex: 1,
            marginBottom: this.getMarginBottom(),
        };
        return (
            <Animated.View style={animatedContainerStyle}>
                {wrappedContent}
                {this.renderBottomContainer()}
            </Animated.View>
        );
    }
}

export default UIDialogController;
