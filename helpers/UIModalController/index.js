import React from 'react';
import { Platform, Modal, View, Dimensions, Animated } from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

import UIController from '../../helpers/UIController';
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

export default class UIModalController extends UIController {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            dy: null,
        };

        this.fullscreen = false;
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    // Events
    onDismissed() {
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

    onLayout(e) {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        this.setSize(width, height);
    }

    onReleaseSwipe(dy) {
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
            ({ width, height } = Dimensions.get('window'));
        }

        const statusBarHeight = UIDevice.statusBarHeight();
        const navBarHeight = Platform.OS === 'web' ? 0 : UIDevice.navigationBarHeight();

        const containerStyle = {
            top: -1, // fix for 1px top offset
            paddingTop: statusBarHeight + navBarHeight,
            width,
            height,
        };

        let dialogStyle = {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: Platform.OS === 'ios' ? UIConstant.borderRadius() : 0,
            borderTopRightRadius: Platform.OS === 'ios' ? UIConstant.borderRadius() : 0,
            overflow: 'hidden',
        };

        if (Platform.OS === 'web'
            && !UIDevice.isMobile() && !this.fullscreen) {
            width = Math.min(width, fullScreenDialogWidth);
            height = Math.min(height, fullScreenDialogHeight);
            if (width === fullScreenDialogWidth && height === fullScreenDialogHeight) {
                dialogStyle = { overflow: 'hidden' };
            }
        }

        height -= statusBarHeight + navBarHeight;

        const contentHeight = (height - UIModalNavigationBar.getBarHeight()) + UIConstant.coverBounceOffset();

        return {
            width, height, contentHeight, containerStyle, dialogStyle,
        };
    }

    interpolateColor() {
        const { height } = Dimensions.get('window');
        const maxValue = height - UIDevice.statusBarHeight() - UIModalNavigationBar.getBarHeight();
        return this.state.dy.interpolate({
            inputRange: [0, maxValue],
            outputRange: [UIColor.overlay60(), UIColor.overlay0()],
        });
    }

    // Setters
    setControllerVisible(controllerVisible, callback) {
        if (!this.mounted) {
            return;
        }
        this.setState({
            controllerVisible,
        }, callback);
    }

    setSize(width, height) {
        if (!this.mounted) {
            return;
        }
        this.setState({
            width,
            height,
        });
    }

    setDy(dy, callback) {
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
        if (this.onShow) {
            this.onShow();
        }
        // First set visible then do the rest
        setTimeout(() => { // in order to render
            this.dialog.show();
            this.setInitialSwipeState();
        }, 0);
    }

    hide() {
        this.dialog.dismiss();
        if (this.onHide) {
            this.onHide();
        }
    }

    returnToTop() {
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
                        swipeToDismiss={Platform.OS !== 'web'}
                        onMove={Animated.event([
                            null,
                            { dy: this.state.dy },
                        ])}
                        onRelease={dy => this.onReleaseSwipe(dy)}
                        onCancel={() => this.onCancelPress()}
                    />}
                dismissOnTouchOutside={false}
                onDismissed={() => this.onDismissed()}
                overlayBackgroundColor="transparent"
            >
                <View style={{ height: contentHeight }}>
                    {this.renderContentView(contentHeight)}
                </View>
            </PopupDialog>
        );
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
}
