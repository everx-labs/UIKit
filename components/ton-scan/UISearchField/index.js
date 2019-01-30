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
        // marginTop: UIConstant.mediumContentOffset(),
        width: '50%',
        paddingHorizontal: UIConstant.contentOffset(),
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
    constructor(props) {
        super(props);

        this.state = {
            searchExpression: '',
        };
    }

    getSearchExpression() {
        return this.state.searchExpression;
    }

    setSearchExpression(searchExpression) {
        this.setStateSafely({ searchExpression });
        this.props.onChangeSearchExpression(searchExpression);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={searchField}>
                    <Image source={searchIcon} style={UIStyle.marginRightSmall} />
                    <UITextInput
                        value={this.getSearchExpression()}
                        placeholder={UILocalized.EnterHashTransactionAccountOrBlock}
                        onChangeText={newValue => this.setSearchExpression(newValue)}
                    />
                </View>
            </View>
        );
    }
}
