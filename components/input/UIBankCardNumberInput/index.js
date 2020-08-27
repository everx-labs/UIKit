// @flow
import React from 'react';
import { Image, View, Platform } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';
import UIDetailsInput from '../../input/UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UIStyle from '../../../helpers/UIStyle';
import type { DetailsProps } from '../../input/UIDetailsInput';

import UIAssets from '../../../assets/UIAssets';
import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';

type Props = DetailsProps & {
    style?: ViewStyleProp,
    customWithLength?: number,
};

type State = {
    highlightError: boolean,
    selection: { start: number, end: number },
    textFormated: string,
    text: string,
};

export default class UIBankCardNumberInput extends UIComponent<Props, State> {
    textChanged: boolean;

    constructor(props: Props) {
        super(props);

        this.state = {
            highlightError: false,
            selection: { start: 0, end: 0 },
            textFormated: '',
            text: '',
        };

        this.textChanged = false;
    }

    // Events
    onChangeCardNumber = (input: string) => {
        const { customWithLength } = this.props;

        this.textChanged = true;
        this.setStateSafely({ highlightError: false });
        const cardNumberRaw = input.replace(/[^0-9]/gim, '');
        const cardNumber = (cardNumberRaw.match(/\d{1,4}/g) || []).join(' ');

        if ((customWithLength && cardNumberRaw.length <= customWithLength) ||
            cardNumberRaw.length <= 19) {
            this.setStateSafely({ text: input, textFormated: cardNumber });
            this.props.onChangeText(cardNumber);
        }
    };

    onBlur = () => {
        this.setStateSafely({ highlightError: true });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    onSelectionChange = (e: any): void => {
        this.setStateSafely({ selection: e.nativeEvent?.selection });
    };

    // Getters
    adjustSelection(selectionToAdjust: {start: number, end: number}) {
        if (Platform.OS === 'web') {
            if (!this.textChanged) {
                return selectionToAdjust;
            }
            this.textChanged = false;
        }

        const cursorPosition = UIFunction.adjustCursorPosition(
            this.state.text,
            selectionToAdjust.start,
            this.state.textFormated,
        );
        return { start: cursorPosition, end: cursorPosition };
    }

    getSelection() {
        if (Platform.OS !== 'web') {
            return null;
        }
        return this.adjustSelection(this.state.selection);
    }

    isValidCardNumber(value: string = this.props.value) {
        const { customWithLength } = this.props;

        if (customWithLength) {
            const valueRaw = value.replace(/[^0-9]/gim, '');
            return valueRaw.length === customWithLength;
        }

        return UIFunction.getBankCardType({
            number: value,
            raw: false,
            presumed: false,
        });
    }

    getPresumedCardTypes(value: string = this.props.value) {
        return UIFunction.getBankCardType({
            number: value,
            raw: false,
            presumed: true,
        });
    }

    getCommentColor() {
        const { value, theme, commentColor } = this.props;
        if (value && !this.isValidCardNumber()) {
            return UIColor.detailsInputComment(theme);
        }
        return commentColor;
    }

    getComment() {
        const { value, comment } = this.props;
        if (value && !this.isValidCardNumber() && this.state.highlightError) {
            return UILocalized.InvalidBankCardNumber;
        }
        return comment || '';
    }

    getPlaceholder() {
        return this.props.placeholder || UILocalized.BankCardNumber;
    }

    // Render
    renderCardLogos() {
        const { customWithLength } = this.props;

        if (customWithLength) {
            return null;
        }

        const presumedCards = this.getPresumedCardTypes();
        if (!(presumedCards instanceof Object)) {
            return null;
        }
        const { visa, masterCard, maestro } = UIFunction.bankCardTypes;
        const visaImage = presumedCards[visa]
            ? <Image source={UIAssets.icoVisa()} />
            : null;
        const masterCardStyle = visaImage ? UIStyle.margin.leftSmall() : null;
        const masterCardImage = presumedCards[masterCard]
            ? <Image source={UIAssets.icoMastercard()} style={masterCardStyle} />
            : null;
        const maestroStyle = visaImage || masterCardImage ? UIStyle.margin.leftSmall() : null;
        const maestroImage = presumedCards[maestro]
            ? <Image source={UIAssets.icoMaestro()} style={maestroStyle} />
            : null;
        if (visaImage || masterCardImage || maestroImage) {
            return (
                <View style={UIStyle.container.centerLeft()}>
                    {visaImage}
                    {masterCardImage}
                    {maestroImage}
                </View>
            );
        }
        return null;
    }

    render() {
        const commentColor = this.getCommentColor();
        const commentColorProp = commentColor ? { commentColor } : null;
        return (
            <UIDetailsInput
                {...this.props}
                {...commentColorProp}
                keyboardType={this.props.keyboardType || UIFunction.phoneNumberInputKeyboardType()}
                placeholder={this.getPlaceholder()}
                rightComponent={this.renderCardLogos()}
                comment={this.getComment()}
                submitDisabled={!this.isValidCardNumber()}
                onBlur={this.onBlur}
                onChangeText={this.onChangeCardNumber}
                onSelectionChange={this.onSelectionChange}
                selection={this.getSelection()}
            />
        );
    }
}
