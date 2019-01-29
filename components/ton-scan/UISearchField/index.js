import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UILocalized from '../../../helpers/UILocalized';
import UITextInput from '../../text/UITextInput';

import searchIcon from '../../../assets/ico-search/ico-search.png';

const styles = StyleSheet.create({
    container: {
        marginTop: UIConstant.mediumContentOffset(),
        // width: '100%',
        height: UIConstant.bigCellHeight(),
        // alignItems: 'center',
        justifyContent: 'center',
    },
});

const searchField = [
    styles.searchField,
    UIStyle.centerLeftContainer,
];

export default class SearchField extends UIComponent {
    render() {
        const { searchExpression, onChangeSearchExpression } = this.props;
        return (
            <View style={styles.container}>
                <View style={searchField}>
                    <Image source={searchIcon} style={UIStyle.marginRightSmall} />
                    <UITextInput
                        value={searchExpression}
                        placeholder={UILocalized.EnterHashTransactionAccountOrBlock}
                        onChangeText={newValue => onChangeSearchExpression(newValue)}
                    />
                </View>
            </View>
        );
    }
}
