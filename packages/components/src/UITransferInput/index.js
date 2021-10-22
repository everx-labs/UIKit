// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { View } from 'react-native';
import BigNumber from 'bignumber.js';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIConstant, UIFunction, UIStyle } from '@tonlabs/uikit.core';
import type { NumberParts, StringLocaleInfo, BigNum, UIColorData } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';

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
    minDecimals: number,
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

export default class UITransferInput extends UIComponent<Props, State> {
    static defaultProps = {
        value: undefined,
        maxDecimals: UIConstant.maxDecimalDigits(),
        minDecimals: UIConstant.minDecimalDigits(),
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
            prevProps.value !== newValue &&
            !new RegExp(`\\${localizedSeparator}(\\d(\\${decG})?){0,}$`).test(
                this.state.valueString,
            )
        ) {
            this.parseValue(newValue);
        }
    }

    // Getters
    getMaxDecimals(): number {
        return this.props.maxDecimals;
    }

    getMinDecimals(): number {
        return this.props.minDecimals;
    }

    getValue(): ?BigNum {
        return this.props.value;
    }

    getMinValueMessage(): ?string {
        const { minValue, minValueMessage, value } = this.props;

        if (value == null && minValueMessage != null) {
            return uiLocalized.formatString(minValueMessage, minValue);
        }

        return minValueMessage != null && minValue != null && value != null && value.lt(minValue)
            ? uiLocalized.formatString(minValueMessage, minValue)
            : undefined;
    }

    getMaxValueMessage(): ?string {
        // check if balance after transaction < operation fee --> show alert
        const { maxValue, maxValueMessage, value } = this.props;
        const fees = this.getFees();

        return maxValue != null &&
            maxValueMessage != null &&
            value != null &&
            value.plus(fees).gte(maxValue.minus(fees))
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
        const zeros = Math.min(this.getMinDecimals(), this.getMaxDecimals());
        const decimalPlaceholder = '0'.repeat(zeros);
        const inputPlaceholder = `0${localizedSeparator}${decimalPlaceholder}`;
        return { value, valueString, inputPlaceholder };
    }

    parseValue(value: ?BigNum) {
        const text = value === undefined || value === null ? '' : UIFunction.getNumberString(value);
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
                ref={component => {
                    this.amountInput = component;
                }}
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

    renderFractional(stringNumber: string) {
        if (!stringNumber) {
            return '';
        }

        const { localeInfo } = this.props;
        const localizedSeparator = localeInfo.numbers.decimal;
        const [integer, fractional] = stringNumber.split(localizedSeparator);

        return (
            <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.ParagraphText}>
                {integer}
                <UILabel color={UILabelColors.TextTertiary} role={UILabelRoles.MonoText}>
                    {`${localizedSeparator}${fractional}`}
                </UILabel>
            </UILabel>
        );
    }

    renderFees() {
        return (
            <UIDetailsView
                testID="fees"
                reversed
                // N.B. The is a bug in react-naive where you cannot dismiss the keyboard on Android
                // when its focus is switched to a selected non-input component.
                // Thus disable such an ability.
                selectable={false}
                value={this.renderFractional(
                    uiLocalized.formatString(
                        uiLocalized.feeAmount,
                        uiLocalized.amountToLocale(this.getFees(), {
                            minimumFractionDigits: this.getMinDecimals(),
                            maximumFractionDigits: this.getMinDecimals(),
                        }),
                    ),
                )}
                comments={uiLocalized.fee}
                commentsRole={UILabelRoles.ParagraphLabel}
                containerStyle={[UIStyle.margin.topDefault(), UIStyle.common.flex2()]}
            />
        );
    }

    renderOperationTime() {
        return (
            <UIDetailsView
                testID="operation_time"
                reversed
                // N.B. The is a bug in react-naive where you cannot dismiss the keyboard on Android
                // when its focus is switched to a selected non-input component.
                // Thus disable such an ability.
                selectable={false}
                value={uiLocalized.immediately}
                comments={uiLocalized.operationTime}
                commentsRole={UILabelRoles.ParagraphLabel}
                containerStyle={[UIStyle.margin.topDefault(), UIStyle.common.flex2()]}
            />
        );
    }

    render() {
        return (
            <>
                {this.renderInput()}
                {this.renderCustomComponent()}
                {this.renderInfoBlock()}
            </>
        );
    }
}
