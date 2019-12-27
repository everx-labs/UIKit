/* eslint-disable class-methods-use-this */
// @flow
import React from 'react';
import {
    View,
    Platform,
    Keyboard,
    SafeAreaView,
    LayoutAnimation,
    Easing,
    PixelRatio,
} from 'react-native';

import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { KeyboardEvent } from 'react-native/Libraries/Components/Keyboard/Keyboard';
import type { ReactNavigation } from '../../components/navigation/UINavigationBar';

import UIConstant from '../../helpers/UIConstant';
import UIDevice from '../../helpers/UIDevice';
import UIEventHelper from '../../helpers/UIEventHelper';
import UIFunction from '../../helpers/UIFunction';
import UILocalized from '../../helpers/UILocalized/';
import UIStyle from '../../helpers/UIStyle';

import UIAlertView from '../../components/popup/UIAlertView';
import UIComponent from '../../components/UIComponent';
import UISpinnerOverlay from '../../components/UISpinnerOverlay';

import type { SafeAreaInsets } from '../../helpers/UIDevice';

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

export type ContentInset = {
    left: number,
    right: number,
    top: number,
    bottom: number,
};

export type AnimationParameters = {
    duration: number,
    easing: string,
};

export type ControllerProps = {
    navigation: ReactNavigation,
};

export type ControllerState = {
    contentInset?: ContentInset,
    safeArea?: ContentInset,
    showIndicator?: boolean,
    spinnerTextContent?: string,
    spinnerTitleContent?: string,
    spinnerVisible?: boolean,
    keyboardVisible?: boolean,
    runningAsyncOperation?: string,
};

const EmptyInset: ContentInset = Object.freeze({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
});

const keyboardPanningScreens = [];

