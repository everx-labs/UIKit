// @flow
import React from 'react';
import {
    Animated,
    Modal,
    Platform,
    LayoutAnimation,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIController from '../../../controllers/UIController';

import type { ContentInset, AnimationParameters } from '../../../controllers/UIController';

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.overlay60(),
        justifyContent: 'flex-end',
    },
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
        paddingVertical: UIConstant.contentOffset(),
        width: '100%',
        maxWidth: UIConstant.elasticWidthHalfNormal(),
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});

const maxScreenHeight = UIConstant.maxScreenHeight();

let masterRef = null;

export type Props = any & {
    modal?: boolean,
    component: ?React$Node,
    fullWidth?: boolean,
    masterSheet?: boolean,
    onShow?: () => void,
    onCancel?: () => void,
};

export type State = {
    modalVisible: boolean,
    height: number,
};

export default class UICustomSheet extends UIController<Props, State> {
    static show(args: any) {
        if (masterRef) {
            if (!args.component) {
                masterRef.show({ component: args });
            } else {
                masterRef.show(args);
            }
        }
    }

    static hide(callback: () => void) {
        if (masterRef) {
            masterRef.hide(callback);
        }
    }

    component: ?React$Node;
    fullWidth: ?boolean;
    marginBottom: AnimatedValue;
    onShow: ?() => void;
    onCancel: ?() => void;
    modal: ?boolean;

    // constructor
    constructor(props: Props) {
        super(props);
        this.component = null;
        this.fullWidth = false;
        this.marginBottom = new Animated.Value(-UIConstant.maxScreenHeight());
        this.onShow = () => {};
        this.onCancel = () => {};
        this.modal = true;

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

    // Setters
    setContentInset(contentInset: ContentInset, animation: ?AnimationParameters) {
        super.setContentInset(contentInset, animation);
        const { duration, easing } = animation || {
            duration: UIConstant.animationDuration(),
            easing: LayoutAnimation.Types.keyboard,
        };
        Animated.timing(this.marginBottom, {
            toValue: contentInset.bottom + UIConstant.contentOffset(),
            duration,
            easing: UIController.getEasingFunction(easing),
        }).start();
    }

    setModalVisible(modalVisible: boolean, callback?: () => void) {
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

    // Actions
    show({
        component,
        fullWidth = false,
        onShow = () => {},
        onCancel = () => {},
        modal = false,
    }: Props = {}) {
        if (this.props.masterSheet) {
            this.component = component;
            this.fullWidth = fullWidth;
            this.onCancel = onCancel;
            this.onShow = onShow;
            this.modal = modal;
        } else {
            this.component = this.props.component;
            this.fullWidth = this.props.fullWidth;
            this.onCancel = this.props.onCancel;
            this.onShow = this.props.onShow;
            this.modal = this.props.modal;
        }
        this.setModalVisible(true);
    }

    animateShow() {
        const height = this.getHeight();
        this.marginBottom.setValue(-height);
        this.slideFromBottom();
    }

    slideFromBottom() {
        Animated.spring(this.marginBottom, {
            toValue: UIConstant.contentOffset(),
        }).start(this.onShow);
    }

    slideToBottom(callback: () => void) {
        Animated.timing(this.marginBottom, {
            toValue: -this.getHeight(),
            duration: UIConstant.animationDuration(),
        }).start(callback);
    }

    hide(callback: ?() => void = () => {}) {
        this.slideToBottom(() => {
            this.setModalVisible(false, () => {
                this.marginBottom.setValue(-maxScreenHeight);
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
    renderSheet() {
        const containerStyle = this.fullWidth ? styles.fullScreenContainer : styles.slimContainer;
        return (
            <View
                pointerEvents="box-none"
                style={UIStyle.screenContainer}
            >
                <Animated.View
                    style={[
                        UIStyle.bottomScreenContainer,
                        styles.downMenu,
                        containerStyle,
                        { bottom: this.marginBottom },
                    ]}
                    onLayout={this.onLayout}
                >
                    {this.component}
                </Animated.View>
            </View>
        );
    }

    renderContainer() {
        return (
            <React.Fragment>
                <TouchableWithoutFeedback onPress={() => this.hide(this.onCancel)}>
                    <View style={[UIStyle.absoluteFillObject, styles.container]} />
                </TouchableWithoutFeedback>
                {this.renderSheet()}
            </React.Fragment>
        );
    }

    renderSafely() {
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

    static defaultProps: Props;
}

UICustomSheet.defaultProps = {
    component: null,
    masterSheet: true,
    fullWidth: false,
    onShow: () => {},
    onCancel: () => {},
    modal: true,
};
