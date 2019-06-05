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
        marginTop: -1,
        borderColor: UIColor.primary(),
    },
    border: {
        borderTopWidth: 1,
        borderColor: UIColor.grey1(),
    },
});

type Props = {
    footer: boolean,
    itemsList: string[],
    activeIndex: number,
    onPress: (number) => void,
};
type State = {};

export default class UIStepBar extends UIComponent<Props, State> {
    insetKey: string;

    constructor(props: Props) {
        super(props);
        this.insetKey = '';

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
            const scrolledItemsCount = Math.trunc(activeIndex);
            const borderStyle = index <= scrolledItemsCount ? styles.activeBorder : null;
            let width = '100%';
            if (index === scrolledItemsCount) {
                width = `${(activeIndex - scrolledItemsCount) * 100}%`;
            }
            return (
                <View style={UIStyle.Common.flex()} key={`stepbar-item-${item}`}>
                    <View style={[borderStyle, { width }]} />
                    <TouchableOpacity
                        style={[UIStyle.centerContainer]}
                        onPress={() => onPress(index)}
                    >
                        <Text style={UITextStyle.primaryTinyMedium}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        });

        return (
            <View style={UIStyle.Common.flex(), styles.border}>
                <View style={[UIStyle.flexRow, styles.container]}>
                    {items}
                </View>
            </View>
        );
    }

    static defaultProps: Props;
}

UIStepBar.defaultProps = {
    footer: false,
    itemsList: [],
    activeIndex: 0,
    onPress: () => {},
};
