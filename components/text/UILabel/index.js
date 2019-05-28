// @flow
import React from 'react';
import { Text } from 'react-native';

import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';

import UIComponent from '../../UIComponent';

const LabelRole = Object.freeze({
    Title: 'title',
    Subtitle: 'subtitle',
    Description: 'description',
    BoldDescription: 'boldDescription',
    Note: 'note',
    Caption: 'caption',
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
    };

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
            return UIStyle.Text.primaryTitleBold();
        } else if (role === UILabel.Role.Subtitle) {
            return UIStyle.Text.primarySubtitleBold();
        } else if (role === UILabel.Role.Description) {
            return UIStyle.Text.primaryBodyRegular();
        } else if (role === UILabel.Role.BoldDescription) {
            return UIStyle.Text.primaryBodyBold();
        } else if (role === UILabel.Role.Note) {
            return UIStyle.Text.secondarySmallRegular();
        } else if (role === UILabel.Role.Caption) {
            return UIStyle.Text.secondaryCaptionRegular();
        }
        return {};
    }

    getText(): string {
        return this.props.text || '';
    }

    // TODO
    // getHtmlArrayFromText() {
    //     const str = this.props.text;
    //     const result = [];
    //     while (1) {
    //         const bIndex = str.indexOf('<b>');
    //         // if (bIndex)
    //     }
    // }

    // Render
    render() {
        // const htmlArray = this.getHtmlArrayFromText();
        return (
            <Text style={[this.getStyle(), this.props.style]}>
                {this.getText()}
            </Text>
        );
    }
}
