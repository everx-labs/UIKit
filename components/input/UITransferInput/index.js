// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIAmountInput from '../UIAmountInput';
import UIComponent from '../../UIComponent';
import UIDetailsView from '../../views/UIDetailsView';
import UIConstant from '../../../helpers/UIConstant';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';

import type { NumberParts, StringLocaleInfo } from '../../../helpers/UIFunction';
import type { UIColorData } from '../../../helpers/UIColor/UIColorTypes';

type Props = {
    containerStyle?: ViewStyleProp,
    hidePlaceholder?: boolean,
    placeholder?: string,
    onSubmitEditing?: () => void,
    autoFocus?: boolean,
    button?: Object,
    value?: ?number,
    token?: string,
    comment?: string,
    commentRight?: string,
    commentColor?: UIColorData,
    maxDecimals: number,
    onValueChange?: (number: ?number) => void,
    onBlur?: () => void,
    rightButton?: string,
    onRightButtonPress?: () => void,
    testID?: string,
    minValue?: number,
    minValueMessage?: string,
    maxValue?: number,
    maxValueMessage?: string,
    fees?: number,
    localeInfo: StringLocaleInfo,
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

const MAX_INPUT_AMOUNT = 9000000; // Round the max value instead of using Number.MAX_SAFE_INTEGER-1

export default class UITransferInput extends UIComponent<Props, State> {
    static defaultProps = {
        value: undefined,
        maxDecimals: UIConstant.maxDecimalDigits(),
        minValue: undefined,
        maxValue: undefined,
        fees: 0,
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
        if (
            prevProps.value !== newValue
            && !new RegExp(`\\${localizedSeparator}(\\d*0+)?$`).test(this.state.valueString)
        ) {
            this.parseValue(newValue);
        }
    }

    // Getters
    getMaxDecimals(): number {
        return this.props.maxDecimals;
    }

    getValue(): ?number {
        return this.props.value;
    }

    getMinValueMessage(): ?string {
        const { minValue, minValueMessage, value } = this.props;

        if (value == null) {
            return UILocalized.formatString(minValueMessage, minValue);
        }
        return minValue != null && minValueMessage != null && value < minValue
            ? UILocalized.formatString(minValueMessage, minValue)
            : undefined;
    }

    getMaxValueMessage(): ?string {
        // check if balance after transaction < operation fee --> show alert
        const { maxValue, maxValueMessage, value } = this.props;
        const fees = this.getFees();

        return maxValue != null && maxValueMessage != null && value + fees >= maxValue - fees
            ? maxValueMessage
            : undefined;
    }

    getFees(): number {
        return this.props.fees || 0;
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
        value: ?number,
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
        if (value && value > MAX_INPUT_AMOUNT) {
            return this.parseText(MAX_INPUT_AMOUNT.toString());
        }
        const valueString = !text ? '' : parts.valueString;
        const zeros = Math.min(UIConstant.minDecimalDigits(), this.getMaxDecimals());
        const decimalPlaceholder = '0'.repeat(zeros);
        const inputPlaceholder = `0${localizedSeparator}${decimalPlaceholder}`;
        return { value, valueString, inputPlaceholder };
    }

    parseValue(value: ?number) {
        const text = value === undefined || value === null
            ? ''
            : UIFunction.getNumberString(value);
        const { valueString, inputPlaceholder } = this.parseText(text) || {
            valueString: text,
            inputPlaceholder: '',
        };

        let finalValue = valueString;
        if (valueString === 'Infinity') {
            const max = this.parseText(MAX_INPUT_AMOUNT.toString());
            finalValue = max?.valueString || '0';
        }

        this.setStateSafely({ valueString: finalValue, inputPlaceholder });
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

    renderFees() {
        if (!this.getFees()) {
            return null;
        }
        const { localeInfo } = this.props;
        return (
            <UIDetailsView
                reversed
                disabled
                value={UILocalized.formatString(
                    UILocalized.feeAmount,
                    UILocalized.amountToLocale(this.getFees(), localeInfo, options),
                )}
                comments={UILocalized.fee}
                commentsStyle={UIStyle.text.tertiaryTinyRegular()}
                containerStyle={UIStyle.margin.topDefault()}
                textStyle={UIStyle.text.secondaryBodyRegular()}
            />
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderInput()}
                {this.renderFees()}
            </React.Fragment>
        );
    }
}
