import React from 'react';
import { StyleSheet, View, Text, Modal, Platform, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import PopupDialog, { ScaleAnimation } from 'react-native-popup-dialog';

import UIStyle from '../../../helpers/UIStyle';
import UILocalized from '../../../helpers/UILocalized';
import UIConstant from '../../../helpers/UIConstant';
import UIController from '../../../controllers/UIController';
import UIColor from '../../../helpers/UIColor';
import UIDevice from '../../../helpers/UIDevice';
import UITextButton from '../../buttons/UITextButton';
import UITextInput from '../../text/UITextInput';

const statusBarHeight = UIDevice.statusBarHeight();

const scaleAnimation = new ScaleAnimation();
const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.overlay60(),
    },
    passwordContainer: {
        height: UIConstant.largeCellHeight(),
    },
    contentView: {
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    textButton: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput: {
        height: null,
        width: null,
    },
});

const {
    marginTopMedium, textSecondarySmallRegular,
    marginBottomSmall, marginTopTiny, marginTopSmall,
    marginHorizontalOffset, textSecondaryTinyRegular, borderBottom,
} = UIStyle;

const titleContainer = [
    marginBottomSmall,
    marginHorizontalOffset,
    textSecondarySmallRegular,
];

const passwordTitleStyle = [
    marginTopTiny,
    marginHorizontalOffset,
    textSecondaryTinyRegular,
];

const buttonsContainer = [
    marginBottomSmall,
    styles.buttonsContainer,
];

const textInputContainer = StyleSheet.flatten([
    marginTopTiny,
    marginHorizontalOffset,
    styles.textInput,
]);

const borderContainer = [
    borderBottom,
    marginTopSmall,
    marginHorizontalOffset,
];

let masterRef = null;

const initialPasswordState = {
    password: '',
    passwordToConfirm: '',
};

export default class UIPasswordPrompt extends UIController {
    static showPrompt(props, onDone, onCancel) {
        if (masterRef) {
            masterRef.showPrompt(props, onDone, onCancel);
        }
    }

    static hidePrompt() {
        if (masterRef) {
            masterRef.hidePrompt();
        }
    }

