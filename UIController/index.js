import React, { Component } from 'react';
import { Platform, Keyboard, Alert, SafeAreaView } from 'react-native';

import UIStyle from '../UIStyle';
import UILocalized from '../UILocalized/';
import UISpinnerOverlay from '../UISpinnerOverlay';

const AndroidKeyboardAdjust = Platform.OS === 'android' ? require('react-native-android-keyboard-adjust') : null;

const pathAndParamsForScreens = {};

export default class UIController extends Component {
    static AndroidKeyboardAdjust = {
        Pan: 'pan',
        Resize: 'resize',
    };

    static showAlertWithTitleAndMessage(title, message, callback) {
        if (Platform.OS === 'web') {
            alert(message);
            setTimeout(() => {
                if (callback) {
                    callback();
                }
            }, 100); // need to wait
        } else {
            Alert.alert(
                title,
                message,
                [{
                    text: UILocalized.OK,
                    style: 'cancel',
                    onPress: () => {
                        if (callback) {
                            callback();
                        }
                    },
                }],
                { cancelable: false },
            );
        }
    }

    static showErrorWithMessage(message, callback) {
        this.showAlertWithTitleAndMessage(UILocalized.Error, message, callback);
    }

    static showSuccessWithMessage(message, callback) {
        this.showAlertWithTitleAndMessage(UILocalized.Success, message, callback);
    }

    static showCannotDoActionError(action, error) {
        setTimeout(() => {
            UIController.showErrorWithMessage(`${UILocalized.formatString(UILocalized.SorryWeCannotDoActionAtTheMoment, action)}\n\n${JSON.stringify(error)}`);
        }, 500);
    }

    static setPathAndParamsForScreen(pathAndParams, screen) {
        pathAndParamsForScreens[screen] = pathAndParams;
    }

    static getParametersFromString(string) {
        const index = string.indexOf('?');
        const parametersString = index >= 0 ? string.substring(index + 1) : '';
        if (parametersString.length > 0) { // has parameters
            return parametersString.split('&').reduce((object, keyValue) => {
                const [key, value] = keyValue.split('=');
                const newObject = object;
                newObject[key] = value;
                return newObject;
            }, {});
        }
        return null;
    }

    // constructor
    constructor(props) {
        super(props);

        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Resize;

        this.handlePathAndParams();
        this.listenToNavigation();
    }

    componentDidMount() {
        this.mounted = true;
        this.initKeyboardListeners();
    }

    componentWillReceiveProps() {
        // TODO: remove and use getDerivedStateFromProps
    }

    componentWillUnmount() {
        this.mounted = false;
        this.deinitKeyboardListeners();
    }

    componentWillFocus() {
        this.pushStateIfNeeded();
    }

    // Events
    onKeyboardWillShow(e) {
        const keyboardHeight = e.endCoordinates ? e.endCoordinates.height : e.end.height;
        this.setContentInset({
            top: 0,
            left: 0,
            bottom: keyboardHeight,
            right: 0,
        });
    }

    onKeyboardWillHide() {
        this.setContentInset({
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        });
    }

    // Setters
    setContentInset(contentInset) {
        this.setStateSafely({ contentInset });
    }

    setSpinnerTitleContent(spinnerTitleContent) {
        this.setStateSafely({ spinnerTitleContent });
    }

    setSpinnerTextContent(spinnerTextContent) {
        this.setStateSafely({ spinnerTextContent });
    }

    setStateSafely(state, callback) {
        if (!this.mounted) {
            return;
        }
        this.setState(state, callback);
    }

    // Getters
    getNavigationState() {
        const { navigation } = this.props;
        if (navigation) {
            return navigation.state || {};
        }
        return {};
    }

    getNavigationParams() {
        const state = this.getNavigationState();
        if (state) {
            return state.params || {};
        }
        return {};
    }

    getContentInset() {
        return this.state.contentInset;
    }

    shouldShowIndicator() {
        return this.state.showIndicator;
    }

