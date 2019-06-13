// @flow
import React from 'react';
import { Text, View } from 'react-native';

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
    SecondaryBody: 'secondaryBody',
});

type LabelRoleValue = $Values<typeof LabelRole>;

type Props = {
    style: ?ViewStyleProp,
    text: string,
    role: LabelRoleValue,
    useDefaultSpace?: boolean,
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

    getStyle(): TextStyleProp[] {
        const role = this.getRole();
        const result = [];

        if (role === UILabel.Role.Title) {
            result.push(UIStyle.Text.primaryTitleBold());
        } else if (role === UILabel.Role.Subtitle) {
            result.push(UIStyle.Text.primarySubtitleBold());
        } else if (role === UILabel.Role.Description) {
            result.push(UIStyle.Text.primaryBodyRegular());
        } else if (role === UILabel.Role.BoldDescription) {
            result.push(UIStyle.Text.primaryBodyBold());
        } else if (role === UILabel.Role.Note) {
            result.push(UIStyle.Text.secondarySmallRegular());
        } else if (role === UILabel.Role.Caption) {
            result.push(UIStyle.Text.secondaryCaptionRegular());
        } else if (role === UILabel.Role.SecondaryBody) {
            result.push(UIStyle.Text.secondaryBodyRegular());
        }
        return result;
    }

    getDefaultSpaceStyle(): ViewStyleProp {
        if (!this.props.useDefaultSpace) { return null; }
        const role = this.getRole();

        if (role === UILabel.Role.Title) {
            return UIStyle.Margin.topMedium();
        } else if (role === UILabel.Role.Subtitle) {
            return UIStyle.Margin.topDefault();
        } else if (role === UILabel.Role.SecondaryBody) {
            return UIStyle.Margin.topSmall();
        }
        return null;
    }

    getText(): string {
        return this.props.text || '';
    }

    // Render
    renderText(textStyle: TextStyleProp[]): React$Node {
        return (
            <Text style={textStyle}>
                {this.getText()}
            </Text>
        );
    }

    // Render
    render(): React$Node {
        // const htmlArray = this.getHtmlArrayFromText();
        const defaultSpaceStyle = this.getDefaultSpaceStyle();
        const textStyle = this.getStyle();

        if (defaultSpaceStyle) {
            textStyle.push(defaultSpaceStyle);
            return (
                <View style={this.props.style}>
                    {this.renderText(textStyle)}
                </View>
            );
        }

        textStyle.push(this.props.style);
        return this.renderText(textStyle);
    }
}
