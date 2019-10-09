// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';

import UIModalController from '../../../controllers/UIModalController';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UISearchBar from '../../input/UISearchBar';
import { primary, quaternary } from '../../../helpers/UITextStyle';
import type { ModalControllerProps, ModalControllerState, ModalControllerShowArgs } from '../../../controllers/UIModalController';
import UIFont from '../../../helpers/UIFont';

let shared;

const countryPickerStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        margin: 1,
    },
    scrollView: {
        borderWidth: 0,
        borderColor: 'transparent',
    },
    touchFlag: {
        opacity: 0,
        position: 'absolute',
    },
    itemCountry: {
        height: UIConstant.buttonHeight(),
    },
    itemCountryName: {
        borderBottomWidth: 0,
    },
    modalContainer: {
        flex: 1,
        margin: -1,
    },
    countryName: {
        ...primary,
        ...UIFont.smallMedium(),
    },
    disabledCountryName: {
        ...quaternary,
        ...UIFont.smallMedium(),
    },
});

type Props = ModalControllerProps & {
    isShared: boolean,
};

type State = ModalControllerState & {
    expression: string,
};

export type Country = {
    cca2: string,
    name: string,
}

export default class UICountryPicker extends UIModalController<Props, State> {
    static defaultProps = {
        isShared: false,
    };

    static show(args: ModalControllerShowArgs) {
        if (shared) {
            shared.show(args);
        }
    }

    static getAllCountries() {
        return getAllCountries();
    }

    cca2: ?string;
    language: ?string;
    countryPicker: ?CountryPicker;
    disabledCountries: ?string[];

    constructor(props: Props) {
        super(props);
        this.fullscreen = false;
        this.testID = '[UICountryPicker]';
        this.cca2 = null;
        this.language = null;
        this.disabledCountries = [];
        this.modalOnWeb = false;

        this.state = {
            expression: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.isShared) {
            shared = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.isShared) {
            shared = null;
        }
    }


    // Events
    onCancel = () => {
        this.setExpression('');
    };

    onPickCountry = (country: Country) => {
        const countryCCA2 = country.cca2 || '';
        const disabledCountries = this.getDisabledCountries();
        if (disabledCountries.indexOf(countryCCA2) === -1) {
            this.hide();
            this.setExpression('');
            if (this.onSelect) {
                this.onSelect(country);
            }
        }
    };

    onChangeExpression = (newValue: string) => {
        this.setExpression(newValue);
        if (this.countryPicker) {
            this.countryPicker.handleFilterChange(newValue);
        }
    };

    // Getters
    getExpression() {
        return this.state.expression;
    }

    getDisabledCountries(): Array<string> {
        return this.disabledCountries || [];
    }

    // Setters
    setExpression(expression: string) {
        this.setStateSafely({ expression });
    }

    // Actions
    async show(args: any) {
        if (typeof args === 'object') {
            const {
                fullscreen = false,
                language = 'eng',
                cca2 = 'US',
                disabledCountries = [],
                modalOnWeb = false,
            } = args;
            this.fullscreen = fullscreen;
            this.cca2 = cca2;
            this.language = language;
            this.disabledCountries = disabledCountries;
            this.modalOnWeb = modalOnWeb;
        }
        await super.show(args);
    }

    // Render
    renderSearchBar() {
        if (!this.countryPicker) {
            return null;
        }
        return (
            <React.Fragment>
                <UISearchBar
                    value={this.getExpression()}
                    placeholder={`${UILocalized.Search}...`}
                    onChangeExpression={this.onChangeExpression}
                />
            </React.Fragment>
        );
    }

    renderContentView() {
        return (
            <React.Fragment>
                {this.renderSearchBar()}
                <CountryPicker
                    ref={(component) => { this.countryPicker = component; }}
                    cca2={this.cca2}
                    translation={this.language}
                    hideAlphabetFilter
                    filterable
                    renderFilter={() => null}
                    disabledCountries={this.disabledCountries}
                    disabledCountryText={`${UILocalized.serviceUnavailable}...`}
                    styles={countryPickerStyle}
                    onChange={this.onPickCountry}
                />
            </React.Fragment>
        );
    }
}
