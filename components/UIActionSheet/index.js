import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Platform, View, Modal, StyleSheet, TouchableWithoutFeedback, FlatList, Animated } from 'react-native';

import UIColor from '../UIColor';
import UIConstant from '../UIConstant';
import UILocalized from '../UILocalized';
import UIStyle from '../UIStyle';

import MenuItem from './MenuItem';

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.overlay60(),
        justifyContent: 'flex-end',
    },
    downMenu: {
        position: 'absolute',
        backgroundColor: 'white',
        left: UIConstant.contentOffset(),
        right: UIConstant.contentOffset(),
        bottom: UIConstant.contentOffset(),
        borderRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.contentOffset(),
    },
});

let masterRef = null;

class UIActionSheet extends Component {
    static show(menuItemsList, needCancelItem, onCancelCallback) {
        if (masterRef) {
            masterRef.show(menuItemsList, needCancelItem, onCancelCallback);
        }
    }

    // constructor
    constructor(props) {
        super(props);
        this.menuItemsList = [];
        this.needCancelItem = false;
        this.onCancelCallback = () => {};

        this.state = {
            marginBottom: new Animated.Value(-this.calculateHeight()),
            modalVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.masterActionSheet) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        if (this.props.masterActionSheet) {
            masterRef = null;
        }
    }

    // Events

    // Getters
    getMarginBottom() {
        return this.state.marginBottom;
    }

    getModalVisible() {
        return this.state.modalVisible;
    }

    // Setters
    setModalVisible(modalVisible, callback) {
        this.setState({
            modalVisible,
        }, callback);
    }

    // Actions
    show(menuItemsList = [], needCancelItem = false, onCancelCallback = () => {}) {
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
            }).start();
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
        const height = UIConstant.actionSheetItemHeight();
        const numberItems = this.menuItemsList.length;
        const actionSheetHeight = height * (numberItems + (this.needCancelItem ? 1 : 0));
        return actionSheetHeight + UIConstant.contentOffset() + UIConstant.coverBounceOffset();
    }

    // Render
    renderCancelButton() {
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

    renderContainer() {
        return (
            <TouchableWithoutFeedback onPress={() => this.hide(() => this.onCancelCallback())}>
                <View style={[UIStyle.absoluteFillObject, styles.container]}>
                    <Animated.View
                        style={[
                            styles.downMenu,
                            { bottom: this.getMarginBottom() },
                        ]}
                    >
                        <FlatList
                            data={this.menuItemsList}
                            renderItem={({ item }) => this.renderMenuItem(item)}
                            scrollEnabled={false}
                        />
                        {this.renderCancelButton()}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
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
    masterActionSheet: true,
    menuItemsList: [],
    needCancelItem: true,
    onCancelCallback: () => {},
};

UIActionSheet.propTypes = {
    menuItemsList: PropTypes.arrayOf(Object),
    needCancelItem: PropTypes.bool,
    masterActionSheet: PropTypes.bool,
    onCancelCallback: PropTypes.func,
};
