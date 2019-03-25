import React from 'react';
import PropTypes from 'prop-types';

import { Platform, View, Modal, StyleSheet, TouchableWithoutFeedback, FlatList, Animated } from 'react-native';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

import MenuItem from './MenuItem';

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.overlay60(),
        justifyContent: 'flex-end',
    },
    contentContainer: {
        paddingVertical: UIConstant.contentOffset(),
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
        maxWidth: UIConstant.elasticWidthHalfNormal(),
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});

let masterRef = null;

class UIActionSheet extends UIComponent {
    static show(menuItemsList, needCancelItem, onCancelCallback) {
        if (masterRef) {
            masterRef.show(menuItemsList, needCancelItem, onCancelCallback);
        }
    }

    static showCustom(component, onShowCallback, onCancelCallback) {
        if (masterRef) {
            masterRef.showCustom(component, onShowCallback, onCancelCallback);
        }
    }

    static hide() {
        if (masterRef) {
            masterRef.hide();
        }
    }

    // constructor
    constructor(props) {
        super(props);
        this.component = null;
        this.menuItemsList = [];
        this.needCancelItem = true;
        this.onCancelCallback = () => {};

        this.state = {
            marginBottom: new Animated.Value(-this.calculateHeight()),
            modalVisible: false,
            height: 0,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterActionSheet) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterActionSheet) {
            masterRef = null;
        }
    }

    // Events
    onLayout(e) {
        const { height } = e.nativeEvent.layout;
        if (height !== this.getHeight()) {
            this.setHeight(height);
        }
    }

    // Getters
    getMarginBottom() {
        return this.state.marginBottom;
    }

    getModalVisible() {
        return this.state.modalVisible;
    }

    getHeight() {
        return this.state.height;
    }

    // Setters
    setModalVisible(modalVisible, callback) {
        this.setStateSafely({
            modalVisible,
        }, callback);
    }

    setHeight(height) {
        this.setStateSafely({ height });
    }

    // Actions
    show(menuItemsList = [], needCancelItem = true, onShowCallback = () => {}, onCancelCallback = () => {}) {
        if (this.props.masterActionSheet) {
            this.menuItemsList = menuItemsList;
            this.needCancelItem = needCancelItem;
            this.onCancelCallback = onCancelCallback;
        } else {
            this.menuItemsList = this.props.menuItemsList;
            this.needCancelItem = this.props.needCancelItem;
            this.onCancelCallback = this.props.onCancelCallback;
        }
        this.setModalVisible(true, () => {
            Animated.spring(this.state.marginBottom, {
                toValue: UIConstant.contentOffset(),
            }).start(() => onShowCallback());
        });
    }

    showCustom(component = null, onShowCallback = () => {}, onCancelCallback = () => {}) {
        if (this.props.masterActionSheet) {
            this.component = component;
            this.onCancelCallback = onCancelCallback;
        } else {
            this.component = this.props.component;
            this.onCancelCallback = this.props.onCancelCallback;
        }
        this.setModalVisible(true, () => {
            Animated.spring(this.state.marginBottom, {
                toValue: UIConstant.contentOffset(),
            }).start(() => onShowCallback());
        });
    }

    hide(callback) {
        Animated.timing(this.state.marginBottom, {
            toValue: -this.calculateHeight(),
            duration: UIConstant.animationDuration(),
        }).start(() => {
            this.setModalVisible(false, () => {
                setTimeout(() => {
                    if (callback) {
                        callback();
                    }
                }, 100); // Timeout is required!
            });
        });
    }

    calculateHeight() {
        if (this.component) {
            return this.getHeight();
        }
        const height = UIConstant.actionSheetItemHeight();
        const numberItems = this.menuItemsList.length;
        const actionSheetHeight = height * (numberItems + (this.needCancelItem ? 1 : 0));
        return actionSheetHeight + UIConstant.contentOffset();
    }

    // Render
    renderCancelItem() {
        if (!this.needCancelItem) {
            return null;
        }
        return (
            <MenuItem
                title={UILocalized.Cancel}
                onPress={() => this.hide(() => this.onCancelCallback())}
            />
        );
    }

    renderMenuItem(item) {
        return (
            <MenuItem
                {...item}
                onPress={() => this.hide(() => item.onPress())}
                textStyle={{ color: UIColor.primary() }}
            />
        );
    }

    renderSheet(component) {
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
                        { bottom: this.getMarginBottom() },
                    ]}
                >
                    {component}
                </Animated.View>
            </View>
        );
    }

    renderCustomContent() {
        if (!this.component) {
            return null;
        }
        const content = (
            <View
                style={styles.contentContainer}
                onLayout={e => this.onLayout(e)}
            >
                {this.component}
            </View>
        );
        return this.renderSheet(content);
    }

    renderMenuContent() {
        if (this.component) {
            return null;
        }
        const content = (
            <React.Fragment>
                <FlatList
                    data={this.menuItemsList}
                    renderItem={({ item }) => this.renderMenuItem(item)}
                    scrollEnabled={false}
                />
                {this.renderCancelItem()}
            </React.Fragment>
        );
        return this.renderSheet(content);
    }

    renderContainer() {
        return (
            <React.Fragment>
                <TouchableWithoutFeedback onPress={() => this.hide(() => this.onCancelCallback())}>
                    <View style={[UIStyle.absoluteFillObject, styles.container]}>
                        {this.renderMenuContent()}
                    </View>
                </TouchableWithoutFeedback>
                {this.renderCustomContent()}
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
}

export default UIActionSheet;

UIActionSheet.defaultProps = {
    component: null,
    masterActionSheet: true,
    menuItemsList: [],
    needCancelItem: true,
    onCancelCallback: () => {},
};

UIActionSheet.propTypes = {
    menuItemsList: PropTypes.arrayOf(Object),
    needCancelItem: PropTypes.bool,
    onCancelCallback: PropTypes.func,
    masterActionSheet: PropTypes.bool,
};
