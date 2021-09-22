/* eslint-disable function-paren-newline */
/* eslint-disable arrow-parens */
/* eslint-disable class-methods-use-this */
// @flow
import React from 'react';
import {
    View,
    Platform,
    Keyboard,
    LayoutAnimation,
    Easing,
    PixelRatio,
    StatusBar,
} from 'react-native';
import type { KeyboardEvent } from 'react-native/Libraries/Components/Keyboard/Keyboard';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { UIConstant, UIDevice, UIEventHelper, UIFunction, UIStyle } from '@tonlabs/uikit.core';
import type { SafeAreaInsets } from '@tonlabs/uikit.core';
import { UIAlertView, UIComponent, UISpinnerOverlay } from '@tonlabs/uikit.components';
import { UISafeAreaView } from '@tonlabs/uikit.layout';
import { UIBackgroundViewColors } from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';
import { UILargeTitleContainerRefContext } from '@tonlabs/uikit.navigation';

const AndroidKeyboardAdjust =
    Platform.OS === 'android'
        ? require('react-native-android-keyboard-adjust')
        : {
              setAdjustPan() {},
              setAdjustResize() {},
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
    navigation: any, // TODO: use a type from react-navigation
};

export type ControllerState = {
    contentInset?: ContentInset,
    safeArea?: ContentInset,
    showIndicator?: boolean,
    spinnerTextContent?: string,
    spinnerTitleContent?: string,
    spinnerVisible?: boolean,
    runningAsyncOperation?: string,
};

const EmptyInset: ContentInset = Object.freeze({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
});

const keyboardPanningScreens = [];

const configuration = {
    navigationVersion: 2,
};

export default class UIController<Props, State> extends UIComponent<
    Props & ControllerProps,
    State & ControllerState,
