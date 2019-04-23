// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

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
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    transparentValue: {
        color: 'transparent',
    },
    trailingValue: {
        color: UIColor.textSecondary(),
    },
    // TODO: Bad practice – padding was selected by eye.
    // Need better solution. (Michael V.)
    androidTextInputPadding: {
        paddingBottom: 6,
        paddingLeft: 4,
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
        onRightButtonPress: () => {
        },
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

    // Events
    onChangeText(newValue: string) {
        const { onChangeText } = this.props;

        // This prevents to type the symbols: + - / * =
        if (newValue.match(/\+|-|\/|\*|=/)) {
            return;
        }

        if (onChangeText) {
            onChangeText(newValue);
        }
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
                testID="amount_input_right_button"
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
        // TODO: Bad practice – fast coding.
        // Need better solution. (Michael V.)
        const style = Platform.OS === 'android'
            ? [styles.trailingValueView, styles.androidTextInputPadding]
            : styles.trailingValueView;
        return (
            <View style={style}>
                <Text
                    style={[this.textInputStyle(), styles.transparentValue]}
                    selectable={false}
                >
                    {value}
                    <Text
                        style={styles.trailingValue}
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