export default class UIController<Props, State>
    extends UIComponent<Props & ControllerProps, State & ControllerState> {
    static onGetAndroidDisplayCutout = (): * => {
        return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        };
    };
    static AndroidKeyboardAdjust = {
        Pan: 'pan',
        Resize: 'resize',
    };

    static addKeyboardPanningScreen(screen: UIController<Props, State>) {
        const index = keyboardPanningScreens.indexOf(screen);
        if (index < 0) {
            keyboardPanningScreens.push(screen);
        }
    }

    static removeKeyboardPanningScreen(screen: UIController<Props, State>) {
        const index = keyboardPanningScreens.indexOf(screen);
        if (index >= 0) {
            keyboardPanningScreens.splice(index, 1);
        }
    }

    static isKeyboardPanning() {
        return keyboardPanningScreens.length > 0;
    }

    static showAlertWithTitleAndMessage(title: string, message: string, callback?: () => void) {
        UIAlertView.showAlert(title, message, [{
            title: UILocalized.OK,
            onPress: () => {
                if (callback) {
                    callback();
                }
            },
        }]);
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

    static getEasingFunction(easing: string): (t: number) => number {
        switch (easing) {
        case LayoutAnimation.Types.spring:
            return Easing.elastic();
        case LayoutAnimation.Types.linear:
            return Easing.linear;
        case LayoutAnimation.Types.easeIn:
            return Easing.in(Easing.ease);
        case LayoutAnimation.Types.easeOut:
            return Easing.out(Easing.ease);
        case LayoutAnimation.Types.easeInEaseOut:
            return Easing.inOut(Easing.ease);
        case LayoutAnimation.Types.keyboard:
            // There is no information about real easing function for keyboard animation.
            // But people on Internet try to find closely easing functions.
            return Easing.bezier(0.17, 0.59, 0.4, 0.77);
            // return Easing.bezier(0.19, 0.35, 0.0625, 0.5);
        default:
            return Easing.out(Easing.ease);
        }
    }

    static getKeyboardAnimation(event: ?KeyboardEvent): ?AnimationParameters {
        if (!event) {
            return null;
        }
        const {
            duration,
            easing,
        } = event;
        return (duration && easing)
            ? {
                duration,
                easing,
            }
            : null;
    }

    // constructor
    hasSpinnerOverlay: boolean;

    constructor(props: Props & ControllerProps) {
        super(props);

        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Resize;
        this.hasSpinnerOverlay = false;

        this.handlePathAndParams();
        this.listenToNavigation();
    }

    componentDidMount() {
        super.componentDidMount();
        this.initKeyboardListeners();
        this.loadSafeAreaInsets();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.deinitKeyboardListeners();
        this.stopListeningToNavigation();
    }

    componentWillFocus() {
        this.pushStateIfNeeded();
    }

    componentWillBlur() {
        //
    }

    async loadSafeAreaInsets(): Promise<SafeAreaInsets> {
        const safeArea = await UIDevice.safeAreaInsets();
        this.setStateSafely({ safeArea });
        return safeArea;
    }

    // Virtual
    renderOverlay(): React$Node {
        return null;
    }

    renderSafely() {
        return null;
    }

    // Events
    getBottomInsetAdjustment() {
        let adjustment;
        if (Platform.OS === 'android') {
            adjustment = UIController.onGetAndroidDisplayCutout().top / PixelRatio.get();
        } else if (Platform.OS === 'ios') {
            adjustment = -this.getSafeAreaInsets().bottom;
        }
        return adjustment;
    }

    adjustBottomInset(
        container: NativeMethodsMixinType,
        keyboardFrame: $ReadOnly<{ screenY: number, height: number }>,
        animation: ?AnimationParameters,
        readjustTimeout: number,
    ) {
        container.measure((relX, relY, w, h, x, y) => {
            // So, there was some logic:
            // const keyboardOverlapHeight = Math.max(y + h - keyboardFrame.screenY, keyboardFrame.height);
            // I actually don't understand why we need Math.max with keyboard height here,
            // but I definetely sure that current realization should work
            // for popups with bottom y less then screen y.
            // That way we get a current view bottom y coordinate,
            // then subtructing it with keyboard top y we get a space overlapped by keyboard.
            const keyboardOverlapHeight = Math.max(y + h - keyboardFrame.screenY, 0);
            const bottomInset = keyboardOverlapHeight + this.getBottomInsetAdjustment();
            this.setBottomInset(Math.max(0, bottomInset), animation);
            if (Platform.OS === 'android' && (readjustTimeout > 0)) {
                setTimeout(() => {
                    this.adjustBottomInset(container, keyboardFrame, animation, 0);
                }, readjustTimeout);
            }
        });
    }

    onKeyboardWillShow(event: KeyboardEvent) {
        this.setStateSafely({ keyboardVisible: true });
        const keyboardFrame = event.endCoordinates;
        const animation = UIController.getKeyboardAnimation(event);
        const { container } = this;
        if (!!container && !!container.measure) {
            this.adjustBottomInset(
                container,
                keyboardFrame,
                animation,
                UIConstant.animationDuration(),
            );
        } else {
            this.setBottomInset(
                keyboardFrame.height + this.getBottomInsetAdjustment(),
                animation,
            );
        }
    }

    onKeyboardWillHide(event: KeyboardEvent) {
        this.setStateSafely({ keyboardVisible: false });
        this.setContentInset(EmptyInset, UIController.getKeyboardAnimation(event));
    }

    // Setters
    setBottomInset(bottom: number, animation: ?AnimationParameters) {
        this.setContentInset({
            top: 0,
            left: 0,
            bottom,
            right: 0,
        }, animation);
    }

    setContentInset(contentInset: ContentInset, animation: ?AnimationParameters) {
        this.setStateSafely({ contentInset });
    }

    setSpinnerTitleContent(spinnerTitleContent: string) {
        this.setStateSafely({ spinnerTitleContent });
    }

    setSpinnerTextContent(spinnerTextContent: string) {
        this.setStateSafely({ spinnerTextContent });
    }

    // Getters
    getSafeAreaInsets(): ContentInset {
        return this.state.safeArea || EmptyInset;
    }

    getContentInset(): ContentInset {
        return this.state.contentInset || EmptyInset;
    }

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

    shouldShowIndicator(): ?boolean {
        return this.state.showIndicator;
    }

    doesPathExist(): boolean {
        return this.path !== undefined && this.path !== null;
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
            console.log(
                `[UIController] Succeeded to handle a path "/${this.path}" for class:`,
                this.constructor.name,
            );
        } else {
            console.log('[UIController] Failed to handle a path for class:', this.constructor.name);
        }
    }

    addParametersToPath(parameters: Params) {
        if (!this.doesPathExist()) {
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

    navigationListeners: { remove(): void }[];
    listenToNavigation() {
        if (!this.props.navigation) {
            return;
        }
        this.navigationListeners = [
            this.props.navigation.addListener('willFocus', (payload) => {
                console.log(
                    `[UIController] Controller ${this.constructor.name} will focus with payload:`,
                    payload,
                );
                this.componentWillFocus();
            }),
            this.props.navigation.addListener('willBlur', (payload) => {
                console.log(
                    `[UIController] Controller ${this.constructor.name} will blur with payload:`,
                    payload,
                );
                this.componentWillBlur();
            }),
        ];
    }

    stopListeningToNavigation() {
        if (this.navigationListeners) {
            this.navigationListeners.forEach(listener => listener.remove());
        }
    }

    pushStateIfNeeded() {
        if (!this.mounted || Platform.OS !== 'web') {
            return;
        }
        if (this.doesPathExist()) {
            UIEventHelper.pushHistory(this.path);
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
                // Add this screen as keyboard panning
                UIController.addKeyboardPanningScreen(this);
                // Adjust keyboard mode
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
                // Make it resizable only if not panning!
                if (!UIController.isKeyboardPanning()) {
                    AndroidKeyboardAdjust.setAdjustResize();
                }
            }
        }
    }

    deinitKeyboardListeners() {
        if (Platform.OS === 'android') {
            // Remove this screen from keyboard panning if it is
            UIController.removeKeyboardPanningScreen(this);
            // Make it resizable only if not panning!
            if (!UIController.isKeyboardPanning()) {
                AndroidKeyboardAdjust.setAdjustResize();
            }
        }
        // Remove keyboard listeners
        if (this.keyboardWillShowListener) {
            this.keyboardWillShowListener.remove();
        }
        if (this.keyboardWillHideListener) {
            this.keyboardWillHideListener.remove();
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

    // Async Operations
    getRunningAsyncOperation(): string {
        return this.state.runningAsyncOperation || '';
    }

    guardedAsyncRun(operation: () => Promise<void>, name?: string) {
        (async () => {
            try {
                if (this.getRunningAsyncOperation() !== '') {
                    return;
                }
                const runningOperation = { runningAsyncOperation: name || 'operation' };
                await UIFunction.makeAsync(this.setStateSafely.bind(this))(runningOperation);
                try {
                    await operation();
                } finally {
                    const emptyOperation = { runningAsyncOperation: '' };
                    await UIFunction.makeAsync(this.setStateSafely.bind(this))(emptyOperation);
                }
            } catch (error) {
                console.log(
                    `Async operation [${name || ''}] failed: `,
                    error.message || error,
                );
            }
        })();
    }

    guardedAsyncNavigation(operation: () => void, name?: string): void {
        this.guardedAsyncRun(async () => {
            operation();
            await new Promise((resolve) => {
                setTimeout(() => resolve(), 1000);
            });
        }, name || 'navigation');
    }

    // Render
    renderSpinnerOverlay() {
        return (<UISpinnerOverlay
            key="SpinnerOverlay"
            visible={this.state?.spinnerVisible}
            titleContent={this.state?.spinnerTitleContent || ''}
            textContent={this.state?.spinnerTextContent || ''}
        />);
    }

    render(): React$Node {
        // We must set the 'collapsible' to 'false'
        // for the containers 'measure' works well on Android.
        const main = (
            <SafeAreaView
                style={[
                    UIStyle.container.screen(),
                    UIStyle.common.backgroundPrimaryColor(),
                ]}
            >
                <View
                    style={UIStyle.common.flex()}
                    collapsable={false}
                    ref={this.onSetContainer}
                >
                    {this.renderSafely()}
                </View>
            </SafeAreaView>
        );
        const overlays = [].concat(
            this.renderOverlay() || [],
            this.hasSpinnerOverlay ? this.renderSpinnerOverlay() : [],
        );
        if (overlays.length === 0) {
            return main;
        }
        return (
            <View style={UIStyle.common.flex()}>
                {main}
                {overlays.length > 1 ? <React.Fragment>{overlays}</React.Fragment> : overlays[0]}
            </View>
        );
    }

    // Internals
    mounted: boolean;
    androidKeyboardAdjust: string;
    keyboardWillShowListener: { remove(): void };
    keyboardWillHideListener: { remove(): void };
    path: string;
    params: Params;
    container: ?(React$Component<*> & NativeMethodsMixinType);

    onSetContainer = (container: ?(React$Component<*> & NativeMethodsMixinType)) => {
        this.container = container;
    };
}
