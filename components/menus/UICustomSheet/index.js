// @flow
import React from 'react';
import {
    Animated,
    BackHandler,
    Modal,
    Platform,
    LayoutAnimation,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIController from '../../../controllers/UIController';
import UIModalNavigationBar from '../../../controllers/UIModalController/UIModalNavigationBar';

import type { ContentInset, AnimationParameters } from '../../../controllers/UIController';
import { KeyboardAvoidingView } from 'react-native-web';

const headerHeight = UIConstant.bigCellHeight();

const styles = StyleSheet.create({
    downMenu: {
        position: 'absolute',
        backgroundColor: 'white',
        bottom: UIConstant.contentOffset(),
        borderRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.contentOffset(),
    },
    fullScreenContainer: {
        left: UIConstant.contentOffset(),
        right: UIConstant.contentOffset(),
    },
    slimContainer: {
        paddingBottom: UIConstant.contentOffset(),
        width: '100%',
        maxWidth: UIConstant.elasticWidthHalfNormal(),
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
    smallDismissStripe: {
        width: 2 * UIConstant.iconSize(),
        height: UIConstant.tinyBorderRadius(),
        borderRadius: UIConstant.tinyBorderRadius() / 2,
    },
    headerArea: {
        height: headerHeight,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

const maxScreenHeight = UIConstant.maxScreenHeight();

let masterRef = null;

export type Props = any & {
    component: ?React$Node,
    headerLeft?: React$Node,
    headerRight?: React$Node,
    fullWidth?: boolean,
    masterSheet?: boolean,
    modal?: boolean,
    showHeader?: boolean,
    containerStyle?: any,
    onShow?: () => void,
    onCancel?: () => void,
};

export type State = {
    modalVisible: boolean,
    height: number,
};

export default class UICustomSheet extends UIController<Props, State> {
    static defaultProps: Props = {
        component: null,
        headerLeft: null,
        headerRight: null,
        fullWidth: false,
        masterSheet: true,
        modal: false,
        showHeader: true,
        containerStyle: null,
        onShow: () => {},
        onCancel: () => {},
    };

    static show(args: any) {
        if (masterRef) {
            if (!args.component) {
                masterRef.show({ component: args });
            } else {
                masterRef.show(args);
            }
        }
    }

    static hide(callback?: () => void) {
        if (masterRef) {
            masterRef.hide(callback);
        }
    }

    component: ?React$Node;
    headerLeft: ?React$Node;
    headerRight: ?React$Node;
    fullWidth: ?boolean;
    marginBottom: AnimatedValue;
    containerStyle: ?any;
    onShow: ?() => void;
    onCancel: ?() => void;
    modal: ?boolean;
    showHeader: ?boolean;
    dy: Animated.Value;

    // constructor
    constructor(props: Props) {
        super(props);
        this.component = null;
        this.headerLeft = null;
        this.headerRight = null;
        this.fullWidth = false;
        this.showHeader = true;
        this.containerStyle = null;
        this.marginBottom = new Animated.Value(-UIConstant.maxScreenHeight());
        this.onShow = () => {};
        this.onCancel = () => {};
        this.dy = new Animated.Value(0);

        this.state = {
            modalVisible: false,
            height: 0,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterSheet) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.stopListeningToBackButton();
        if (this.props.masterSheet) {
            masterRef = null;
        }
    }

    // Events
    onLayout = (e: any) => {
        const { height } = e.nativeEvent.layout;
        const oldHeight = this.getHeight();
        if (height !== oldHeight) {
            this.setHeight(height, () => {
                if (oldHeight === 0) {
                    this.animateShow();
                }
            });
        }
    };

    // same in UIModalController
    onReleaseSwipe = (dy: number) => {
        if (dy > UIConstant.swipeThreshold()) {
            this.onHide();
        } else {
            this.returnToTop();
        }
    };

    onHide = () => {
        this.hide(this.onCancel);
    };

    // Setters
    setContentInset(contentInset: ContentInset, animation: ?AnimationParameters) {
        super.setContentInset(contentInset, animation);
        const { duration, easing } = animation || {
            duration: UIConstant.animationDuration(),
            easing: LayoutAnimation.Types.keyboard,
        };
        // TODO: think how to use `useNativeDriver` here!
        Animated.timing(this.marginBottom, {
            toValue: contentInset.bottom + UIConstant.contentOffset(),
            duration,
            easing: UIController.getEasingFunction(easing),
            useNativeDriver: false,
        }).start();
    }

    setModalVisible(modalVisible: boolean, callback?: () => void) {
        if (modalVisible) {
            this.startListeningToBackButton();
        } else {
            this.stopListeningToBackButton();
        }
        this.setStateSafely({
            modalVisible,
        }, callback);
    }

    setHeight(height: number, callback?: () => void) {
        this.setStateSafely({ height }, callback);
    }

    // Getters
    getModalVisible() {
        return this.state.modalVisible;
    }

    getHeight() {
        return this.state.height;
    }

    getPosition() {
        return Animated.add(this.marginBottom, Animated.multiply(-1, this.dy));
    }

    getInterpolatedColor(): ColorValue {
        const height = this.getHeight();
        const position = this.getPosition();
        return (position: any).interpolate({
            inputRange: [-height, 0],
            outputRange: [UIColor.overlay0(), UIColor.overlay60()],
        });
    }

    // Actions
    // Back button
    backHandler: any;
    startListeningToBackButton() {
        if (Platform.OS !== 'android') {
            return;
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.hide();
            return true;
        });
    }

    stopListeningToBackButton() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    show({
        component,
        headerLeft = null,
        headerRight = null,
        fullWidth = false,
        showHeader = true,
        containerStyle = null,
        onShow = () => {},
        onCancel = () => {},
        modal = false,
    }: Props = {}) {
        // Hide the keyboard before showing
        Keyboard.dismiss();
        // Now show the sheet
        if (this.props.masterSheet) {
            this.component = component;
            this.headerLeft = headerLeft;
            this.headerRight = headerRight;
            this.fullWidth = fullWidth;
            this.showHeader = showHeader;
            this.containerStyle = containerStyle;
            this.onCancel = onCancel;
            this.onShow = onShow;
            this.modal = modal;
        } else {
            this.component = this.props.component;
            this.fullWidth = this.props.fullWidth;
            this.showHeader = this.props.showHeader;
            this.containerStyle = this.props.containerStyle;
            this.headerLeft = this.props.headerLeft;
            this.headerRight = this.props.headerRight;
            this.onCancel = this.props.onCancel;
            this.onShow = this.props.onShow;
            this.modal = this.props.modal;
        }
        this.setModalVisible(true);
    }

    animateShow() {
        const offset = this.getHeight() + this.getSafeAreaInsets().bottom;
        this.marginBottom.setValue(-offset);
        this.slideFromBottom();
    }

    slideFromBottom() {
        // TODO: think how to use `useNativeDriver` here
        Animated.spring(this.marginBottom, {
            toValue: UIConstant.contentOffset(),
            useNativeDriver: false,
        }).start(this.onShow);
    }

    slideToBottom(callback: () => void) {
        const offset = this.getHeight() + this.getSafeAreaInsets().bottom;
        // TODO: think how to use `useNativeDriver` here
        Animated.timing(this.marginBottom, {
            toValue: -offset,
            duration: UIConstant.animationDuration(),
            useNativeDriver: false,
        }).start(callback);
    }

    // same in UIModalController
    returnToTop() {
        // TODO: think how to use `useNativeDriver` here
        Animated.spring(this.dy, {
            toValue: 0,
            velocity: 0,
            tension: 65,
            friction: 10,
            useNativeDriver: false,
        }).start();
    }

    hide(callback: ?() => void = () => {}) {
        this.slideToBottom(() => {
            this.setModalVisible(false, () => {
                this.marginBottom.setValue(-maxScreenHeight);
                this.dy.setValue(0);
                this.setHeight(0);
                setTimeout(() => {
                    if (callback) {
                        callback();
                    }
                }, 100); // Timeout is required!
            });
        });
    }

    // Render
    renderHeader() {
        if (!this.showHeader) {
            return null;
        }
        return (
            <View style={styles.headerArea}>
                <View style={styles.headerLeft}>
                    {this.headerLeft}
                </View>
                <View style={UIStyle.common.flex3()}>
                    <UIModalNavigationBar
                        height={headerHeight}
                        swipeToDismiss
                        dismissStripeStyle={styles.smallDismissStripe}
                        // TODO: think how to use `useNativeDriver` here!
                        onMove={Animated.event([null, { dy: this.dy }], {
                            useNativeDriver: false,
                        })}
                        onRelease={this.onReleaseSwipe}
                        onCancel={this.onHide}
                    />
                </View>

                <View style={styles.headerRight}>
                    {this.headerRight}
                </View>
            </View>
        );
    }
    renderSheet() {
        const containerStyle = this.fullWidth ? styles.fullScreenContainer : styles.slimContainer;
        const styleProps = this.containerStyle;
        const bottom = this.getPosition();
        return (
            <View
                pointerEvents="box-none"
                style={UIStyle.container.screen()}
            >
                <Animated.View
                    style={[
                        UIStyle.container.bottomScreen(),
                        styles.downMenu,
                        containerStyle,
                        styleProps,
                        { bottom },
                    ]}
                    onLayout={this.onLayout}
                >
                    {this.renderHeader()}
                    {this.component}
                </Animated.View>
            </View>
        );
    }

    renderContainer() {
        const paddingBottom = { paddingBottom: this.getSafeAreaInsets().bottom };
        const backgroundColor = this.getInterpolatedColor();
        return (
            <View
                testID="background_layer"
                style={[UIStyle.common.absoluteFillObject(), paddingBottom]}
                collapsable={false}
                ref={this.containerRef}
            >
                <TouchableWithoutFeedback onPress={this.onHide}>
                    <Animated.View
                        style={[UIStyle.common.absoluteFillObject(), { backgroundColor }]}
                    />
                </TouchableWithoutFeedback>
                {this.renderSheet()}
            </View>
        );
    }

    render() {
        if (!this.getModalVisible()) {
            return null;
        }
        if (Platform.OS === 'web' || !this.modal) {
            return this.renderContainer();
        }
        return (
            <Modal
                animationType="fade"
                transparent
                visible={this.getModalVisible()}
            >
                {this.renderContainer()}
            </Modal>
        );
    }
}
