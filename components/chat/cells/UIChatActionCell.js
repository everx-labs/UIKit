// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import type { Layout } from 'react-native/Libraries/Types/CoreEventTypes';

import UIPureComponent from '../../UIPureComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';

import { TypeOfAction } from '../extras';

import type { TypeOfActionType } from '../extras';

type Props = {
    text: string,
    typeOfAction: TypeOfActionType,
    onPress?: (action: TypeOfActionType) => void,
}

type State = {
    data: any,
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        width: '100%',
        height: UIConstant.mediumButtonHeight(),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: UIConstant.smallBorderRadius(),
        borderColor: UIColor.primary(),
    },
    text: {
        color: UIColor.primary(),
    },
});

export default class UIChatActionCell extends UIPureComponent<Props, State> {
    static defaultProps = {
        text: 'Buy Grams',
        onPress: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            data: null,
        };
    }

    // Events
    onPress = () => {
        const { onPress } = this.props;
        if (onPress) {
            onPress();
        }
    }

    // Getters
    getText(): string {
        return this.props.text;
    }

    // Render
    renderText() {
        return (
            <Text style={[UITextStyle.primaryCaptionMedium, styles.text]}>
                {this.getText()}
            </Text>
        );
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.onPress}
            >
                {this.renderText()}
            </TouchableOpacity>
        );
    }
}
