// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import UIDetailsInput from '../UIDetailsInput';

import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';

import type { DetailsProps, DetailsState } from '../UIDetailsInput';

const styles = StyleSheet.create({
    trailingValueView: {
        zIndex: -1,
        position: 'absolute',
        top: null,
        left: 0,
        bottom: null,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    transparentValue: {
        color: 'transparent',
    },
    trailingValue: {
        color: UIColor.textSecondary(),
    },
});

type Props = DetailsProps & {
    containerStyle?: StylePropType,
    trailingValue?: string,
    rightButton?: string,
    rightButtonDisabled: boolean,
    onRightButtonPress?: () => void,
};
type State = DetailsState & {};

export default class UIAmountInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        containerStyle: {},
        trailingValue: '',
        rightButton: '',
        rightButtonDisabled: false,
        onRightButtonPress: () => {},
    };

    // Getters
    containerStyle() {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? { flex: 1 } : null;
        return flex;
    }

    keyboardType() {
        return 'decimal-pad';
    }

    // Render
    renderRightButton() {
        const {
            rightButton,
            onRightButtonPress, rightButtonDisabled,
        } = this.props;
        if (!rightButton || rightButton.length === 0) {
            return null;
        }

        const defaultTitleStyle = rightButtonDisabled ?
            UITextStyle.secondarySmallMedium : UITextStyle.actionSmallMedium;
        return (
            <TouchableOpacity
                disabled={rightButtonDisabled}
                onPress={onRightButtonPress}
            >
                <Text style={[UITextStyle.secondaryBodyRegular, defaultTitleStyle]}>
                    {rightButton}
                </Text>
            </TouchableOpacity>
        );
    }

    renderTrailingValue() {
        const { value, trailingValue } = this.props;
        if ((trailingValue?.length || 0) === 0) {
            return null;
        }

        return (
            <View style={styles.trailingValueView}>
                <Text
                    style={[this.textInputStyle(), styles.transparentValue]}
                    selectable={false}
                >
                    {value}
                    <Text
                        style={[this.textInputStyle(), styles.trailingValue]}
                        selectable={false}
                    >
                        {trailingValue}
                    </Text>
                </Text>
            </View>
        );
    }

    renderTexFragment() {
        return (
            <React.Fragment>
                {this.renderTextInput()}
                {this.renderTrailingValue()}
                {this.renderRightButton()}
            </React.Fragment>
        );
    }
}