    // Navigation
    handlePathAndParams() {
        const { routeName } = this.getNavigationState();
        const pathAndParams = pathAndParamsForScreens[routeName];
        if (pathAndParams) {
            this.path = pathAndParams.path;
            this.params = pathAndParams.params;
            // Add current parameters to the path if needed
            if (this.params) {
                const params = this.getNavigationParams();
                const parameters = {};
                Object.keys(params).forEach((key) => {
                    if (this.params[key]) {
                        parameters[key] = params[key];
                    }
                });
                this.addParametersToPath(parameters);
            }
            console.log(`[UIController] Succeeded to handle a path "/${this.path}" for class:`, this.constructor.name);
        } else {
            console.log('[UIController] Failed to handle a path for class:', this.constructor.name);
        }
    }

    addParametersToPath(parameters) {
        if (!this.path) {
            console.warn(`[UIController] URL Path is not set for ${this.constructor.name}`);
            return;
        }
        const pathParameters = UIController.getParametersFromString(this.path);
        Object.keys(parameters).forEach((key) => {
            if (!pathParameters || !pathParameters[key]) {
                const symbol = this.path.includes('?') ? '&' : '?';
                this.path += `${symbol}${key}=${parameters[key]}`;
            }
        });
    }

    listenToNavigation() {
        if (!this.props.navigation) {
            return;
        }
        this.props.navigation.addListener('willFocus', (payload) => {
            console.log(`[UIController] Controller ${this.constructor.name} will focus with payload:`, payload);
            this.componentWillFocus();
        });
    }

    pushStateIfNeeded() {
        if (!this.mounted || Platform.OS !== 'web') {
            return;
        }
        if (this.path) {
            window.history.pushState(null, '', this.path);
        } else {
            console.warn(`[UIController] URL Path is not set for ${this.constructor.name}`);
        }
    }

    // Keyboard
    initKeyboardListeners() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowListener = Keyboard.addListener(
                'keyboardWillShow',
                e => this.onKeyboardWillShow(e),
            );
            this.keyboardWillHideListener = Keyboard.addListener(
                'keyboardWillHide',
                e => this.onKeyboardWillHide(e),
            );
        } else if (Platform.OS === 'android') {
            if (this.androidKeyboardAdjust === UIController.AndroidKeyboardAdjust.Pan) {
                AndroidKeyboardAdjust.setAdjustPan();
                // Android only responds to `Did` events
                this.keyboardWillShowListener = Keyboard.addListener(
                    'keyboardDidShow',
                    e => this.onKeyboardWillShow(e),
                );
                this.keyboardWillHideListener = Keyboard.addListener(
                    'keyboardDidHide',
                    e => this.onKeyboardWillHide(e),
                );
            } else if (this.androidKeyboardAdjust === UIController.AndroidKeyboardAdjust.Resize) {
                AndroidKeyboardAdjust.setAdjustResize();
            }
        }
    }

    deinitKeyboardListeners() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowListener.remove();
            this.keyboardWillHideListener.remove();
        } else if (Platform.OS === 'android') {
            if (this.androidKeyboardAdjust === UIController.AndroidKeyboardAdjust.Pan) {
                this.keyboardWillShowListener.remove();
                this.keyboardWillHideListener.remove();
            }
        }
    }

    // Actions
    showSpinnerOverlay(show = true) {
        this.setStateSafely({ spinnerVisible: show });
    }

    hideSpinnerOverlay() {
        if (!this.mounted) {
            return;
        }
        this.showSpinnerOverlay(false);
        this.setSpinnerTitleContent('');
        this.setSpinnerTextContent('');
    }

    showIndicator(showIndicator = true) {
        this.setStateSafely({ showIndicator });
    }

    hideIndicator() {
        this.showIndicator(false);
    }

    // Render
    renderSpinnerOverlay() {
        return (<UISpinnerOverlay
            key="SpinnerOverlay"
            visible={this.state.spinnerVisible}
            titleContent={this.state.spinnerTitleContent}
            textContent={this.state.spinnerTextContent}
        />);
    }

    render() {
        return (
            <SafeAreaView style={UIStyle.screenBackground}>
                {this.renderSafely()}
            </SafeAreaView>
        );
    }
}

UIController.defaultProps = {
    //
};

UIController.propTypes = {
    //
};
