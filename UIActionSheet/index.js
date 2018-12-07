import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Modal, StyleSheet, TouchableWithoutFeedback, FlatList, Animated } from 'react-native';

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
        backgroundColor: 'white',
        borderRadius: UIConstant.borderRadius(),
        paddingBottom: UIConstant.coverBounceOffset(),
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
        this.menuItemsList = menuItemsList;
        this.needCancelItem = needCancelItem;
        this.onCancelCallback = onCancelCallback;
        this.setModalVisible(true, () => {
            Animated.spring(this.state.marginBottom, {
                toValue: -UIConstant.coverBounceOffset(),
            }).start();
        });
    }

    hide() {
        Animated.timing(this.state.marginBottom, {
            toValue: -this.calculateHeight(),
            duration: UIConstant.animationDuration(),
        }).start(() => {
            this.setModalVisible(false, () => {
                setTimeout(() => {
                    if (this.onCancelCallback) {
                        this.onCancelCallback();
                    }
                }, 100); // Timeout is required!
            });
        });
    }

    calculateHeight() {
        const height = UIConstant.actionSheetItemHeight();
        const numberItems = this.menuItemsList.length;
        const actionSheetHeight = height * (numberItems + (this.needCancelItem ? 1 : 0));
        return actionSheetHeight + UIConstant.coverBounceOffset();
    }

    // Render
    renderCancelButton() {
        if (!this.needCancelItem) {
            return null;
        }
        return (
            <MenuItem
                title={UILocalized.Cancel}
                onPress={() => this.hide()}
                textStyle={{ color: UIColor.textPrimary() }}
            />
        );
    }

    renderMenuItem(item) {
        return (
            <MenuItem
                {...item}
                onPress={() => this.hide(() => item.onPress())}
            />
        );
    }

    renderContainer() {
        return (
            <TouchableWithoutFeedback onPress={() => this.hide()}>
                <View style={[UIStyle.absoluteFillObject, styles.container]}>
                    <Animated.View
                        style={[
                            UIStyle.bottomScreenContainer,
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
};

UIActionSheet.propTypes = {
    masterActionSheet: PropTypes.bool,
};
