/* eslint-disable class-methods-use-this */
// @flow
import React from 'react';
import {
    StyleSheet,
    Platform,
    Modal,
    Dimensions,
    Animated,
} from 'react-native';
import PopupDialog, {
    SlideAnimation,
    FadeAnimation,
} from 'react-native-popup-dialog';

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

const fullScreenDialogWidth = 600;
const fullScreenDialogHeight = 600;

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

export type ModalControllerProps = ControllerProps;

type ModalControllerState = ControllerState & {
    width?: ?number,
    height?: ?number,
    controllerVisible?: boolean,
    header?: React$Node,
};

const styles = StyleSheet.create({
    dialogOverflow: {
        overflow: 'hidden',
    },
    dialogBorders: {
        borderTopLeftRadius: Platform.OS === 'ios' ? UIConstant.borderRadius() : 0,
        borderTopRightRadius: Platform.OS === 'ios' ? UIConstant.borderRadius() : 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
});

export default class UIModalController<Props, State>
    extends UIController<ModalControllerProps & Props, ModalControllerState & State> {
    fullscreen: boolean;
    dismissible: boolean;
    modal: boolean;
    adjustBottomSafeAreaInsetDynamically: boolean;
    onCancel: ?(() => void);
    bgAlpha: ?ColorValue;
    dialog: ?PopupDialog;
    marginBottom: Animated.Value;
    dy: Animated.Value;
    animation: SlideAnimation | FadeAnimation;
    testID: ?string;

    static animations = {
        fade: () => new FadeAnimation({ toValue: 1 }),
        slide: () => new SlideAnimation({ slideFrom: 'bottom' }),
    };

    constructor(props: ModalControllerProps & Props) {
        super(props);
        this.testID = '[UIModalController]';
        this.hasSpinnerOverlay = true;
        this.fullscreen = false;
        this.dismissible = true;
        this.modal = true;
        this.adjustBottomSafeAreaInsetDynamically = true;
        this.dialog = null;
        this.onCancel = null;
        this.marginBottom = new Animated.Value(0);
        this.dy = new Animated.Value(0);
        this.animation = UIModalController.animations.slide();
        this.state = {
            ...(this.state: ModalControllerState & State),
        };
    }

    // Events
    onWillAppear() {
        this.marginBottom.setValue(this.getSafeAreaInsets().bottom);
    }

    onDidAppearHandler = () => {
        this.onDidAppear();
    };

    onDidAppear() {
        this.initKeyboardListeners();
    }

    onWillHide() {
        this.deinitKeyboardListeners();
    }

    onDidHideHandler = () => {
        this.onDidHide();
    };

    onDidHide() {
        this.setControllerVisible(false, () => {
            this.dy.setValue(0);
        });
    }

    onCancelPress = () => {
        this.hide();
        if (this.onCancel) {
            this.onCancel();
        }
    };

    onLayout = (e: OnLayoutEventArgs) => {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        this.setSize(width, height);
    };

    onReleaseSwipe = (dy: number) => {
        if (dy > UIConstant.swipeThreshold()) {
            this.onCancelPress();
        } else {
            this.returnToTop();
        }
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
            ({
                width,
                height,
            } = Dimensions.get('window'));
        }

        const statusBarHeight = UIDevice.statusBarHeight();
        const navBarHeight = Platform.OS === 'web' || !this.dismissible
            ? 0
            : UIDevice.navigationBarHeight(); // navigation bar height above the modal controller

        const containerStyle = {
            top: -1, // fix for 1px top offset
            paddingTop: statusBarHeight + navBarHeight,
            width,
            height,
        };

        let dialogStyle = [styles.dialogOverflow, styles.dialogBorders];

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

        height -= statusBarHeight + navBarHeight;

        let contentHeight = height - this.getSafeAreaInsets().bottom;
        if (this.dismissible) {
            contentHeight -= this.getNavigationBarHeight();
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

    // Override if needed!
    shouldSwipeToDismiss() {
        return Platform.OS !== 'web';
    }

    interpolateColor(): ColorValue {
        const { height } = Dimensions.get('window');
        const maxValue = height - UIDevice.statusBarHeight() - this.getNavigationBarHeight();
        return (this.dy: any).interpolate({
            inputRange: [0, maxValue],
            outputRange: [UIColor.overlay60(), UIColor.overlay0()],
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

    setInitialSwipeState() {
        this.dy.setValue(0);
        this.bgAlpha = this.interpolateColor();
    }

    setHeader(header: React$Node) {
        this.setStateSafely({ header });
    }

    // Getters
    getBackgroundColor() {
        return Platform.OS === 'web' && this.fullscreen
            ? 'transparent'
            : this.bgAlpha;
    }

    // Events

    // Actions
    openDialog() {
        this.onWillAppear();
        if (this.dialog) {
            this.dialog.show();
        }
    }

    async show(open: boolean = true, data: any) {
        this.setInitialSwipeState();
        await UIFunction.makeAsync(this.setControllerVisible.bind(this))(true);
        if (open) {
            this.openDialog();
        }
    }

    async hide() {
        if (this.dialog) {
            this.dialog.dismiss();
            this.onWillHide();
        }
    }

    returnToTop() {
        Animated.spring(this.dy, {
            toValue: 0,
            // Use same options as in popup-dialog animation module
            // may delete them for more standard anim and bounciness
            velocity: 0,
            tension: 65,
            friction: 10,
        }).start();
    }

    // Render
    renderLeftHeader() {
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
                height={this.getNavigationBarHeight()}
                swipeToDismiss={this.shouldSwipeToDismiss()}
                leftComponent={this.renderLeftHeader()}
                rightComponent={this.renderRightHeader()}
                onMove={Animated.event([null, { dy: this.dy }])}
                onRelease={this.onReleaseSwipe}
                onCancel={this.onCancelPress}
            />
        );
    }

    renderDialog() {
        const {
            width, height, contentHeight, containerStyle, dialogStyle,
        } = this.getDialogStyle();
        const testIDProp = this.testID ? { testID: `${this.testID}_dialog` } : null;
        return (
            <PopupDialog
                {...testIDProp}
                ref={(popupDialog) => { this.dialog = popupDialog; }}
                width={width}
                height={height}
                containerStyle={containerStyle}
                dialogStyle={dialogStyle}
                dialogAnimation={this.animation} //
                dialogTitle={this.renderModalNavigationBar()}
                dismissOnTouchOutside={false}
                onDismissed={this.onDidHideHandler}
                onShown={this.onDidAppearHandler}
                overlayBackgroundColor="transparent"
            >
                <Animated.View
                    style={{
                        height: contentHeight + this.getSafeAreaInsets().bottom,
                        paddingBottom: this.marginBottom,
                    }}
                >
                    {this.renderContentView(contentHeight)}
                </Animated.View>
                {this.renderSpinnerOverlay()}
            </PopupDialog>
        );
    }

    renderContentView(contentHeight: number): React$Node {
        return null;
    }

    renderContainer() {
        const backgroundColor = this.getBackgroundColor();
        return (
            <Animated.View
                style={[
                    // DO NOT USE UIStyle.absoluteFillObject here, as it has { overflow: 'hidden' }
                    // And this brings a layout bug to Safari
                    UIStyle.Common.absoluteFillContainer(),
                    { backgroundColor },
                ]}
                onLayout={this.onLayout}
            >
                <Animated.View style={{ marginTop: this.dy }}>
                    {this.renderDialog()}
                </Animated.View>
            </Animated.View>
        );
    }

    render() {
        if (!this.state.controllerVisible) {
            return null;
        }
        if (Platform.OS === 'web' || !this.modal) {
            return this.renderContainer();
        }
        return (
            UIDevice.isMobile() ? (
                this.renderContainer()
            ) : (
                <Modal
                    animationType="fade"
                    transparent
                    visible={this.state.controllerVisible}
                >
                    {this.renderContainer()}
                </Modal>
            )
        );
    }

    // Internals
}
