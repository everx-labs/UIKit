// @flow
import React from 'react';
import {
    StyleSheet, View, Text,
} from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';

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
        backgroundColor: UIColor.redE71717(),
        borderRadius: UIConstant.borderRadius(),
    },
    textStyle: {
        color: UIColor.white(),
        ...UIFont.smallMedium(),
    },
});

export default class UIBanner extends UIComponent<Props, State> {
    render() {
        return (
            <View
                style={[
                    styles.containerStyle,
                    { display: this.props.text ? 'flex' : 'none' },
                ]}
            >
                <Text style={styles.textStyle}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}
