// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { StyleSheet, Platform, Dimensions, Animated, BackHandler } from 'react-native';
import PopupDialog, { FadeAnimation } from 'react-native-popup-dialog';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';
import type { Style } from 'react-style-proptype/src/Style.flow';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';

import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {
    AnimationParameters,
    ContentInset,
    ControllerProps,
    ControllerState,
} from '../UIController';

import UIController from '../UIController';
import UIDevice from '../../helpers/UIDevice';
import UIFunction from '../../helpers/UIFunction';
import UIStyle from '../../helpers/UIStyle';
import UIColor from '../../helpers/UIColor';
import UIConstant from '../../helpers/UIConstant';
import UIModalNavigationBar from './UIModalNavigationBar';
import SlideAnimation from './utils/SlideAnimation';

import type { SafeAreaInsets } from '../../helpers/UIDevice';

const fullScreenDialogWidth = 600;
const fullScreenDialogHeight = 600;
const HARDWARE_BACK_PRESS_EVENT: string = 'hardwareBackPress';

type OnLayoutEventArgs = {
    nativeEvent: {
        layout: {
            x: number,
            y: number,
            width: number,
            height: number,
        },
    },
};

export type ModalControllerProps = ControllerProps & {
    onWillAppear?: () => void,
    onDidAppear?: () => void,
    onWillHide?: () => void,
    onDidHide?: () => void,
};

export type ModalControllerState = ControllerState & {
    width?: ?number,
    height?: ?number,
    controllerVisible?: boolean,
    header?: React$Node,
};

export type ModalControllerShowArgs =
    | ?boolean
    | {
          open?: boolean,
          onCancel?: () => void,
          onSubmit?: () => void,
          onSelect?: any => void,
      };

