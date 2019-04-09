// @flow
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UINotice from '../../notifications/UINotice';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.defaultCellHeight(),
    },
    activeBorder: {
        borderTopWidth: 2,
        borderColor: UIColor.primary(),
    },
    border: {
        borderTopWidth: 1,
        borderColor: UIColor.grey1(),
    },
});

export default class UIStepBar extends UIComponent {
    constructor(props) {
        super(props);
        this.insetKey = null;

        this.state = {};
    }

    componentDidMount() {
        super.componentDidMount();
        this.setInsetIfFooter();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.removeInsetIfFooter();
    }

    // Setters

    // Getters

    // Actions
    setInsetIfFooter() {
        if (!this.props.footer) {
            return;
        }
        const height = UIConstant.defaultCellHeight();
        this.insetKey = `UIStepBar~key~${new Date().toLocaleString()}`;
        UINotice.setAdditionalInset(this.insetKey, height);
    }

    removeInsetIfFooter() {
        if (!this.props.footer) {
            return;
        }
        UINotice.removeAdditionalInset(this.insetKey);
    }

    // Render
    render() {
        const { itemsList, activeIndex, onPress } = this.props;
        const items = itemsList.map((item, index) => {
            const borderStyle = index <= activeIndex ? styles.activeBorder : styles.border;
            return (
                <TouchableOpacity
                    key={`stepbar-item-${item}`}
                    style={[UIStyle.centerContainer, borderStyle]}
                    onPress={() => onPress(index)}
                >
                    <Text style={UITextStyle.primaryTinyMedium}>
                        {item}
                    </Text>
                </TouchableOpacity>
            );
        });

        return (
            <View style={[UIStyle.flexRow, styles.container]}>
                {items}
            </View>
        );
    }
}

UIStepBar.defaultProps = {
    footer: false,
    itemsList: [],
    activeIndex: 0,
    onPress: () => {},
};
