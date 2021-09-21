// @flow
import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import { ScrollView } from 'react-native-gesture-handler';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UISearchBar } from '@tonlabs/uikit.navigation';
import {
    Typography,
    TypographyVariants,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';
import { uiLocalized } from '@tonlabs/localization';
import { UIAssets } from '@tonlabs/uikit.assets';

import UIModalController from '../UIModalController';
import type {
    ModalControllerProps,
    ModalControllerState,
    ModalControllerShowArgs,
} from '../UIModalController';

const checkboxIco = UIAssets.icons.ui.checkboxCircleActiveInverted;

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
        marginHorizontal: UIConstant.contentOffset(),
    },
    itemCountryName: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 0,
        height: UIConstant.smallCellHeight(),
        justifyContent: 'space-between',
    },
    modalContainer: {
        flex: 1,
        margin: -1,
    },
    separator: {
        marginVertical: 1,
        marginHorizontal: UIConstant.contentOffset(),
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
};

function Picker({
    pickerRef,
    cca2,
    selected,
    translation,
    disabledCountries,
    excludedCountries,
    sequenceOrder,
    onPickCountry,
    isLanguages,
    hideFlags,
}: *) {
    const theme = useTheme();

    return (
        <CountryPicker
            ref={pickerRef}
            cca2={cca2}
            selected={selected}
            translation={translation}
            hideAlphabetFilter
            filterable
            renderFilter={() => null}
            disabledCountries={disabledCountries}
            disabledCountryText={uiLocalized.serviceUnavailable}
            excludedCountries={excludedCountries}
            sequenceOrder={sequenceOrder}
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
                    Typography[TypographyVariants.Action],
                    { color: theme[ColorVariants.TextPrimary] },
                ],
                disabledCountryName: [
                    Typography[TypographyVariants.Action],
                    { color: theme[ColorVariants.TextNeutral] },
                ],
                separator: {
                    ...countryPickerStyle.separator,
                    backgroundColor: theme[ColorVariants.LinePrimary],
                },
            }}
            onChange={onPickCountry}
            dataType={
                isLanguages ? CountryPicker.dataTypes.languages : CountryPicker.dataTypes.countries
            }
            hideFlags={hideFlags}
            selectedItemImage={checkboxIco}
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

    static hide() {
        if (shared) {
            shared.hide();
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
    selected: ?string;
    translation: ?string;
    screenTitle: ?string;
    disabledCountries: ?(string[]);
    excludedCountries: ?(string[]);
    sequenceOrder: ?(string[]);
    isLanguages: ?boolean;
    searchBarHidden: ?boolean;
    flagsHidden: ?boolean;
    bottomView: ?React$Node;

    constructor(props: Props) {
        super(props);
        this.fullscreen = false;
        this.testID = '[UICountryPicker]';
        this.cca2 = null;
        this.selected = '';
        this.translation = null;
        this.screenTitle = null;
        this.disabledCountries = [];
        this.excludedCountries = [];
        this.sequenceOrder = [];
        this.modalOnWeb = false;
        this.isLanguages = false;
        this.searchBarHidden = false;
        this.flagsHidden = false;
        this.bottomView = null;

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

    onChangeText = (newValue: string) => {
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
                translation = 'eng',
                cca2 = 'US',
                selected = '',
                screenTitle = '',
                disabledCountries = [],
                excludedCountries = [],
                sequenceOrder = [],
                modalOnWeb = false,
                isLanguages = false,
                searchBarHidden = false,
                flagsHidden = false,
                bottomView = null,
            } = args;
            this.fullscreen = fullscreen;
            this.cca2 = cca2;
            this.selected = selected;
            this.translation = translation;
            this.screenTitle = screenTitle;
            this.disabledCountries = disabledCountries;
            this.excludedCountries = excludedCountries;
            this.sequenceOrder = sequenceOrder;
            this.modalOnWeb = modalOnWeb;
            this.isLanguages = isLanguages;
            this.searchBarHidden = searchBarHidden;
            this.flagsHidden = flagsHidden;
            this.bottomView = bottomView;
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

    renderScreenTitle() {
        if (!this.screenTitle) {
            return null;
        }

        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.TitleMedium}
                style={UIStyle.padding.default()}
            >
                {this.screenTitle}
            </UILabel>
        );
    }

    renderSearchBar() {
        if (this.searchBarHidden || !this.countryPickerRef) {
            return null;
        }

        return (
            <View>
                <UISearchBar
                    value={this.getExpression()}
                    ref={this.countryPickerInputRef}
                    onChangeText={this.onChangeText}
                />
            </View>
        );
    }

    renderBottomView() {
        if (!this.bottomView) {
            return null;
        }

        return this.bottomView;
    }

    renderContentView() {
        // Wraping the component with a ScrollView fixes on Android the
        // problem of the list not avoiding the keyboard... on iOS this
        // doesn't seem to work. KeyboardAvoidingView fixes it for iOS.
        const picker = (
            <>
                {this.renderSearchBar()}
                <ScrollView>
                    {this.renderScreenTitle()}
                    <Picker
                        pickerRef={this.countryPickerRef}
                        cca2={this.cca2}
                        selected={this.selected}
                        translation={this.translation}
                        disabledCountries={this.disabledCountries}
                        excludedCountries={this.excludedCountries}
                        sequenceOrder={this.sequenceOrder}
                        onPickCountry={this.onPickCountry}
                        isLanguages={this.isLanguages}
                        hideFlags={this.flagsHidden}
                    />
                    {this.renderBottomView()}
                </ScrollView>
            </>
        );
        const toRender =
            Platform.OS === 'ios' ? (
                <KeyboardAvoidingView
                    style={countryPickerStyle.container}
                    keyboardVerticalOffset={120}
                    behavior="padding"
                >
                    {picker}
                </KeyboardAvoidingView>
            ) : (
                picker
            );
        return toRender;
    }
}
