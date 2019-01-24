// @flow

import React from 'react';
import { StyleSheet, Platform, Modal, View, Dimensions, Animated } from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type { ControllerProps, ControllerState } from '../UIController';

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

export default class UIModalController<Props, State>
    extends UIController<Props & ModalControllerProps, State & ModalControllerState> {
    fullscreen: boolean;
    onCancel: ?(() => void);
    bgAlpha: ?ColorValue;
    dialog: ?PopupDialog;

    constructor(props: Props & ModalControllerProps) {
        super(props);
        this.fullscreen = false;
        this.dialog = null;
        this.onCancel = null;
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillReceiveProps(nextProps: Props & ModalControllerProps) {
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
        if (dy > UIConstant.swipeToDismissTreshold()) {
            this.onCancelPress();
        } else {
            this.returnToTop();
        }
    }

    // Getters
    getDialogStyle() {
        let { width, height } = this.state;
        if (!width || !height) {
            ({
                width,
                height,
            } = Dimensions.get('window'));
        }

        const statusBarHeight = UIDevice.statusBarHeight();
        const navBarHeight = Platform.OS === 'web' ? 0 : UIDevice.navigationBarHeight();

        const containerStyle = {
            top: -1, // fix for 1px top offset
            paddingTop: statusBarHeight + navBarHeight,
            width,
            height,
        };

        let dialogStyle = [styles.dialogOverflow, styles.dialogBorders];

        let enlargeHeightForBounce = true;
        if (Platform.OS === 'web'
            && !UIDevice.isMobile() && !this.fullscreen) {
            width = Math.min(width, fullScreenDialogWidth);
            height = Math.min(height, fullScreenDialogHeight);
            if (width === fullScreenDialogWidth && height === fullScreenDialogHeight) {
                dialogStyle = styles.dialogOverflow;
                enlargeHeightForBounce = false;
            }
        }

        height -= statusBarHeight + navBarHeight;

        const contentHeight =
            height - UIModalNavigationBar.getBarHeight(this.shouldSwipeToDismiss())
            - UIDevice.safeAreaInsets().bottom;

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
    setControllerVisible(controllerVisible: boolean, callback?: () => void) {
        if (!this.mounted) {
            return;
        }
        this.setState({ controllerVisible }, callback);
    }

    setSize(width: number, height: number) {
        if (!this.mounted) {
            return;
        }
        this.setState({
            width,
            height,
        });
    }

    setDy(dy: ?Animated.Value, callback?: () => void) {
        if (!this.mounted) {
            return;
        }
        this.setState({ dy }, callback);
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
                dialogTitle={
                    <UIModalNavigationBar
                        swipeToDismiss={this.shouldSwipeToDismiss()}
                        onMove={Animated.event([
                            null,
                            { dy: (this.state.dy || new Animated.Value(0)) },
                        ])}
                        onRelease={dy => this.onReleaseSwipe(dy)}
                        onCancel={() => this.onCancelPress()}
                    />}
                dismissOnTouchOutside={false}
                onDismissed={() => this.onDidHide()}
                onShown={() => this.onDidAppear()}
                overlayBackgroundColor="transparent"
            >
                <View
                    style={{
                        height: contentHeight + UIDevice.safeAreaInsets().bottom,
                        paddingBottom: UIDevice.safeAreaInsets().bottom,
                    }}
                >
                    {this.renderContentView(contentHeight)}
                </View>
            </PopupDialog>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    renderContentView(contentHeight: number): ?React$Element<*> {
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
        if (Platform.OS === 'web') {
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
