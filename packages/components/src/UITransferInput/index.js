// @flow
import React from 'react';
import { View } from 'react-native';
import BigNumber from 'bignumber.js';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIConstant,
    UIFunction,
    UILocalized,
    UIStyle,
} from '@uikit/core';
import type { NumberParts, StringLocaleInfo } from '@uikit/core/UIFunction';
import type { UIColorData } from '@uikit/core/UIColor/UIColorTypes';
import type { BigNum } from '@uikit/core/types/BigNum';

import UIComponent from '../UIComponent';
import UIAmountInput from '../UIAmountInput';
import UIDetailsView from '../UIDetailsView';

type Props = {
    containerStyle?: ViewStyleProp,
    hidePlaceholder?: boolean,
    placeholder?: string,
    onSubmitEditing?: () => void,
    autoFocus?: boolean,
    button?: Object,
    value?: ?BigNum,
    token?: string | React$Element<any>,
    comment?: string,
    commentRight?: string,
    commentColor?: UIColorData,
    maxDecimals: number,
    onValueChange?: (number: ?BigNum) => void,
    onBlur?: () => void,
    rightButton?: string,
    onRightButtonPress?: () => void,
    testID?: string,
    minValue?: BigNum,
    minValueMessage?: string,
    maxValue?: BigNum,
    maxValueMessage?: string,
    fees?: BigNum,
    localeInfo: StringLocaleInfo,
    customComponent?: React$Node,
};

type State = {
    valueString: string,
    inputPlaceholder: string,
};

const decimalDigits = 3;
const options = {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
};

export default class UITransferInput extends UIComponent<Props, State> {
    static defaultProps = {
        value: undefined,
        maxDecimals: UIConstant.maxDecimalDigits(),
        minValue: undefined,
        maxValue: undefined,
        fees: new BigNumber(0),
    };

