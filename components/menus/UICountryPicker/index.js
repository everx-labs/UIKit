// @flow
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

import UIModalController from '../../../controllers/UIModalController';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UISearchBar from '../../input/UISearchBar';
import type { ModalControllerProps, ModalControllerState, ModalControllerShowArgs } from '../../../controllers/UIModalController';

let shared;

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        margin: UIConstant.contentOffset(),
    },
});

const countryPickerStyle = StyleSheet.create({
    container: {
        width: '100%',
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
    itemCountryFlag: {
        borderRadius: UIConstant.tinyBorderRadius(),
        justifyContent: 'center',
        alignItems: 'center',
        height: '7%',
        width: '15%',
    },
    itemCountryName: {
        borderBottomWidth: 0,
    },
    countryName: {
        borderBottomWidth: 0,
    },
    header: {
        marginHorizontal: -UIConstant.contentOffset(),
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

    cca2: ?string;
    language: ?string;
    countryPicker: ?CountryPicker;

    constructor(props: Props) {
        super(props);
        this.fullscreen = false;
        this.testID = '[UICountryPicker]';
        this.modal = false;
        this.cca2 = null;
        this.language = null;

        this.state = {
            expression: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        shared = this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        shared = null;
    }

    // Events
    onCancel = () => {
        this.setExpression('');
    };

    onPickCountry = (country: Country) => {
        this.hide();
        this.setExpression('');
        if (this.onSelect) {
            this.onSelect(country);
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

    // Setters
    setExpression(expression: string) {
        this.setStateSafely({ expression });
    }

    // Actions
    async show(args: any) {
        if (typeof args === 'object') {
            const {
                cca2 = 'US',
                language = 'eng',
            } = args;
            this.cca2 = cca2;
            this.language = language;
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
        // $FlowExpectedError
        countryPickerStyle.modalContainer = {
            flex: 1,
            margin: -1,
            width: this.getDialogStyle().width - (UIConstant.contentOffset() * 2),
        };

        return (
            <React.Fragment>
                {this.renderSearchBar()}
                <ScrollView
                    testID="country_view"
                    contentContainerStyle={styles.scrollViewContainer}
                >
                    <CountryPicker
                        ref={(component) => { this.countryPicker = component; }}
                        cca2={this.cca2}
                        translation={this.language}
                        hideAlphabetFilter
                        filterable
                        renderFilter={() => null}
                        styles={countryPickerStyle}
                        onChange={this.onPickCountry}
                    />
                </ScrollView>
            </React.Fragment>
        );
    }
}
