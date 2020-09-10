// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import UIPureComponent from '../../UIPureComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';

import { TypeOfActionDirection } from '../extras';
import type { TypeOfActionType, TypeOfActionDirectionType } from '../extras';

type Props = {
    text: string,
    typeOfAction: TypeOfActionType,
    onPress?: () => void,
    testID?: string | null,
    actionDirection: TypeOfActionDirectionType,
}

type State = {
    data: any,
}

const styles = StyleSheet.create({
    common: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: UIColor.primary(),
        marginVertical: UIConstant.tinyContentOffset(),
    },
    container: {
        width: '100%',
        height: UIConstant.mediumButtonHeight(),
        borderRadius: UIConstant.smallBorderRadius(),
    },
    containerUp: {
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        height: UIConstant.smallButtonHeight(),
        borderBottomRightRadius: UIConstant.borderRadius(),
        borderBottomLeftRadius: UIConstant.borderRadius(),
        borderTopRightRadius: UIConstant.borderRadius(),
    },
    containerDown: {
        paddingHorizontal: UIConstant.spaciousContentOffset(),
        height: UIConstant.smallButtonHeight(),
        borderBottomLeftRadius: UIConstant.borderRadius(),
        borderTopLeftRadius: UIConstant.borderRadius(),
        borderTopRightRadius: UIConstant.borderRadius(),
    },
    text: {
        color: UIColor.primary(),
    },
});

export default class UIChatActionCell extends UIPureComponent<Props, State> {
    static defaultProps = {
        text: 'Buy Grams',
        onPress: () => {},
        actionDirection: TypeOfActionDirection.None,
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
    };

    // Getters
    getText(): string {
        return this.props.text;
    }

    getActionDirection(): TypeOfActionDirectionType {
        return this.props.actionDirection;
    }

    getContainerStyle() {
        const actionDirection = this.getActionDirection();
        if (actionDirection === TypeOfActionDirection.Up) {
            return styles.containerUp;
        } else if (actionDirection === TypeOfActionDirection.Down) {
            return styles.containerDown;
        }
        return styles.container;
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
        const testID = this.props.testID ? this.props.testID : 'chat_action_cell_default';
        const containerStyle = this.getContainerStyle();
        return (
            <TouchableOpacity
                testID={testID}
                style={[styles.common, containerStyle]}
                onPress={this.onPress}
            >
                {this.renderText()}
            </TouchableOpacity>
        );
    }
}
