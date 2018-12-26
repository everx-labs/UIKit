// @flow
import React, { Component } from 'react';
import { Platform, Keyboard, Alert, SafeAreaView } from 'react-native';
import type { ReactNavigation } from '../../components/UINavigationBar';

import UIStyle from '../UIStyle';
import UILocalized from '../UILocalized/';
import UISpinnerOverlay from '../../components/UISpinnerOverlay';

const AndroidKeyboardAdjust = Platform.OS === 'android'
    ? require('react-native-android-keyboard-adjust')
    : {
        setAdjustPan() {
        },
        setAdjustResize() {
        },
    };

type Params = {
    [string]: string,
};

type PathAndParams = {
    path: string,
    params: Params,
};

const pathAndParamsForScreens: {
    [string]: PathAndParams,
} = {};

type ContentInset = {
    left: number,
    right: number,
    top: number,
    bottom: number,
};

export type ControllerProps = {
    navigation: ReactNavigation,
};

export type ControllerState = {
    contentInset?: ContentInset,
    showIndicator?: boolean,
    spinnerTextContent?: string,
    spinnerTitleContent?: string,
    spinnerVisible?: boolean,
};

export default class UIController<Props, State>
    extends Component<Props & ControllerProps, State & ControllerState> {
    static AndroidKeyboardAdjust = {
        Pan: 'pan',
        Resize: 'resize',
    };

    static showAlertWithTitleAndMessage(title: string, message: string, callback?: () => void) {
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

    static showErrorWithMessage(message: string, callback?: () => void) {
        this.showAlertWithTitleAndMessage(UILocalized.Error, message, callback);
    }

    static showSuccessWithMessage(message: string, callback?: () => void) {
        this.showAlertWithTitleAndMessage(UILocalized.Success, message, callback);
    }

    static showCannotDoActionError(action: string, error: any) {
        setTimeout(() => {
            const message = UILocalized.formatString(
                UILocalized.SorryWeCannotDoActionAtTheMoment,
                action,
            );
            const errorText = JSON.stringify(error);
            UIController.showErrorWithMessage(`${message}\n\n${errorText}`);
        }, 500);
    }

    static setPathAndParamsForScreen(pathAndParams: PathAndParams, screen: string) {
        pathAndParamsForScreens[screen] = pathAndParams;
    }

    static getParametersFromString(string: string): ?Params {
        const index = string.indexOf('?');
        const parametersString = index >= 0 ? string.substring(index + 1) : '';
        if (parametersString.length > 0) { // has parameters
            return parametersString
                .split('&')
                .reduce((object, keyValue) => {
                    const [key, value] = keyValue.split('=');
                    const newObject = object;
                    newObject[key] = value;
                    return newObject;
                }, {});
        }
        return null;
    }

    // constructor
    constructor(props: Props & ControllerProps) {
        super(props);

        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Resize;

        this.handlePathAndParams();
        this.listenToNavigation();
    }

    componentDidMount() {
        this.mounted = true;
        this.initKeyboardListeners();
    }

    componentWillReceiveProps(nextProps: Props) {
        // TODO: remove and use getDerivedStateFromProps
    }

    componentWillUnmount() {
        this.mounted = false;
        this.deinitKeyboardListeners();
    }

    componentWillFocus() {
        this.pushStateIfNeeded();
    }

    // Virtual
    // eslint-disable-next-line class-methods-use-this
    renderSafely() {
        return null;
    }

    // Events
    onKeyboardWillShow(e: any) {
        const keyboardHeight = e.endCoordinates ? e.endCoordinates.height : e.end.height;
        this.setContentInset({
            top: 0,
            left: 0,
            bottom: keyboardHeight,
            right: 0,
        });
    }

    onKeyboardWillHide(e: any) {
        this.setContentInset({
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        });
    }

    // Setters
    setContentInset(contentInset: ContentInset) {
        this.setStateSafely({ contentInset });
    }

    setSpinnerTitleContent(spinnerTitleContent: string) {
        this.setStateSafely({ spinnerTitleContent });
    }

    setSpinnerTextContent(spinnerTextContent: string) {
        this.setStateSafely({ spinnerTextContent });
    }

    setStateSafely(
        state:
            $Shape<State & ControllerState>
            | ((State & ControllerState, Props) => $Shape<State & ControllerState> | void),
        callback?: () => mixed,
    ) {
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

    getContentInset(): ?ContentInset {
        return this.state.contentInset;
    }

    shouldShowIndicator(): ?boolean {
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
                Object.keys(params)
                    .forEach((key) => {
                        if (this.params[key]) {
                            parameters[key] = params[key];
                        }
                    });
                this.addParametersToPath(parameters);
            }
            console.log(`[UIController] Succeeded to handle a path "/${this.path}" for class:`,
                this.constructor.name);
        } else {
            console.log('[UIController] Failed to handle a path for class:', this.constructor.name);
        }
    }

    addParametersToPath(parameters: Params) {
        if (!this.path) {
            console.warn(`[UIController] URL Path is not set for ${this.constructor.name}`);
            return;
        }
        const pathParameters = UIController.getParametersFromString(this.path);
        Object.keys(parameters)
            .forEach((key) => {
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
            console.log(`[UIController] Controller ${this.constructor.name} will focus with payload:`,
                payload);
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
    showSpinnerOverlay(show: boolean = true) {
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

    showIndicator(showIndicator: boolean = true) {
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

    render(): ?Component {
        return (
            <SafeAreaView style={UIStyle.screenBackground}>
                {this.renderSafely()}
            </SafeAreaView>
        );
    }

    // Internals
    mounted: boolean;
    androidKeyboardAdjust: string;
    keyboardWillShowListener: { remove(): void };
    keyboardWillHideListener: { remove(): void };
    path: string;
    params: Params;
}