> {
    static configureNavigationVersion(version: number) {
        configuration.navigationVersion = version;
    }

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
        UIAlertView.showAlert(title, message, [
            {
                title: uiLocalized.OK,
                onPress: () => {
                    if (callback) {
                        callback();
                    }
                },
            },
        ]);
    }

    static showErrorWithMessage(message: string, callback?: () => void) {
        this.showAlertWithTitleAndMessage(uiLocalized.Error, message, callback);
    }

    static showSuccessWithMessage(message: string, callback?: () => void) {
        this.showAlertWithTitleAndMessage(uiLocalized.Success, message, callback);
    }

    static showCannotDoActionError(action: string, error: any) {
        setTimeout(() => {
            const message = uiLocalized.formatString(
                uiLocalized.SorryWeCannotDoActionAtTheMoment,
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
        if (parametersString.length > 0) {
            // has parameters
            return parametersString.split('&').reduce((object, keyValue) => {
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

    static contextType: typeof SafeAreaInsetsContext = SafeAreaInsetsContext;

    // constructor
    hasSpinnerOverlay: boolean;
    trackKeyboard: boolean;

    // Guard for react-navigation v5 first mount focus event
    isFocused = false;

    constructor(props: Props & ControllerProps) {
        super(props);

        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Resize;
        this.hasSpinnerOverlay = false;
        this.trackKeyboard = false;

        if (configuration.navigationVersion < 5) {
            this.handlePathAndParams();
        }

        this.listenToNavigation();

        // $FlowFixMe
        this.state = {};
    }

    componentDidMount() {
        super.componentDidMount();
        this.initSequence();

        if (
            configuration.navigationVersion >= 5 &&
            this.props.navigation &&
            this.props.navigation.isFocused()
        ) {
            this.isFocused = true;
            this.componentWillFocus();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.deinitKeyboardListeners();
        this.stopListeningToNavigation();

        if (configuration.navigationVersion >= 5 && this.isFocused) {
            this.componentWillBlur();
        }
    }

    componentWillFocus() {
        this.isFocused = true;
        if (configuration.navigationVersion < 5) {
            this.pushStateIfNeeded();
        }
    }

    componentWillBlur() {
        this.isFocused = false;
    }

    initSequence() {
        this.initKeyboardListeners();
        this.loadSafeAreaInsets();
    }

    async loadSafeAreaInsets(): Promise<SafeAreaInsets> {
        const safeArea = this.context;
        this.setStateSafely({ safeArea });
        return safeArea;
    }

    // Virtual
    renderOverlay(): React$Node {
        return null;
    }

    renderSafely(): React$Node {
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

    isKeyboardShown = {
        value: false,
        // calculation of inset for keyboard opening happen
        // in multiple async calls, and somewhen between them
        // user could close a keyboard (unlikely to happen, but still)
        // so, it's better to check that keyboard is still open during measurement
        maybeCall(fn: (...args: any[]) => any): () => any {
            return (...args) => {
                if (this.value) {
                    return fn(...args);
                }
                return null;
            };
        },
    };

    adjustBottomInset(
        keyboardFrame: $ReadOnly<{ screenY: number, height: number }>,
        animation: ?AnimationParameters,
    ) {
        // (savelichalex):
        // Our modal controller animate Y coordinate, that's why measure is sooo tricky here
        // I tried to call measure with timeout, but it's turned out
        // that opening animation time could be different, and by the end of
        // timeout we just could get wrong coordinates.
        // That's why I decided to measure it in recursive cycle
        // and compare with previous coordinate, that guarantee
        // that we get correct Y point, without knowledge of current animation time.
        const measureAndApply = prevY => {
            setTimeout(
                this.isKeyboardShown.maybeCall(() => {
                    if (this.containerRef.current != null) {
                        this.containerRef.current.measureInWindow(
                            this.isKeyboardShown.maybeCall((x, y, width, height) => {
                                if (y !== prevY) {
                                    measureAndApply(y);
                                    return;
                                }
                                const pageY = Platform.select({
                                    ios: y,
                                    android: y + StatusBar.currentHeight,
                                });
                                const containerBottomY = pageY + height;
                                const keyboardOverlapHeight = Math.max(
                                    containerBottomY - keyboardFrame.screenY,
                                    0,
                                );
                                this.setBottomInset(keyboardOverlapHeight, animation);
                            }),
                        );
                    }
                }),
                50,
            );
        };
        measureAndApply();
    }

    onKeyboardWillShow(event: KeyboardEvent) {
        if (event == null) {
            return;
        }

        const keyboardFrame = event.endCoordinates;
        const keyboardAnimationDuration =
            (event && event.duration) || UIConstant.animationKeyboardOpening();
        const keyboardAnimationEasing = (event && event.easing) || LayoutAnimation.Types.keyboard;
        const keyboardAnimation = {
            duration: keyboardAnimationDuration,
            easing: keyboardAnimationEasing,
        };

        this.isKeyboardShown.value = true;
        this.adjustBottomInset(keyboardFrame, keyboardAnimation);
    }

    onKeyboardWillHide(event: KeyboardEvent) {
        const keyboardAnimationDuration =
            (event && event.duration) || UIConstant.animationKeyboardClosing();
        const keyboardAnimationEasing = (event && event.easing) || LayoutAnimation.Types.keyboard;
        const keyboardAnimation = {
            duration: keyboardAnimationDuration,
            easing: keyboardAnimationEasing,
        };

        this.isKeyboardShown.value = false;
        this.setContentInset(EmptyInset, keyboardAnimation);
    }

    // Setters
    setBottomInset(bottom: number, animation: ?AnimationParameters) {
        this.setContentInset(
            {
                top: 0,
                left: 0,
                bottom,
                right: 0,
            },
            animation,
        );
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
        if (configuration.navigationVersion >= 5) {
            // $FlowFixMe
            return this.props.route?.state || {};
        }

        const { navigation } = this.props;
        if (navigation) {
            return navigation.state || {};
        }
        return {};
    }

    getNavigationParams() {
        if (configuration.navigationVersion >= 5) {
            // $FlowFixMe
            return this.props.route?.params || {};
        }
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
    handlePathAndParams(paramsArg?: any) {
        const { routeName } = this.getNavigationState();
        const pathAndParams = pathAndParamsForScreens[routeName];
        if (pathAndParams) {
            this.path = pathAndParams.path;
            this.params = pathAndParams.params;
            // Add current parameters to the path if needed
            if (this.params) {
                const params = paramsArg || this.getNavigationParams();
                const parameters = {};
                Object.keys(params).forEach(key => {
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
        Object.keys(parameters).forEach(key => {
            if (!pathParameters || !pathParameters[key]) {
                const symbol = this.path.includes('?') ? '&' : '?';
                this.path += `${symbol}${key}=${parameters[key]}`;
            }
        });
    }

    pushParams(paramsArg: any) {
        this.handlePathAndParams(paramsArg);
        this.pushStateIfNeeded();
    }

    navigationListeners: { remove(): void }[];
    listenToNavigation() {
        if (!this.props.navigation) {
            return;
        }
        try {
            this.navigationListeners = [
                this.props.navigation.addListener('focus', payload => {
                    console.log(
                        `[UIController] Controller ${this.constructor.name} will focus with payload:`,
                        payload,
                    );
                    if (this.isFocused) {
                        return;
                    }
                    this.componentWillFocus();
                }),
                this.props.navigation.addListener('blur', payload => {
                    console.log(
                        `[UIController] Controller ${this.constructor.name} will blur with payload:`,
                        payload,
                    );
                    if (!this.isFocused) {
                        return;
                    }
                    this.componentWillBlur();
                }),
            ];
        } catch (error) {
            // Fallback to react-navigation v2
            this.navigationListeners = [
                this.props.navigation.addListener('willFocus', payload => {
                    console.log(
                        `[UIController] Controller ${this.constructor.name} will focus with payload:`,
                        payload,
                    );
                    this.componentWillFocus();
                }),
                this.props.navigation.addListener('willBlur', payload => {
                    console.log(
                        `[UIController] Controller ${this.constructor.name} will blur with payload:`,
                        payload,
                    );
                    this.componentWillBlur();
                }),
            ];
        }
    }

    stopListeningToNavigation() {
        if (this.navigationListeners) {
            this.navigationListeners.forEach(unsubscribe => {
                if ('remove' in unsubscribe) {
                    unsubscribe.remove();
                } else {
                    // $FlowExpectedError
                    unsubscribe();
                }
            });
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
        if (!this.trackKeyboard) {
            return;
        }
        this.deinitKeyboardListeners();
        if (Platform.OS === 'ios') {
            this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', e =>
                this.onKeyboardWillShow(e),
            );
            this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', e =>
                this.onKeyboardWillHide(e),
            );
        } else if (Platform.OS === 'android') {
            if (this.androidKeyboardAdjust === UIController.AndroidKeyboardAdjust.Pan) {
                // Add this screen as keyboard panning
                UIController.addKeyboardPanningScreen(this);
                // Adjust keyboard mode
                AndroidKeyboardAdjust.setAdjustPan();
                // Android only responds to `Did` events
                this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', e =>
                    this.onKeyboardWillShow(e),
                );
                this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', e =>
                    this.onKeyboardWillHide(e),
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
        if (!this.trackKeyboard) {
            return;
        }
        if (Platform.OS === 'android') {
            // Remove this screen from keyboard panning if it is
            UIController.removeKeyboardPanningScreen(this);
            // Make it resizable only if not panning!
            if (!UIController.isKeyboardPanning()) {
                // We need timeout here, because in some cases, like in modals,
                // component could be unmounted before keyboard would have gone,
                // that cause the whole screen to be resized (exactly how adjustResize works),
                // but with delay it will be applied after keyboard will gone.
                setTimeout(
                    () => AndroidKeyboardAdjust.setAdjustResize(),
                    UIConstant.animationSmallDuration(),
                );
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
                console.log(`Async operation [${name || ''}] failed: `, error.message || error);
            }
        })();
    }

    guardedAsyncNavigation(operation: () => void, name?: string): void {
        this.guardedAsyncRun(async () => {
            operation();
            await new Promise(resolve => {
                setTimeout(() => resolve(), 1000);
            });
        }, name || 'navigation');
    }

    // Render
    renderSpinnerOverlay() {
        return (
            <UISpinnerOverlay
                key="SpinnerOverlay"
                visible={this.state?.spinnerVisible}
                titleContent={this.state?.spinnerTitleContent || ''}
                textContent={this.state?.spinnerTextContent || ''}
            />
        );
    }

    render(): React$Node {
        const contentInSafeArea = this.renderSafely();

        const main = (
            <UISafeAreaView
                color={UIBackgroundViewColors.BackgroundPrimary}
                style={UIStyle.container.screen()}
            >
                <UILargeTitleContainerRefContext.Consumer>
                    {ref => {
                        if (ref != null) {
                            this.containerRef = ref;
                        }

                        return (
                            <View
                                style={UIStyle.common.flex()}
                                // We must set the 'collapsible' to 'false'
                                // for the containers 'measure' works well on Android.
                                collapsable={false}
                                ref={ref == null ? this.containerRef : null}
                            >
                                {contentInSafeArea}
                            </View>
                        );
                    }}
                </UILargeTitleContainerRefContext.Consumer>
            </UISafeAreaView>
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

    // $FlowExpectedError: flow don't see a type for View for some reason
    containerRef = React.createRef<View>();
}