    amountInput: ?UIAmountInput;
    constructor(props: Props) {
        super(props);
        this.state = {
            valueString: '',
            inputPlaceholder: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.parseValue(this.getValue());
    }

    componentDidUpdate(prevProps: Props) {
        const newValue = this.getValue();
        const { localeInfo } = this.props;
        const localizedSeparator = localeInfo.numbers.decimal;
        const decG = localeInfo.numbers.decimalGrouping;

        if (
            prevProps.value !== newValue
            && !new RegExp(`\\${localizedSeparator}(\\d(\\${decG})?){0,}$`)
                .test(this.state.valueString)
        ) {
            this.parseValue(newValue);
        }
    }

    // Getters
    getMaxDecimals(): number {
        return this.props.maxDecimals;
    }

    getValue(): ?BigNum {
        return this.props.value;
    }

    getMinValueMessage(): ?string {
        const { minValue, minValueMessage, value } = this.props;

        if (value == null) {
            return UILocalized.formatString(minValueMessage, minValue);
        }
        return minValue != null && minValueMessage != null && value.lt(minValue)
            ? UILocalized.formatString(minValueMessage, minValue)
            : undefined;
    }

    getMaxValueMessage(): ?string {
        // check if balance after transaction < operation fee --> show alert
        const { maxValue, maxValueMessage, value } = this.props;
        const fees = this.getFees();

        return maxValue != null
            && maxValueMessage != null
            && value != null
            && value.plus(fees).gte(maxValue.minus(fees))
            ? maxValueMessage
            : undefined;
    }

    getFees(): BigNum {
        return this.props.fees || new BigNumber(0);
    }

    // Setters

    // Events
    onChangeText = (text: string) => {
        const parsed = this.parseText(text);
        if (!parsed) {
            return;
        }

        this.setStateSafely({ valueString: parsed.valueString });

        const newValue = parsed.value;
        if (this.props.onValueChange && this.getValue() !== newValue) {
            this.props.onValueChange(newValue);
        }
    };

    onBlur = () => {
        this.parseValue(this.props.value);
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    // Actions
    focus() {
        if (this.amountInput) {
            this.amountInput.focus();
        }
    }

    blur() {
        if (this.amountInput) {
            this.amountInput.blur();
        }
    }

    // Helpers
    parseText(text: string): ?{
        value: ?BigNum,
        valueString: string,
        inputPlaceholder: string,
    } {
        const { localeInfo } = this.props;
        const localizedSeparator = localeInfo.numbers.decimal;
        let parts: ?NumberParts;
        try {
            const isNormalized = !Number.isNaN(Number(text));
            parts = UIFunction.getNumberParts(
                text,
                localeInfo,
                undefined,
                isNormalized, // here possible normalized and not normalized strings
            );
        } catch (error) {
            parts = null;
        }
        if (!parts) {
            return null;
        }
        const value = !text ? undefined : parts.value;
        const valueString = !text ? '' : parts.valueString;
        const zeros = Math.min(UIConstant.minDecimalDigits(), this.getMaxDecimals());
        const decimalPlaceholder = '0'.repeat(zeros);
        const inputPlaceholder = `0${localizedSeparator}${decimalPlaceholder}`;
        return { value, valueString, inputPlaceholder };
    }

    parseValue(value: ?BigNum) {
        const text = value === undefined || value === null
            ? ''
            : UIFunction.getNumberString(value);
        const { valueString, inputPlaceholder } = this.parseText(text) || {
            valueString: text,
            inputPlaceholder: '',
        };

        this.setStateSafely({ valueString, inputPlaceholder });
    }

    // Render
    renderInput() {
        const {
            containerStyle,
            hidePlaceholder,
            placeholder,
            comment,
            commentRight,
            commentColor,
            onSubmitEditing,
            autoFocus,
            button,
            rightButton,
            onRightButtonPress,
            token,
            testID,
        } = this.props;
        const { valueString, inputPlaceholder } = this.state;
        const testIDProp = testID ? { testID } : null;

        return (
            <UIAmountInput
                {...this.props}
                {...testIDProp}
                ref={(component) => { this.amountInput = component; }}
                autoCapitalize="none"
                button={button}
                maxLines={1}
                containerStyle={containerStyle}
                hidePlaceholder={hidePlaceholder}
                placeholder={placeholder}
                inputPlaceholder={inputPlaceholder}
                value={valueString}
                // props.comment have maximum priority, because it's external logic (usually errors)
                comment={comment || this.getMinValueMessage() || this.getMaxValueMessage()}
                commentRight={commentRight}
                commentColor={commentColor}
                onSubmitEditing={onSubmitEditing}
                autoFocus={autoFocus}
                rightButton={rightButton}
                onRightButtonPress={onRightButtonPress}
                onChangeText={this.onChangeText}
                onBlur={this.onBlur}
                token={token}
            />
        );
    }

    renderCustomComponent() {
        return this.props.customComponent || null;
    }

    renderInfoBlock() {
        if (!this.getFees() || this.getFees().eq(new BigNumber(0))) {
            return null;
        }
        return (
            <View style={UIStyle.flex.row()}>
                {this.renderFees()}
                {this.renderOperationTime()}
            </View>
        );
    }

    renderFees() {
        const { localeInfo } = this.props;
        return (
            <UIDetailsView
                testID="fees"
                reversed
                disabled
                value={UILocalized.formatString(
                    UILocalized.feeAmount,
                    UILocalized.amountToLocale(this.getFees(), localeInfo, options),
                )}
                comments={UILocalized.fee}
                commentsStyle={UIStyle.text.tertiaryTinyRegular()}
                containerStyle={[UIStyle.margin.topDefault(), UIStyle.common.flex2()]}
                textStyle={UIStyle.text.secondaryBodyRegular()}
            />
        );
    }

    renderOperationTime() {
        return (
            <UIDetailsView
                testID="operation_time"
                reversed
                disabled
                value={UILocalized.immediately}
                comments={UILocalized.operationTime}
                commentsStyle={UIStyle.text.tertiaryTinyRegular()}
                containerStyle={[UIStyle.margin.topDefault(), UIStyle.common.flex2()]}
                textStyle={UIStyle.text.secondaryBodyRegular()}
            />
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderInput()}
                {this.renderCustomComponent()}
                {this.renderInfoBlock()}
            </React.Fragment>
        );
    }
}
