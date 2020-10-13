// @flow
import React from 'react';
import { Platform, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIColor,
    UIConstant,
    UILocalized,
    UIStyle,
} from '@uikit/core';

import UIDetailsInput from '../UIDetailsInput';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../UIActionComponent';

type Props = DetailsProps & {
    verify: boolean,
};

type State = ActionState & {
    inputHeight: number,
    inputWidth: number,
    heightChanging: boolean,
};

const space = ' ';

export default class UIContractAddressInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        autoCapitalize: 'none',
        returnKeyType: 'done',
        blurOnSubmit: true,
        placeholder: UILocalized.SmartContractAddress,
        autoFocus: false,
        forceMultiLine: true,
        keyboardType: 'default', /* Platform.OS === 'android'
            ? 'visible-password' // to fix Android bug with keyboard suggestions
            : 'default', */ // CRAP, we can't use the hack as it breaks the multiline support :(
        verify: true,
        onBlur: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            inputHeight: UIConstant.smallCellHeight(),
            inputWidth: UIConstant.toastWidth(),
            heightChanging: false,
            highlightError: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    onChangeText = (text: string, callback: ?((finalValue: string) => void)): void => {
        this.setStateSafely({ highlightError: false });
        const { onChangeText } = this.props;
        if (onChangeText) {
            onChangeText(text);
        }
    };

    setInputHeight(inputHeight: number) {
        this.setStateSafely({ inputHeight });
    }

    setHeightChanging(heightChanging: boolean, callback?: () => void) {
        this.setStateSafely({ heightChanging }, callback);
    }

    // Getters
    isAddressValid(address: string) {
        const availableSymbols = '-:0123456789abcdef';
        let hasWrongSymbol = [...address.toLowerCase()].some((symbol) => {
            return !availableSymbols.includes(symbol);
        });
        if (hasWrongSymbol) return false;

        const semicolonIdx = address.indexOf(':');
        if (semicolonIdx === -1) {
            return false;
        }
        const worckchainId = address.substr(0, semicolonIdx);
        if (!Number.isInteger(Number.parseInt(worckchainId))) {
            return false;
        }
        const hexAddress = address.substr(semicolonIdx + 1);
        if (hexAddress.length !== 64) {
            return false;
        }
        const hexSymbols = '0123456789abcdef';
        hasWrongSymbol = [...hexAddress.toLowerCase()].some((symbol) => {
            return !hexSymbols.includes(symbol);
        });
        return !hasWrongSymbol;
    }

    getInputHeight(): number {
        return this.state.inputHeight;
    }

    numOfLines(): number {
        return Math.round(this.getInputHeight() / UIConstant.smallCellHeight());
    }

    commentColor() {
        const {
            value, theme, commentColor, verify,
        } = this.props;
        if (verify && value && !this.isAddressValid(value) && this.state.highlightError) {
            return UIColor.detailsInputComment(theme);
        }
        return commentColor;
    }

    getComment() {
        const { value, comment, verify } = this.props;
        if (verify && value && !this.isAddressValid(value) && this.state.highlightError) {
            return UILocalized.InvalidContractAddress;
        }
        return comment;
    }

    getInputWidth() {
        return this.state.inputWidth || UIConstant.toastWidth();
    }

    isHeightChanging(): boolean {
        return this.state.heightChanging;
    }

    // Events
    onLayout = (e: any) => {
        const { nativeEvent } = e;
        if (Platform.OS === 'web') {
            this.onChange(e);
        }
        if (nativeEvent) {
            const { layout } = nativeEvent;
            this.setStateSafely({ inputWidth: layout.width });
        }
    };

    onBlur = () => {
        this.setFocused(false);
        this.props.onBlur();
        this.setStateSafely({ highlightError: true });
    };

    onContentSizeChange = (height: number) => {
        this.setInputHeight(height);
    };

    renderTextFragment() {
        return (
            <React.Fragment>
                <View style={UIStyle.screenContainer}>
                    {this.renderAuxTextInput()}
                    {this.renderTextInput()}
                </View>
            </React.Fragment>
        );
    }
}