    static calcPromptWidth() {
        const { width } = Dimensions.get('window');
        return Math.min(UIConstant.passwordPromptWidth(), width - (2 * UIConstant.contentOffset()));
    }

    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            ...initialPasswordState,
            promptVisible: false,
            marginTop: null,
            scrollViewHeight: null,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterPrompt) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterPrompt) {
            masterRef = null;
        }
    }

    // Events
    onDismissed() {
        this.setPromptVisible(false);
    }

    onPressCancel() {
        this.hidePromptOnCancel();
    }

    onPressDone() {
        if (this.isDataValid()) {
            const password = this.getPassword();
            this.hidePromptOnDone(password);
        }
    }

    onPressNext() {
        if (this.getPassword()) {
            this.confirmPasswordInput.focus();
        }
    }

    onFocusPasswordToConfirmInput() {
        if (!this.getPassword()) {
            this.passwordInput.focus();
        }
    }

    onChangePassword(newText) {
        this.setPassword(newText);
    }

    onChangePasswordToConfirm(newText) {
        this.setPasswordToConfirm(newText);
    }

    onKeyboardWillShow(e) {
        if (!this.isPromptVisible()) {
            return;
        }
        const keyboardHeight = e.endCoordinates ? e.endCoordinates.height : e.end.height;
        const windowHeight = Dimensions.get('window').height;
        const offset = keyboardHeight + statusBarHeight + UIConstant.mediumContentOffset();
        const visibleHeight = windowHeight - offset;
        if (visibleHeight < this.contentHeight) {
            const delta = this.contentHeight - visibleHeight;
            const interpolatedHeight = this.state.marginTop.interpolate({
                inputRange: [(-keyboardHeight / 2), 0],
                outputRange: [this.scrollViewHeight - delta, this.scrollViewHeight],
            });
            this.setScrollViewHeight(interpolatedHeight);
        }

        Animated.spring(this.state.marginTop, {
            toValue: (-keyboardHeight / 2),
        }).start();
    }

    onKeyboardWillHide() {
        if (!this.isPromptVisible()) {
            return;
        }
        Animated.spring(this.state.marginTop, {
            toValue: 0,
        }).start();
    }

    onLayout(e) {
        const { layout } = e.nativeEvent;
        if (!this.contentHeight) { // only set on render first time
            this.contentHeight = layout.height;
        }
    }

    onScrollViewLayout(e) {
        const { layout } = e.nativeEvent;
        if (!this.scrollViewHeight) { // only set on render first time
            this.scrollViewHeight = layout.height;
        }
    }

    // Setters
    setPromptVisible(promptVisible = true, callback) {
        this.setStateSafely({
            promptVisible,
            ...initialPasswordState,
        }, callback);
    }

    setPassword(password) {
        this.setStateSafely({ password });
    }

    setPasswordToConfirm(passwordToConfirm) {
        this.setStateSafely({ passwordToConfirm });
    }

    setContentInset(contentInset) {
        this.setStateSafely({ contentInset });
    }

    setMarginTop(marginTop) {
        this.setStateSafely({ marginTop });
    }

    setScrollViewHeight(scrollViewHeight) {
        this.setStateSafely({ scrollViewHeight });
    }

    // Getters
    getPassword() {
        return this.state.password;
    }

    getPasswordToConfirm() {
        return this.state.passwordToConfirm;
    }

    getContentInset() {
        return this.state.contentInset;
    }

    getMarginTop() {
        return this.state.marginTop;
    }

    getScrollViewHeight() {
        return this.state.scrollViewHeight;
    }

    isDoneButtonDisabled() {
        return !this.isDataValid();
    }

    isDataValid() {
        return this.getPassword()
            && (
                !this.shouldConfirm
                || this.getPassword() === this.getPasswordToConfirm()
            );
    }

    isPromptVisible() {
        return this.state.promptVisible;
    }

    // Actions
    showPrompt({ title, titleStyle, shouldConfirm }, onDone, onCancel) {
        this.title = title || UILocalized.WeNeedYourPassword;
        this.titleStyle = titleStyle || UIStyle.textSecondarySmallRegular;
        this.shouldConfirm = shouldConfirm || false;
        this.onDoneCallback = onDone;
        this.onCancelCallback = onCancel;
        this.scrollViewHeight = null; // set as null to mark an initial layout
        this.contentHeight = null; // set as null to mark an initial layout
        this.setPromptVisible(true);
        this.setMarginTop(new Animated.Value(0));
        setTimeout(() => { // in order to render
            this.dialog.show();
        }, 0);
    }

    hidePrompt(callback) {
        this.dialog.dismiss();
        setTimeout(() => {
            this.setPromptVisible(false, callback);
        }, 100); // Give it some time for dismiss animation
    }

    cleanCallbacks() {
        this.onDoneCallback = null;
        this.onCancelCallback = null;
    }

    hidePromptOnCancel() {
        this.hidePrompt(() => {
            if (this.onCancelCallback) {
                this.onCancelCallback();
            }
            this.cleanCallbacks();
        });
    }

    hidePromptOnDone(password) {
        this.hidePrompt(() => {
            if (this.onDoneCallback) {
                this.onDoneCallback(password);
            }
            this.cleanCallbacks();
        });
    }

    // Render
    renderPasswordInputs() {
        const renderPasswordView = (options) => {
            const {
                title, value, autoFocus, returnKeyType, refBinder,
                onChangeHandler, onSubmitHandler, onFocusHandler,
            } = options;
            return (
                <View style={styles.passwordContainer}>
                    <Text style={passwordTitleStyle}>
                        {title}
                    </Text>
                    <UITextInput
                        ref={refBinder}
                        value={value}
                        autoFocus={autoFocus}
                        secureTextEntry
                        returnKeyType={returnKeyType}
                        containerStyle={textInputContainer}
                        onFocus={onFocusHandler}
                        onChangeText={onChangeHandler}
                        onSubmitEditing={onSubmitHandler}
                    />
                    <View style={borderContainer} />
                </View>
            );
        };
        const passwordView = renderPasswordView({
            refBinder: (input) => { this.passwordInput = input; },
            title: UILocalized.Password,
            value: this.getPassword(),
            autoFocus: true,
            returnKeyType: this.shouldConfirm ? 'next' : 'done',
            onChangeHandler: newValue => this.onChangePassword(newValue),
            onSubmitHandler: this.shouldConfirm
                ? () => this.onPressNext()
                : () => this.onPressDone(),
        });
        const confirmPasswordView = renderPasswordView({
            refBinder: (input) => { this.confirmPasswordInput = input; },
            title: UILocalized.ConfirmPassword,
            value: this.getPasswordToConfirm(),
            autoFocus: false,
            returnKeyType: 'done',
            onFocusHandler: () => this.onFocusPasswordToConfirmInput(),
            onChangeHandler: newValue => this.onChangePasswordToConfirm(newValue),
            onSubmitHandler: () => this.onPressDone(),
        });
        return (
            <View style={marginTopSmall}>
                {passwordView}
                {this.shouldConfirm ? confirmPasswordView : null}
            </View>
        );
    }

    renderButtonsContainer() {
        return (
            <View style={buttonsContainer}>
                <UITextButton
                    title={UILocalized.Cancel}
                    buttonStyle={styles.textButton}
                    onPress={() => this.onPressCancel()}
                />
                <UITextButton
                    title={UILocalized.Done}
                    disabled={this.isDoneButtonDisabled()}
                    buttonStyle={styles.textButton}
                    onPress={() => this.onPressDone()}
                />
            </View>
        );
    }

    renderContent() {
        return (
            <View
                style={styles.contentView}
                onLayout={e => this.onLayout(e)}
            >
                <Animated.ScrollView
                    onLayout={e => this.onScrollViewLayout(e)}
                    style={[{ height: this.getScrollViewHeight() }, marginTopMedium]}
                >
                    <Text style={[...titleContainer, this.titleStyle]}>
                        {this.title}
                    </Text>
                </Animated.ScrollView>
                {this.renderPasswordInputs()}
                {this.renderButtonsContainer()}
            </View>
        );
    }

    renderContainer() {
        return (
            <View style={[UIStyle.absoluteFillObject, styles.container]}>
                <Animated.View style={{ marginTop: this.getMarginTop() }}>
                    <PopupDialog
                        ref={(popupDialog) => { this.dialog = popupDialog; }}
                        key="PasswordPrompt"
                        width={UIPasswordPrompt.calcPromptWidth()}
                        height={null}
                        dialogAnimation={scaleAnimation}
                        dismissOnTouchOutside={false}
                        onDismissed={() => this.onDismissed()}
                        overlayBackgroundColor="transparent"
                    >
                        {this.renderContent()}
                    </PopupDialog>
                </Animated.View>
            </View>
        );
    }

    render() {
        if (!this.isPromptVisible()) {
            return null;
        }
        if (Platform.OS === 'web' || !this.props.modal) {
            return this.renderContainer();
        }
        return (
            <Modal
                animationType="fade"
                transparent
                visible={this.isPromptVisible()}
            >
                {this.renderContainer()}
            </Modal>
        );
    }
}

UIPasswordPrompt.defaultProps = {
    masterPrompt: true,
    modal: false,
};

UIPasswordPrompt.propTypes = {
    masterPrompt: PropTypes.bool,
    modal: PropTypes.bool,
};
