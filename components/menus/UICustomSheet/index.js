// @flow
import React from 'react';
import {
    Platform,
    View,
    Modal,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

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
    defaultContainer: {
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

export type CustomSheetProps = {
    component: ?React$Node,
    masterSheet: boolean,
    onCancelCallback: () => void,
};

export type CustomSheetState = {
    modalVisible: boolean,
    height: number,
};

export default class UICustomSheet<Props, State>
    extends UIComponent<any & CustomSheetProps, CustomSheetState> {
    static showCustom(
        component: React$Node,
        onShowCallback: () => void,
        onCancelCallback: () => void,
    ) {
        if (masterRef) {
            masterRef.showCustom(component, onShowCallback, onCancelCallback);
        }
    }

    static hide(callback: () => void) {
        if (masterRef) {
            masterRef.hide(callback);
        }
    }

    component: ?React$Node;
    marginBottom: AnimatedValue;
    onShowCallback: () => void;
    onCancelCallback: () => void;

    // constructor
    constructor(props: any & CustomSheetProps) {
        super(props);
        this.component = null;
        this.marginBottom = new Animated.Value(-UIConstant.maxScreenHeight());
        this.onShowCallback = () => {};
        this.onCancelCallback = () => {};

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
    onLayout(e: any) {
        const { height } = e.nativeEvent.layout;
        const oldHeight = this.getHeight();
        if (height !== oldHeight) {
            this.setHeight(height, () => {
                if (oldHeight === 0) {
                    this.animateShow();
                }
            });
        }
    }

    // Setters
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
    showCustom(
        component: ?React$Node = null,
        onShowCallback: () => void = () => {},
        onCancelCallback: () => void = () => {},
    ) {
        if (this.props.masterSheet) {
            this.component = component;
            this.onCancelCallback = onCancelCallback;
            this.onShowCallback = onShowCallback;
        } else {
            this.component = this.props.component;
            this.onCancelCallback = this.props.onCancelCallback;
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
        }).start(() => this.onShowCallback());
    }

    slideToBottom(callback: () => void) {
        Animated.timing(this.marginBottom, {
            toValue: -this.getHeight(),
            duration: UIConstant.animationDuration(),
        }).start(callback);
    }

    hide(callback: () => void) {
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
    renderSheet(component: ?React$Node) {
        const containerStyle = this.component ? styles.slimContainer : styles.defaultContainer;
        return (
            <View
                pointerEvents="box-none"
                style={UIStyle.absoluteFillObject}
            >
                <Animated.View
                    style={[
                        UIStyle.bottomScreenContainer,
                        styles.downMenu,
                        containerStyle,
                        { bottom: this.marginBottom },
                    ]}
                    onLayout={e => this.onLayout(e)}
                >
                    {component}
                </Animated.View>
            </View>
        );
    }

    renderContent() {
        if (!this.component) {
            return null;
        }
        return this.renderSheet(this.component);
    }

    renderContainer() {
        return (
            <React.Fragment>
                <TouchableWithoutFeedback onPress={() => this.hide(() => this.onCancelCallback())}>
                    <View style={[UIStyle.absoluteFillObject, styles.container]} />
                </TouchableWithoutFeedback>
                {this.renderContent()}
            </React.Fragment>
        );
    }

    render() {
        if (!this.getModalVisible()) {
            return null;
        }
        if (Platform.OS === 'web') {
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

    static defaultProps: CustomSheetProps;
}

UICustomSheet.defaultProps = {
    component: null,
    masterSheet: true,
    onCancelCallback: () => {},
};
