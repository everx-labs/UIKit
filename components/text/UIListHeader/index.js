// @flow
import React from 'react';

import { View, StyleSheet, Text } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    listHeader: {
        backgroundColor: 'transparent',
        height: UIConstant.buttonHeight(),
    },
});

type Props = {
    title: string,
    containerStyle: ViewStyleProp,
}

type State = {
    //
}

class UIListHeader extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        containerStyle: null,
    }

    // Getters
    getTitle() {
        return this.props.title;
    }

    // Render
    render() {
        return (
            <View
                style={[
                    UIStyle.common.centerLeftContainer(),
                    styles.listHeader,
                    this.props.containerStyle,
                ]}
            >
                <Text style={UIStyle.text.primaryAccentBold()}>
                    {this.getTitle()}
                </Text>
            </View>
        );
    }
}

export default UIListHeader;
