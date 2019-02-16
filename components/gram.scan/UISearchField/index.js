// @flow
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UILocalized from '../../../helpers/UILocalized';
import UITextInput from '../../text/UITextInput';

import searchIcon from '../../../assets/ico-search/ico-search.png';

type Props = {
    onChangeSearchExpression: (string) => void,
    onFocus: () => void,
    onBlur: () => void,
};
type State = {
    searchExpression: string,
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        paddingHorizontal: UIConstant.contentOffset(),
        height: UIConstant.bigCellHeight(),
        justifyContent: 'center',
    },
});

const searchFieldStyle = [
    UIStyle.centerLeftContainer,
];

export default class UISearchField extends UIComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            searchExpression: '',
        };
    }

    getSearchExpression() {
        return this.state.searchExpression;
    }

    setSearchExpression(searchExpression: string) {
        this.setStateSafely({ searchExpression });
        this.props.onChangeSearchExpression(searchExpression);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={searchFieldStyle}>
                    <Image source={searchIcon} style={UIStyle.marginRightSmall} />
                    <UITextInput
                        value={this.getSearchExpression()}
                        placeholder={UILocalized.EnterHashTransactionAccountOrBlock}
                        onChangeText={newValue => this.setSearchExpression(newValue)}
                        onFocus={this.props.onFocus}
                        onBlur={this.props.onBlur}
                    />
                </View>
            </View>
        );
    }

    static defaultProps: Props;
}

UISearchField.defaultProps = {
    onChangeSearchExpression: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

