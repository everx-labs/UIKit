/* eslint-disable class-methods-use-this */
import React from 'react';
import { View, StyleSheet, Animated, LayoutAnimation } from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { Portal } from '@tonlabs/uikit.layout';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.themes';
import { ScrollView } from '@tonlabs/uikit.scrolls';

import UIController from '../UIController';
import UIDialogTextInput from './UIDialogTextInput';

const AnimatedUIBackgroundView = Animated.createAnimatedComponent(UIBackgroundView);

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
        // width: '100%', // Fix for Firefox (UPD: breaks layout on the phone)
    },
    subtitleContainer: {
        marginTop: UIConstant.mediumContentOffset(),
        minHeight: 72,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
    bottomContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: UIConstant.elasticWidthMax(),
    },
});

/**
 * Configuration Options
 * ---------------------
 * this.title = null
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
        this.trackKeyboard = true;

        this.onSubmitEditingTextInput = () => {
            if (this.auxTextInput) {
                this.auxTextInput.focus();
            }
        };

        this.marginBottom = new Animated.Value(0);
        this.state = {
            input: '',
            auxInput: '',
            showIndicator: false,
            bottomPanelHeight: 0,
        };
    }

    // Events
    onChangeInput = text => {
        this.setInput(text);
    };

    onChangeAuxInput = text => {
        this.setAuxInput(text);
    };

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
                <UILabel
                    color={UILabelColors.TextPrimary}
                    numberOfLines={3}
                    role={UILabelRoles.ParagraphText}
                    style={styles.titleText}
                >
                    {this.title}
                </UILabel>
            </View>
        );
    }

    renderTextInput() {
        if (!this.hasTextInput) {
            return null;
        }
        const keyboardTypeProp = this.textInputKeyboardType
            ? { keyboardType: this.textInputKeyboardType }
            : null;
        const maxLengthProp =
            this.textInputMaxLength > 0 ? { maxLength: this.textInputMaxLength } : null;
        return (
            <UIDialogTextInput
                ref={component => {
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
            />
        );
    }

    renderAuxTextInput() {
        if (!this.hasAuxTextInput) {
            return null;
        }
        return (
            <UIDialogTextInput
                ref={component => {
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
            />
        );
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
            bottom = (
                <Portal forId="scene">
                    <React.Fragment>{bottom}</React.Fragment>
                </Portal>
            );
        }

        return (
            <Portal forId="scene">
                <AnimatedUIBackgroundView
                    style={[
                        styles.bottomContainer,
                        {
                            marginBottom: this.getMarginBottom(),
                        },
                    ]}
                    onLayout={this.onLayoutBottomContainer}
                >
                    {bottom}
                </AnimatedUIBackgroundView>
            </Portal>
        );
    }

    renderContent() {
        return null;
    }

    onLayoutBottomContainer = e => {
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
        return content ? (
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundPrimary}
                style={styles.contentContainer}
            >
                {content}
            </UIBackgroundView>
        ) : null;
    }

    renderOverlay() {
        return null;
    }

    renderSafely() {
        const content = (
            <React.Fragment>
                {this.renderTitle()}
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
