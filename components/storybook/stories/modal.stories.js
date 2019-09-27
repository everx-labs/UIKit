import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import CenterView from '../CenterView';
import FullWidthView from '../FullWidthView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UIStyle,
    UIColor,
    UICard,
    UILink,
    UIComponent,
    UIButtonGroup,
    UIUnfold,
    UICountryPicker,
    UIButton,
    UIActionSheet,
} from '../../../UIKit';


const icoActiveDefault = getUri(require('../../../assets/ico-toggle-active/ico-toggle-active.png'));
const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'));
const iconShowDefault = getUri(require('../../../assets/ico-unfold/ico-show.png'));
const iconHideDefault = getUri(require('../../../assets/ico-unfold/ico-hide.png'));

class Tester extends UIComponent {
    constructor() {
        super();
        this.state = {
            selectedCountry: null,
        };
    }

    onCountryPicker = (selectedCountry) => {
        this.setState({ selectedCountry: selectedCountry.name });
    }

    onPress = () => {
        UICountryPicker.show({
            cca2: 'US',
            language: 'eng',
            disabledCountries: [],
            onSelect: this.onCountryPicker,
        });
    }

    render() {
        const { height, width } = Dimensions.get('window');
        return (
            <View style={{
                flex: 1, paddingTop: 32, height,
            }}
            >
                <UILink title={this.state.selectedCountry || 'Select...'} onPress={this.onPress} />
                <UICountryPicker isShared />
            </View>
        );
    }
}

storiesOf(Constants.CategoryModalPicker, module)
    // .addDecorator(getStory => <FullWidthView>{getStory()}</FullWidthView>)
    .add('UICountryPicker', () => (
        <Tester />
    ));
