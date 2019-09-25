// @flow
import React from 'react';
import { Image, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';
import UIDetailsInput from '../../input/UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UIStyle from '../../../helpers/UIStyle';
import type { DetailsProps } from '../../input/UIDetailsInput';

import TONAssets from '../../../../../assets/TONAssets';
import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';

type Props = DetailsProps & {
    style?: ViewStyleProp,
};

type State = {
    highlightError: boolean,
};

export default class UICardNumberInput extends UIComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            highlightError: false,
        };
    }

    // Events
    onChangeCardNumber = (input: string) => {
        this.setStateSafely({ highlightError: false });
        const cardNumberRaw = input.replace(/[^0-9]/gim, '');
        const cardNumber = (cardNumberRaw.match(/\d{1,4}/g) || []).join(' ');
        if (cardNumberRaw.length <= 16) {
            this.props.onChangeText(cardNumber);
        }
    };

    onBlur = () => {
        this.setStateSafely({ highlightError: true });
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    // Getters
    isValidCardNumber(value: string = this.props.value) {
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

    areSomePresumedCardTypes() {
        const presumedCardTypes = this.getPresumedCardTypes();
        const arr = Object.keys(presumedCardTypes).map(key => key);
        return arr.length > 0;
    }

    getCommentColor() {
        const { value, theme, commentColor } = this.props;
        if (value && !this.areSomePresumedCardTypes()) {
            return UIColor.detailsInputComment(theme);
        }
        return commentColor;
    }

    getComment() {
        const { value, comment } = this.props;
        if (value && !this.areSomePresumedCardTypes() && this.state.highlightError) {
            return UILocalized.invalidCardNumber;
        }
        return comment;
    }

    getPlaceholder() {
        return this.props.placeholder || UILocalized.cardNumber;
    }

    // Render
    renderCardLogos() {
        const presumedCards = this.getPresumedCardTypes();
        const { visa, masterCard, maestro } = UIFunction.bankCardTypes;
        const visaImage = presumedCards[visa]
            ? <Image source={TONAssets.icoVisa()} />
            : null;
        const masterCardStyle = visaImage ? UIStyle.Margin.leftSmall() : null;
        const masterCardImage = presumedCards[masterCard]
            ? <Image source={TONAssets.icoMastercard()} style={masterCardStyle} />
            : null;
        const maestroStyle = visaImage || masterCardImage ? UIStyle.Margin.leftSmall() : null;
        const maestroImage = presumedCards[maestro]
            ? <Image source={TONAssets.icoMaestro()} style={maestroStyle} />
            : null;
        return (
            <View style={UIStyle.Container.centerLeft()}>
                {visaImage}
                {masterCardImage}
                {maestroImage}
            </View>
        );
    }

    render() {
        const commentColor = this.getCommentColor();
        const commentColorProp = commentColor ? { commentColor } : null;
        return (
            <UIDetailsInput
                {...this.props}
                {...commentColorProp}
                keyboardType={UIFunction.phoneNumberInputKeyboardType()}
                placeholder={this.getPlaceholder()}
                containerStyle={this.props.style}
                rightComponent={this.renderCardLogos()}
                comment={this.getComment()}
                submitDisabled={!this.isValidCardNumber()}
                onBlur={this.onBlur}
                onChangeText={this.onChangeCardNumber}
            />
        );
    }
}
