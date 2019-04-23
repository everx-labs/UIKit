// @flow
import React from 'react';
import { Text } from 'react-native';

import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UITextStyle from '../../../helpers/UITextStyle';

import UIComponent from '../../UIComponent';

const LabelRole = Object.freeze({
    Title: 'title',
    Subtitle: 'subtitle',
    Description: 'description',
    BoldDescription: 'boldDescription',
});

type LabelRoleValue = $Values<typeof LabelRole>;

type Props = {
    style: ?ViewStyleProp,
    text: string,
    role: LabelRoleValue,
}

type State = {
    //
}

export default class UILabel extends UIComponent<Props, State> {
    static Role = LabelRole;

    static defaultProps = {
        style: null,
        text: '',
        role: UILabel.Role.Description,
    }

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            //
        };
    }

    // Getters
    getRole() {
        return this.props.role;
    }

    getStyle(): TextStyleProp {
        const role = this.getRole();
        if (role === UILabel.Role.Title) {
            return UITextStyle.primaryTitleLight;
        } else if (role === UILabel.Role.Subtitle) {
            return UITextStyle.primarySubtitleBold;
        } else if (role === UILabel.Role.Description) {
            return UITextStyle.primaryBodyRegular;
        } else if (role === UILabel.Role.BoldDescription) {
            return UITextStyle.primaryBodyBold;
        } return {};
    }

    getText(): string {
        return this.props.text || '';
    }

    // Render
    render() {
        return (
            <Text style={[this.getStyle(), this.props.style]}>
                {this.getText()}
            </Text>
        );
    }
}
