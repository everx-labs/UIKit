// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { View, StyleSheet, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextInput from '../../input/UITextInput';

import searchIcon from '../../../assets/ico-search/ico-search.png';

type Props = {
    containerStyle?: StylePropType,
    placeholder: string,
    onChangeSearchExpression: (string) => void,
    onFocus: () => void,
    onBlur: () => void,
};
type State = {
    searchExpression: string,
};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
    },
});

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

    render() {
        const { onFocus, onBlur } = this.props;
        return (
            <View style={[
                styles.container,
                UIStyle.centerLeftContainer,
                this.props.containerStyle,
            ]}
            >
                <Image source={searchIcon} style={UIStyle.marginRightSmall} />
                <UITextInput
                    value={this.getSearchExpression()}
                    placeholder={this.props.placeholder}
                    onChangeText={newValue => this.setSearchExpression(newValue)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </View>
        );
    }

    static defaultProps: Props;
}

UISearchField.defaultProps = {
    placeholder: '',
    onChangeSearchExpression: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

