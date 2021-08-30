// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

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

// @deprecated
class UIListHeader extends UIComponent<Props, State> {
    static defaultProps = {
        title: '',
        containerStyle: null,
    };

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
                <UILabel
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.TitleMedium}
                >
                    {this.getTitle()}
                </UILabel>
            </View>
        );
    }
}

export default UIListHeader;
