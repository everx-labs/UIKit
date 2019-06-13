// @flow
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';
import UITextStyle from '../../../helpers/UITextStyle';

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.error(),
        color: UIColor.white(),
        minWidth: 17,
        textAlign: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
});

type Props = {
    containerStyle: ViewStyleProp,
    value: number,
    trimByValue: number,
};

type State = {};

export default class UINotificationBadge extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        value: 0,
        trimByValue: 99,
    }

    // Getters
    getBadgeValue(): ?string {
        const { value, trimByValue } = this.props;
        if (value > trimByValue) {
            return `${trimByValue}+`;
        } else if (value === 0) {
            return null;
        }
        return `${value}`;
    }

    // Render
    render() {
        const value = this.getBadgeValue();
        if (!value) {
            return null;
        }
        return (
            <Text
                style={[
                    UITextStyle.primaryTinyRegular,
                    styles.container,
                    this.props.containerStyle,
                ]}
                pointerEvents="none"
            >
                {value}
            </Text>
        );
    }
}
