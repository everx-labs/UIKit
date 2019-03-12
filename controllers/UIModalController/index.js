/* eslint-disable class-methods-use-this */
// @flow
import React from 'react';
import { StyleSheet, Platform, Modal, Dimensions, Animated } from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {
    AnimationParameters,
    ContentInset,
    ControllerProps,
    ControllerState,
} from '../UIController';

import UIController from '../UIController';
import UIDevice from '../../helpers/UIDevice';
import UIStyle from '../../helpers/UIStyle';
import UIColor from '../../helpers/UIColor';
import UIConstant from '../../helpers/UIConstant';
import UIModalNavigationBar from './UIModalNavigationBar';

const fullScreenDialogWidth = 600;
const fullScreenDialogHeight = 600;

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

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

type ModalControllerProps = ControllerProps;

type ModalControllerState = ControllerState & {
    dy?: ?Animated.Value;
    width?: ?number,
    height?: ?number,
    controllerVisible?: boolean,
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

export default class UIModalController
    extends UIController<ModalControllerProps, ModalControllerState> {
    fullscreen: boolean;
    dismissible: boolean;
    modal: boolean;
    onCancel: ?(() => void);
    bgAlpha: ?ColorValue;
    dialog: ?PopupDialog;
    marginBottom: Animated.Value;

    constructor(props: ModalControllerProps) {
        super(props);
        this.hasSpinnerOverlay = true;
        this.fullscreen = false;
        this.dismissible = true;
        this.modal = true;
        this.dialog = null;
        this.onCancel = null;
        this.marginBottom = new Animated.Value(0);

        this.state = {
            ...this.state,
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillReceiveProps(nextProps: ModalControllerProps) {
        super.componentWillReceiveProps(nextProps);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    // Events
    onWillAppear() {
        // Method needs to be overriden in order to be used.
    }

    onDidAppear() {
        // Method needs to be overriden in order to be used.
    }

    onWillHide() {
        // Method needs to be overriden in order to be used.
    }

    onDidHide() {
        this.setControllerVisible(false, () => {
            this.setDy(null);
        });
    }

    onCancelPress() {
        this.hide();
        if (this.onCancel) {
            this.onCancel();
        }
    }

    onLayout(e: OnLayoutEventArgs) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        this.setSize(width, height);
    }

    onReleaseSwipe(dy: number) {
        if (dy > UIConstant.swipeThreshold()) {
            this.onCancelPress();
        } else {
            this.returnToTop();
        }
    }

    // Getters

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
        const navBarHeight = Platform.OS === 'web' || !this.modal
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
            contentHeight -= UIModalNavigationBar.getBarHeight(this.shouldSwipeToDismiss());
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
        const maxValue = height - UIDevice.statusBarHeight()
            - UIModalNavigationBar.getBarHeight(this.shouldSwipeToDismiss());
        const { dy } = this.state;
        if (!dy) {
            return UIColor.overlay60();
        }
        return (dy: any).interpolate({
            inputRange: [0, maxValue],
            outputRange: [UIColor.overlay60(), UIColor.overlay0()],
        });
    }

    // Setters
    setContentInset(contentInset: ContentInset, animation: ?AnimationParameters) {
        super.setContentInset(contentInset);
        const bottomInset = Math.max(0, contentInset.bottom, this.getSafeAreaInsets().bottom);
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

    setDy(dy: ?Animated.Value, callback?: () => void) {
        this.setStateSafely({ dy }, callback);
    }

    setInitialSwipeState() {
        this.setDy(new Animated.Value(0), () => {
            this.bgAlpha = this.interpolateColor();
        });
    }

    // Events

    // Actions
    show() {
        this.setControllerVisible(true);
        this.onWillAppear();
        // First set visible then do the rest
        setTimeout(() => { // in order to render
            if (this.dialog) {
                this.dialog.show();
            }
            this.setInitialSwipeState();
        }, 0);
    }

    hide() {
        if (this.dialog) {
            this.dialog.dismiss();
            this.onWillHide();
        }
    }

    returnToTop() {
        if (!this.state.dy) {
            return;
        }
        Animated.spring(this.state.dy, {
            toValue: 0,
            // Use same options as in popup-dialog animation module
            // may delete them for more standard anim and bounciness
            velocity: 0,
            tension: 65,
            friction: 10,
        }).start();
    }

    // Render
    getModalNavigationBar() {
        if (!this.dismissible) {
            return null;
        }
        return (<UIModalNavigationBar
            swipeToDismiss={this.shouldSwipeToDismiss()}
            onMove={Animated.event([
                null,
                { dy: (this.state.dy || new Animated.Value(0)) },
            ])}
            onRelease={dy => this.onReleaseSwipe(dy)}
            onCancel={() => this.onCancelPress()}
        />);
    }

    renderDialog() {
        const {
            width, height, contentHeight, containerStyle, dialogStyle,
        } = this.getDialogStyle();
        return (
            <PopupDialog
                ref={(popupDialog) => {
                    this.dialog = popupDialog;
                }}
                width={width}
                height={height}
                containerStyle={containerStyle}
                dialogStyle={dialogStyle}
                dialogAnimation={slideAnimation}
                dialogTitle={this.getModalNavigationBar()}
                dismissOnTouchOutside={false}
                onDismissed={() => this.onDidHide()}
                onShown={() => this.onDidAppear()}
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
            </PopupDialog>
        );
    }

    renderContentView(contentHeight: number): React$Node {
        return null;
    }

    renderContainer() {
        const backgroundColor = Platform.OS === 'web' && this.fullscreen
            ? 'transparent'
            : this.bgAlpha;

        return (
            <Animated.View
                style={[UIStyle.absoluteFillObject, { backgroundColor }]}
                onLayout={e => this.onLayout(e)}
            >
                <Animated.View style={{ marginTop: this.state.dy }}>
                    {this.renderDialog()}
                    {this.renderSpinnerOverlay()}
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
            <Modal
                animationType="fade"
                transparent
                visible={this.state.controllerVisible}
            >
                {this.renderContainer()}
            </Modal>
        );
    }

    // Internals
}
