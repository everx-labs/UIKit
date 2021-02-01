// @flow
import React from 'react';
import { Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import { ScrollView } from 'react-native-gesture-handler';


import { UIConstant, UIColor } from '@tonlabs/uikit.core';
import { UISearchBar } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

import UIModalController from '../UIModalController';
import type {
    ModalControllerProps,
    ModalControllerState,
    ModalControllerShowArgs,
} from '../UIModalController';
import { ColorVariants, Typography, TypographyVariants, useTheme } from '@tonlabs/uikit.hydrogen';

let shared;

const countryPickerStyle = StyleSheet.create({
    container: {
        flex: 1,
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
        height: UIConstant.smallCellHeight(),
    },
    modalContainer: {
        flex: 1,
        margin: -1,
    },
    separator: {
        marginVertical: 1,
        marginHorizontal: UIConstant.contentOffset(),
        backgroundColor: UIColor.grey2(),
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

function Picker({ pickerRef, cca2, language, disabledCountries, excludedCountries, onPickCountry, isLanguages }: *) {
    const theme = useTheme();

    return (
        <CountryPicker
            ref={pickerRef}
            cca2={cca2}
            translation={language}
            hideAlphabetFilter
            filterable
            renderFilter={() => null}
            disabledCountries={disabledCountries}
            disabledCountryText={uiLocalized.serviceUnavailable}
            excludedCountries={excludedCountries}
            styles={{
                ...countryPickerStyle,
                container: {
                    ...countryPickerStyle.container,
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
                contentContainer: {
                    flex: 1,
                    marginHorizontal: 1,
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
                countryName: [
                    Typography[TypographyVariants.ParagraphText],
                    { color: theme[ColorVariants.TextPrimary] },
                ],
                disabledCountryName: [
                    Typography[TypographyVariants.ParagraphText],
                    { color: theme[ColorVariants.TextNeutral] },
                ],
                separator: {
                    ...countryPickerStyle.separator,
                    backgroundColor: theme[ColorVariants.LinePrimary],
                },
            }}
            onChange={onPickCountry}
            dataType={isLanguages ?
                CountryPicker.dataTypes.languages :
                CountryPicker.dataTypes.countries}
        />
    );
}

export default class UICountryPicker extends UIModalController<Props, State> {
    countryPickerRef = React.createRef<CountryPicker>();
    countryPickerInputRef = React.createRef<UISearchBar>();

    static defaultProps = {
        isShared: false,
    };

    static show(args: ModalControllerShowArgs) {
        if (shared) {
            shared.show(args);
        }
    }

    static focus() {
        if (shared) {
            shared.focus();
        }
    }

    static getAllCountries(): Country[] {
        return getAllCountries();
    }

    cca2: ?string;
    language: ?string;
    disabledCountries: ?string[];
    excludedCountries: ?string[];
    isLanguages: ?boolean;

    constructor(props: Props) {
        super(props);
        this.fullscreen = false;
        this.testID = '[UICountryPicker]';
        this.cca2 = null;
        this.language = null;
        this.disabledCountries = [];
        this.excludedCountries = [];
        this.modalOnWeb = false;
        this.isLanguages = false;

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
        this.hide();
        this.setExpression('');
        if (this.onSelect) {
            this.onSelect(country);
        }
    };

    onChangeExpression = (newValue: string) => {
        this.setExpression(newValue);
        if (this.countryPickerRef.current != null) {
            this.countryPickerRef.current.handleFilterChange(newValue);
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
                excludedCountries = [],
                modalOnWeb = false,
                isLanguages = false,
            } = args;
            this.fullscreen = fullscreen;
            this.cca2 = cca2;
            this.language = language;
            this.disabledCountries = disabledCountries;
            this.excludedCountries = excludedCountries;
            this.modalOnWeb = modalOnWeb;
            this.isLanguages = isLanguages;
        }
        await super.show(args);

        this.focus();
    }

    async focus() {
        if (this.countryPickerInputRef.current != null) {
            this.countryPickerInputRef.current.focus();
        }
    }

    // Render

    renderSearchBar() {
        if (!this.countryPickerRef) {
            return null;
        }

        return (
            <React.Fragment>
                <UISearchBar
                    value={this.getExpression()}
                    placeholder={`${uiLocalized.Search}...`}
                    ref={this.countryPickerInputRef}
                    onChangeExpression={this.onChangeExpression}
                    bottomSeparatorStyle={countryPickerStyle.separator}
                    renderGlass
                />
            </React.Fragment>
        );
    }

    renderContentView() {
        // Wraping the component with a ScrollView fixes on Android the
        // problem of the list not avoiding the keyboard... on iOS this
        // doesn't seem to work. KeyboardAvoidingView fixes it for iOS.
        const picker = (
            <>
                {this.renderSearchBar()}
                <ScrollView>
                    <Picker
                        pickerRef={this.countryPickerRef}
                        cca2={this.cca2}
                        language={this.language}
                        disabledCountries={this.disabledCountries}
                        excludedCountries={this.excludedCountries}
                        onPickCountry={this.onPickCountry}
                        isLanguages={this.isLanguages}
                    />
                </ScrollView>
            </>
        );
        const toRender = Platform.OS === 'ios'
            ? (
                <KeyboardAvoidingView
                    style={countryPickerStyle.container}
                    keyboardVerticalOffset={120}
                    behavior="padding"
                >
                    {picker}
                </KeyboardAvoidingView>
            )
            : picker;
        return toRender;
    }
}
