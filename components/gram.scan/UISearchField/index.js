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
    screenWidth: number,
    onChangeSearchExpression: (string) => void,
    onFocus: () => void,
    onBlur: () => void,
    onLayout: (e: ?any) => void,
};
type State = {
    searchExpression: string,
};

const styles = StyleSheet.create({
    container: {
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

    // Setters
    setSearchExpression(searchExpression: string) {
        this.setStateSafely({ searchExpression });
        this.props.onChangeSearchExpression(searchExpression);
    }

    // Getters
    getSearchExpression() {
        return this.state.searchExpression;
    }

    getContentStyle() {
        return this.props.screenWidth >= UIConstant.elasticWidthBroad()
            ? UIStyle.halfWidthContainer
            : UIStyle.fullWidthContainer;
    }

    render() {
        const contentStyle = this.getContentStyle();
        return (
            <View
                onLayout={e => this.props.onLayout(e)}
                style={[styles.container, contentStyle]}
            >
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
    screenWidth: 0,
    onChangeSearchExpression: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onLayout: () => {},
};

