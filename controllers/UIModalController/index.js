// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { StyleSheet, Platform, Dimensions, Animated, BackHandler } from 'react-native';
import type { PanResponderInstance } from 'react-native/Libraries/Interaction/PanResponder';
import type { Style } from 'react-style-proptype/src/Style.flow';
import {
    PanGestureHandler,
    TapGestureHandler,
    State as RNGHState,
} from 'react-native-gesture-handler';

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
const HARDWARE_BACK_PRESS_EVENT = 'hardwareBackPress';

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

type RNGHEvent<T> = { nativeEvent: T };

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
    containerCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerToTheEnd: {
        justifyContent: 'flex-end',
    },
    dialog: {
        borderRadius: UIConstant.borderRadius(),
        backgroundColor: UIColor.backgroundPrimary(UIColor.Theme.Light),
    },
    dialogOverflow: {
        overflow: 'hidden',
    },
    dialogBorders: {
        borderTopLeftRadius: Platform.select({
            ios: UIConstant.borderRadius(),
            android: 0,
            web: UIConstant.borderRadius(),
        }),
        borderTopRightRadius: Platform.select({
            ios: UIConstant.borderRadius(),
            android: 0,
            web: UIConstant.borderRadius(),
        }),
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
    animation: 'slide' | 'fade';
    testID: ?string;
    minWidth: number = 0;
    minHeight: number = 0;
    modalOnWeb: boolean;

    static animations = {
        fade: () => 'fade',
        slide: () => 'slide',
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
        this.animation = UIModalController.animations.slide();
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

        const outterNavBarHeight = this.dismissible ? UIDevice.navigationBarHeight() : 0; // navigation bar height above the modal controller

        if (UIDevice.isDesktop() || UIDevice.isTablet()) {
            if (!this.fullscreen) {
                // On the desktop and the tablet we need to show a modal with fixed width and height
                width = Math.min(width, fullScreenDialogWidth);
                height = Math.min(height, fullScreenDialogHeight);
                // -------
                // Basically we are trying to make a modal with a standard size (i.e fullScreenDialogWidth)
                // But sometimes controller could specify minimum size
                width = Math.max(width, this.minWidth);
                height = Math.max(height, this.minHeight);
                // -------
                if (this.fromBottom) {
                    const screenHeight = Dimensions.get('window').height;
                    height = Math.min(screenHeight, screenHeight - (screenHeight - height) / 2);
                }
            }
            return {
                width,
                height,
                dialogStyle: [
                    styles.dialog, // general style for dialog with rounded corners (all) and background color
                    styles.dialogOverflow,
                    this.fromBottom ? styles.dialogBorders : null,
                    { width, height },
                    this.animation === UIModalController.animations.slide()
                        ? { transform: [{ translateY: this.dy }] }
                        : { opacity: this.getDYDependentOpacity() },
                ],
                contentHeight: height - outterNavBarHeight,
                containerStyle: [
                    UIStyle.Common.absoluteFillContainer(),
                    styles.containerCentered,
                    this.fromBottom ? styles.containerToTheEnd : null,
                ],
            };
        }

        // Mobile
        const containerPaddingTop = UIDevice.statusBarHeight() + outterNavBarHeight;

        const bottomInset = this.fromBottom ? 0 : this.getSafeAreaInsets().bottom;
        const innerNavBarHeight = this.getNavigationBarHeight();
        const contentHeight = height - containerPaddingTop - innerNavBarHeight - bottomInset;

        // Looks like it's something that used before
        // Grep across the project didn't get any use of it
        // if (this.half) {
        //     height /= 2;
        //     containerStyle.push({ justifyContent: 'flex-end' });
        // } else {
        //     // height -= statusBarHeight + navBarHeight;
        // }

        return {
            width,
            height,
            contentHeight,
            containerStyle: [
                UIStyle.Common.absoluteFillContainer(),
                UIStyle.common.flex(),
                {
                    paddingTop: containerPaddingTop,
                },
            ],
            dialogStyle: [
                styles.dialog, // general style for dialog with rounded corners (all) and background color
                styles.dialogOverflow,
                styles.dialogBorders,
                UIStyle.common.flex(),
                this.animation === UIModalController.animations.slide()
                    ? { transform: [{ translateY: this.dy }] }
                    : { opacity: this.getDYDependentOpacity() },
            ],
        };
    }

    getCancelImage() {
        return null;
    }

    // Override if needed!
    shouldSwipeToDismiss() {
        return Platform.OS !== 'web'; // this.dismissible;
    }

    getMaxHeight() {
        const { height } = Dimensions.get('window');
        return height - UIDevice.statusBarHeight();
    }

    getDYDependentOpacity(): ColorValue {
        const maxHeight = this.getMaxHeight();
        return (this.dy: any).interpolate({
            inputRange: [0, maxHeight],
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
    getSlidingAnimation(animation: Animated.Value, toValue: number, useNativeDriver: boolean) {
        return Animated.spring(animation, {
            toValue,
            velocity: 0,
            tension: 15,
            friction: 10,
            useNativeDriver,
        });
    }

    moveToTop(onFinish: ?() => void) {
        this.getSlidingAnimation(this.dy, 0, true).start(onFinish);
    }

    moveToBottom(onFinish: ?() => void) {
        const maxHeight = this.getMaxHeight();
        this.getSlidingAnimation(this.dy, maxHeight, true).start(onFinish);
    }

    openDialog() {
        this.onWillAppear();
        const maxHeight = this.getMaxHeight();
        this.dy.setValue(maxHeight);
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

    onPan = ({ nativeEvent: { translationY } }: RNGHEvent<{ translationY: number }>) => {
        if (translationY > 0 && this.dismissible) {
            this.dy.setValue(translationY);
        }
    };

    onPanHandlerStateChange = ({
        nativeEvent: { state, translationY },
    }: RNGHEvent<{ state: RNGHState, translationY: number }>) => {
        if ((state === RNGHState.END || state === RNGHState.CANCELLED) && this.dismissible) {
            this.onReleaseSwipe(translationY);
        }
    };
    onTapHandlerStateChange = ({ nativeEvent: { state } }: RNGHEvent<{ state: RNGHState }>) => {
        if (state === RNGHState.ACTIVE && this.dismissible) {
            this.hide();
        }
    };
    renderContainer() {
        const backgroundColor = this.getBackgroundColor();
        const { containerStyle, contentHeight, dialogStyle } = this.getDialogStyle();
        const testIDProp = this.testID ? { testID: `${this.testID}_dialog` } : null;
        return (
            <Animated.View style={containerStyle}>
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
                                { opacity: this.getDYDependentOpacity() },
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
                    <Animated.View {...testIDProp} style={dialogStyle}>
                        {this.renderModalNavigationBar()}
                        <Animated.View
                            style={[
                                UIStyle.common.flex(),
                                this.adjustKeyboardInsetDynamically
                                    ? { paddingBottom: this.marginBottom }
                                    : null,
                            ]}
                        >
                            {this.renderContentView(contentHeight)}
                        </Animated.View>
                        {this.renderSpinnerOverlay()}
                    </Animated.View>
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
}
