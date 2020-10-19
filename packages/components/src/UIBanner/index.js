// @flow
import React from 'react';
import {
    StyleSheet, View,
} from 'react-native';

import {
    UIConstant,
    UIColor,
    UIStyle,
} from '@uikit/core';
import { UIComponent, UILabel } from '@uikit/components';

type Props = {
    text: ?string,
};

type State = {};

const styles = StyleSheet.create({
    containerStyle: {
        marginTop: UIConstant.smallContentOffset(),
        marginBottom: UIConstant.smallContentOffset(),
        marginLeft: UIConstant.contentOffset(),
        marginRight: UIConstant.contentOffset(),
        padding: UIConstant.normalContentOffset(),
        borderRadius: UIConstant.borderRadius(),
    },
    textStyle: {
        color: UIColor.white(),
    },
});

export default class UIBanner extends UIComponent<Props, State> {
    render() {
        return (
            <View
                style={[
                    styles.containerStyle,
                    UIStyle.color.getBackgroundColorStyle(UIColor.backgroundNegative()),
                    { display: this.props.text ? 'flex' : 'none' },
                ]}
            >
                <UILabel
                    role={UILabel.Role.SmallMedium}
                    text={this.props.text || ''}
                    style={styles.textStyle}
                />
            </View>
        );
    }
}