const styles = StyleSheet.create({
    dialog: {
        borderRadius: UIConstant.borderRadius(),
        backgroundColor: UIColor.backgroundPrimary(UIColor.Theme.Light),
    },
    dialogOverflow: {
        overflow: 'hidden',
    },
    dialogBorders: {
        borderTopLeftRadius: Platform.OS === 'ios' ? UIConstant.borderRadius() : 0,
        borderTopRightRadius: Platform.OS === 'ios' ? UIConstant.borderRadius() : 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    modalOnWebDialogBorders: {
        borderTopLeftRadius: UIConstant.borderRadius(),
        borderTopRightRadius: UIConstant.borderRadius(),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    smallDismissStripe: {
        width: UIConstant.iconSize(),
        height: UIConstant.tinyBorderRadius(),
        borderRadius: UIConstant.tinyBorderRadius() / 2,
    },
    defaultDismissStripe: {
        width: UIConstant.iconSize() * 2,
        height: UIConstant.tinyBorderRadius(),
        borderRadius: UIConstant.tinyBorderRadius() / 2,
    },
});

export default class UIModalController<Props, State> extends UIController<
    ModalControllerProps & Props,
    ModalControllerState & State,
> {
    fullscreen: boolean;
    dismissible: boolean;
    fromBottom: boolean;
    smallStripe: boolean;
    half: boolean;
    adjustBottomSafeAreaInsetDynamically: boolean;
    adjustKeyboardInsetDynamically: boolean;
    onCancel: ?() => void;
    onSelect: ?(any) => void;
    onSubmit: ?() => void;
    marginBottom: Animated.Value;
    dy: Animated.Value;
    animation: SlideAnimation | FadeAnimation;
    testID: ?string;
    minWidth: number = 0;
    minHeight: number = 0;
    modalOnWeb: boolean;

    static animations = {
        fade: () => new FadeAnimation({ toValue: 1 }),
        slide: () => new SlideAnimation({ slideFrom: 'bottom' }),
    };

    panResponder: PanResponderInstance;
    constructor(props: ModalControllerProps & Props) {
        super(props);
        this.testID = '[UIModalController]';
        this.hasSpinnerOverlay = true;
        this.fullscreen = false;
        this.dismissible = true;
        this.adjustBottomSafeAreaInsetDynamically = true;
        this.adjustKeyboardInsetDynamically = true;
        this.onCancel = null;
        this.onSubmit = null;
        this.onSelect = null;
        this.fromBottom = false;
        this.smallStripe = false;
        this.half = false;
        this.marginBottom = new Animated.Value(0);
        this.dy = new Animated.Value(0);
        this.modalOnWeb = false;
        this.state = {
            ...(this.state: ModalControllerState & State),
        };
    }

    async loadSafeAreaInsets(): Promise<SafeAreaInsets> {
        const safeArea = await super.loadSafeAreaInsets();
        this.marginBottom.setValue(safeArea.bottom);
        return safeArea;
    }

    // Events
    onWillAppear() {
        const { onWillAppear } = this.props;
        if (onWillAppear) {
            onWillAppear();
        }
    }

    onDidAppear() {
        this.initKeyboardListeners();
        BackHandler.addEventListener(HARDWARE_BACK_PRESS_EVENT, this.hardwareBackEventHandler);

        const { onDidAppear } = this.props;
        if (onDidAppear) {
            onDidAppear();
        }
    }

    onWillHide() {
        this.deinitKeyboardListeners();
        BackHandler.removeEventListener(HARDWARE_BACK_PRESS_EVENT, this.hardwareBackEventHandler);

        const { onWillHide } = this.props;
        if (onWillHide) {
            onWillHide();
        }
    }

    onDidHide() {
        this.setControllerVisible(false);

        const { onDidHide } = this.props;
        if (onDidHide) {
            onDidHide();
        }
    }

    onDidAppearHandler = () => {
        this.onDidAppear();
    };

    onDidHideHandler = () => {
        this.onDidHide();
    };

    onCancelPress = () => {
        this.hide();
        if (this.onCancel) {
            this.onCancel();
        }
    };

    hardwareBackEventHandler = (): boolean => {
        this.onCancelPress();
        return true;
    };

    onLayout = (e: OnLayoutEventArgs) => {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        this.setSize(width, height);
    };

    // Getters
    getNavigationBarHeight() {
        return this.shouldSwipeToDismiss() ? 30 : 48;
    }

    isControllerVisible(): boolean {
        return this.state.controllerVisible || false;
    }

    getDialogStyle() {
        let { width, height } = this.state;
        if (!width || !height) {
            ({ width, height } = Dimensions.get('window'));
        }

        const statusBarHeight = UIDevice.statusBarHeight();
        const navBarHeight =
            Platform.OS === 'web' || !this.dismissible ? 0 : UIDevice.navigationBarHeight(); // navigation bar height above the modal controller
        const modalForWebTopOffset = Platform.OS === 'web' && this.modalOnWeb ? height / 2.0 : 0;

        const containerStyle: Style = {
            // top: -1, // fix for 1px top offset
            paddingTop: statusBarHeight + navBarHeight + modalForWebTopOffset,
            width,
            height,
        };

        let dialogStyle: Style | Style[] = [
            styles.dialogOverflow,
            this.modalOnWeb ? styles.modalOnWebDialogBorders : styles.dialogBorders,
            this.fromBottom
                ? {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                  }
                : null,
        ];

        // Need to enlarge the controller in order to hide a "bouncing" bottom border.
        // It works for PopupDialog ONLY in case we have some space above the dialog!
        let enlargeHeightForBounce = navBarHeight > UIConstant.coverBounceOffset();
        if (!this.fullscreen && (UIDevice.isDesktop() || UIDevice.isTablet())) {
            width = Math.min(width, fullScreenDialogWidth);
            height = Math.min(height, fullScreenDialogHeight);
            if (width === fullScreenDialogWidth && height === fullScreenDialogHeight) {
                dialogStyle = styles.dialogOverflow;
                enlargeHeightForBounce = false; // no need to enlarge centered modal controller
            }
        }

        if (this.half && !(UIDevice.isDesktop() || UIDevice.isTablet())) {
            height /= 2;
            containerStyle.justifyContent = 'flex-end';
        } else {
            height -= statusBarHeight + navBarHeight;
        }

        let contentHeight = height - this.getSafeAreaInsets().bottom;

        if (this.dismissible) {
            contentHeight -= this.getNavigationBarHeight();
        }

        // eslint-disable-next-line no-underscore-dangle
        if (
            (this.fromBottom || this.state.keyboardVisible) &&
            (UIDevice.isDesktop() || UIDevice.isTablet())
        ) {
            const screenHeight = Dimensions.get('window').height;
            const halfFullScreenDialogHeight = Math.min(screenHeight, fullScreenDialogHeight) / 2;
            const halfScreenHeight = screenHeight / 2;

            containerStyle.justifyContent = 'flex-end';
            height = halfScreenHeight + halfFullScreenDialogHeight;

            contentHeight = height - this.getSafeAreaInsets().bottom;
            if (this.dismissible) {
                contentHeight -= this.getNavigationBarHeight();
            }
        }

        if (enlargeHeightForBounce) {
            height += UIConstant.coverBounceOffset();
            containerStyle.paddingTop += UIConstant.coverBounceOffset();
        }

        return {
            width,
            height,
            contentHeight,
            containerStyle,
            dialogStyle,
        };
    }

    getCancelImage() {
        return null;
    }

    // Override if needed!
    shouldSwipeToDismiss() {
        return Platform.OS !== 'web';
    }

    getAnimatedOverlayOpacity(): ColorValue {
        // const { height } = Dimensions.get('window');
        // const maxValue = height - UIDevice.statusBarHeight() - this.getNavigationBarHeight();
        return (this.dy: any).interpolate({
            // inputRange: [0, maxValue],
            inputRange: [0, 800],
            outputRange: [1, 0],
        });
    }

    // Setters
    setContentInset(contentInset: ContentInset, animation: ?AnimationParameters) {
        super.setContentInset(contentInset);
        let bottomInset = contentInset.bottom;
        // If bottom inset is greater than zero (keyboard is visible),
        // OR dynamic adjustment is enabled,
        // then append the bottom safe area value
        if (bottomInset > 0 || this.adjustBottomSafeAreaInsetDynamically) {
            bottomInset += this.getSafeAreaInsets().bottom;
        }

        if (animation) {
            Animated.timing(this.marginBottom, {
                toValue: bottomInset,
                duration: animation.duration,
                easing: UIController.getEasingFunction(animation.easing),
            }).start();
        } else {
            Animated.spring(this.marginBottom, {
                toValue: bottomInset,
                duration: UIConstant.animationDuration(),
            }).start();
        }
    }

    setControllerVisible(controllerVisible: boolean, callback?: () => void) {
        this.setStateSafely({ controllerVisible }, callback);
    }

    setSize(width: number, height: number) {
        this.setStateSafely({
            width,
            height,
        });
    }

    setHeader(header: React$Node) {
        this.setStateSafely({ header });
    }

    // Getters
    getBackgroundColor() {
        if (Platform.OS === 'web' && this.modalOnWeb) {
            return UIColor.overlay60();
        }
        return Platform.OS === 'web' && this.fullscreen ? 'transparent' : UIColor.overlay60();
    }

    isHeaderLineVisible() {
        return false;
    }

    // Events

    // Actions
    getSlidingAnimation(animation, toValue, useNativeDriver) {
        return Animated.spring(animation, {
            toValue,
            velocity: 0,
            tension: 15,
            friction: 10,
            useNativeDriver,
        });
    }

    moveToTop(onFinish) {
        this.getSlidingAnimation(this.dy, 0, true).start(onFinish);
    }

    moveToBottom(onFinish) {
        // const { height } = Dimensions.get('window');
        // const maxValue = height - UIDevice.statusBarHeight() - this.getNavigationBarHeight();
        // this.animation.toValue(maxValue, () => this.onCancelPress());
        this.getSlidingAnimation(this.dy, 800, true).start(onFinish);
    }

    openDialog() {
        this.onWillAppear();
        this.dy.setValue(800);
        this.moveToTop(this.onDidAppearHandler);
    }

    async show(arg: ModalControllerShowArgs) {
        let open;
        if (!arg) {
            open = true;
        } else if (typeof arg === 'boolean') {
            open = arg;
        } else if (arg && typeof arg === 'object') {
            if (!arg.open) {
                open = true;
            } else {
                open = arg.open;
            }
            if (arg.onCancel) {
                this.onCancel = arg.onCancel;
            }
            if (arg.onSubmit) {
                this.onSubmit = arg.onSubmit;
            }
            if (arg.onSelect) {
                this.onSelect = arg.onSelect;
            }
        }
        await UIFunction.makeAsync(this.setControllerVisible.bind(this))(true);
        if (open) {
            this.openDialog();
        }
    }

    async hide() {
        if (this.state.controllerVisible) {
            this.onWillHide();
            this.moveToBottom(this.onDidHideHandler);
        }
    }

    // Render
    renderLeftHeader() {
        return null;
    }

    renderCentralHeader() {
        return null;
    }

    renderRightHeader() {
        return null;
    }

    renderModalNavigationBar() {
        if (!this.dismissible) {
            return null;
        }
        if (this.state.header) {
            return this.state.header;
        }
        return (
            <UIModalNavigationBar
                dismissStripeStyle={
                    this.smallStripe ? styles.smallDismissStripe : styles.defaultDismissStripe
                }
                height={this.getNavigationBarHeight()}
                swipeToDismiss={this.shouldSwipeToDismiss()}
                leftComponent={this.renderLeftHeader()}
                centralComponent={this.renderCentralHeader()}
                rightComponent={this.renderRightHeader()}
                bottomLine={this.isHeaderLineVisible()}
                // onMove={Animated.event([null, { dy: this.dy }])}
                // onRelease={this.onReleaseSwipe}
                onCancel={this.onCancelPress}
                cancelImage={this.getCancelImage()}
            />
        );
    }

    renderDialog() {
        const { width, height, contentHeight, containerStyle, dialogStyle } = this.getDialogStyle();

        const testIDProp = this.testID ? { testID: `${this.testID}_dialog` } : null;
        return (
            <Animated.View
                {...testIDProp}
                style={[
                    { width, height },
                    {
                        minWidth: this.minWidth,
                        minHeight: this.minHeight,
                    },
                    styles.dialog,
                    dialogStyle,
                    { transform: [{ translateY: this.dy }] },
                ]}
            >
                <Animated.View
                    style={[
                        contentHeight != null
                            ? {
                                  height: contentHeight + this.getSafeAreaInsets().bottom,
                              }
                            : UIStyle.common.flex(),
                        this.adjustKeyboardInsetDynamically
                            ? { paddingBottom: this.marginBottom }
                            : null,
                    ]}
                >
                    {this.renderModalNavigationBar()}
                    {this.renderContentView(contentHeight)}
                </Animated.View>
                {this.renderSpinnerOverlay()}
            </Animated.View>
        );
    }

    // eslint-disable-next-line no-unused-vars
    renderContentView(contentHeight: number): React$Node {
        return null;
    }

    panHandlerRef = React.createRef<TapGestureHandler>();

    onReleaseSwipe = (dy: number) => {
        if (dy > UIConstant.swipeThreshold()) {
            this.hide();
        } else {
            this.moveToTop();
        }
    };

    onPan = ({ nativeEvent: { translationY } }) => {
        if (translationY > 0) {
            this.dy.setValue(translationY);
        }
    };

    onPanHandlerStateChange = ({ nativeEvent: { state, translationY } }) => {
        if (state === State.END || state === State.CANCELLED) {
            this.onReleaseSwipe(translationY);
        }
    };
    onTapHandlerStateChange = ({ nativeEvent: { state } }) => {
        if (state === State.ACTIVE) {
            this.hide();
        }
    };
    renderContainer() {
        const backgroundColor = this.getBackgroundColor();
        const { containerStyle } = this.getDialogStyle();
        return (
            <Animated.View
                style={[
                    UIStyle.Common.absoluteFillContainer(),
                    { justifyContent: 'center', alignItems: 'center' },
                    containerStyle,
                ]}
            >
                <TapGestureHandler
                    enabled={this.dismissible}
                    waitFor={this.panHandlerRef}
                    onHandlerStateChange={this.onTapHandlerStateChange}
                >
                    <PanGestureHandler
                        enabled={this.dismissible}
                        ref={this.panHandlerRef}
                        onGestureEvent={this.onPan}
                        onHandlerStateChange={this.onPanHandlerStateChange}
                    >
                        <Animated.View
                            style={[
                                // DO NOT USE UIStyle.absoluteFillObject here, as it has { overflow: 'hidden' }
                                // And this brings a layout bug to Safari
                                UIStyle.Common.absoluteFillContainer(),
                                { backgroundColor },
                                { opacity: this.getAnimatedOverlayOpacity() },
                            ]}
                            onLayout={this.onLayout}
                        />
                    </PanGestureHandler>
                </TapGestureHandler>
                <PanGestureHandler
                    enabled={this.dismissible}
                    onGestureEvent={this.onPan}
                    onHandlerStateChange={this.onPanHandlerStateChange}
                >
                    {this.renderDialog()}
                </PanGestureHandler>
            </Animated.View>
        );
    }

    render() {
        if (!this.state.controllerVisible) {
            return null;
        }

        return this.renderContainer();
    }

    // Internals
}
