// @flow
import React from 'react';
import { Text, View } from 'react-native';

import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from '@uikit/core';

import UIComponent from '../UIComponent';

const LabelRole = Object.freeze({
    Title: 'title',
    TitleLight: 'titleLight',
    TitleRegular: 'titleRegular',
    Subtitle: 'subtitle',
    SubtitleRegular: 'subtitleRegular',
    Description: 'description',
    DescriptionSmall: 'descriptionSmall',
    DescriptionSmallError: 'descriptionSmallError',
    DescriptionMedium: 'descriptionMedium',
    BoldDescription: 'boldDescription', // TODO: rename descriptionBold
    DescriptionTertiary: 'descriptionTertiary',
    SmallMedium: 'smallMedium',
    SmallBold: 'smallBold',
    SmallRegular: 'smallRegular',
    SmallRegularTertiary: 'smallRegularTertiary',
    TinyRegular: 'tinyRegular',
    TinyMedium: 'tinyMedium',
    TinyTertiary: 'tinyTertiary',
    TinySecondary: 'tinySecondary',
    Note: 'note',
    SecondaryBody: 'secondaryBody', // TODO: rename as bodySecondary
    BodySecondaryMedium: 'bodySecondaryMedium',
    BodySecondaryBold: 'bodySecondaryBold',
    Caption: 'caption', // TODO: rename as captionSecondary
    CaptionTertiary: 'captionTertiary',
    CaptionSuccess: 'captionSuccess',
    CaptionWarning: 'captionWarning',
    CaptionError: 'captionError',
    AccentBold: 'accentBold',
    AccentRegular: 'accentRegular',
    IconQuaternary: 'iconQuaternary',
    AlertTitle: 'alertTitle',
});

export type LabelRoleValue = $Values<typeof LabelRole>;

type Props = {|
    style: ?TextStyleProp,
    text: string | React$Element<any>,
    externalTextStyle: ?TextStyleProp,
    role: LabelRoleValue,
    useDefaultSpace?: boolean,
    testID?: ?string,
    numberOfLines?: number,
    selectable?: boolean,
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
|};

type State = {
    //
};

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

        if (role === UILabel.Role.Title) { // Title - fontSize: 36, lineHeight: 48
            result.push(UIStyle.Text.primaryTitleBold());
        } else if (role === UILabel.Role.TitleLight) {
            result.push(UIStyle.Text.primaryTitleLight());
        } else if (role === UILabel.Role.TitleRegular) {
            result.push(UIStyle.Text.primaryTitleRegular());
        } else if (role === UILabel.Role.Subtitle) { // Subtitle - fontSize: 24, lineHeight: 32
            result.push(UIStyle.Text.primarySubtitleBold());
        } else if (role === UILabel.Role.SubtitleRegular) {
            result.push(UIStyle.Text.primarySubtitleRegular());
        } else if (role === UILabel.Role.Description) { // Body - fontSize: 18, lineHeight: 24
            result.push(UIStyle.Text.primaryBodyRegular());
        } else if (role === UILabel.Role.DescriptionSmall) { // Body - fontSize: 16, lineHeight: 20
            result.push(UIStyle.Text.secondarySmallRegular());
        } else if (role === UILabel.Role.DescriptionSmallError) { // Body - fontSize: 16, lineHeight: 20
            result.push(UIStyle.Text.errorSmallRegular());
        } else if (role === UILabel.Role.DescriptionMedium) {
            result.push(UIStyle.Text.primaryBodyMedium());
        } else if (role === UILabel.Role.BoldDescription) {
            result.push(UIStyle.Text.primaryBodyBold());
        } else if (role === UILabel.Role.SecondaryBody) {
            result.push(UIStyle.Text.secondaryBodyRegular());
        } else if (role === UILabel.Role.BodySecondaryMedium) {
            result.push(UIStyle.Text.secondaryBodyMedium());
        } else if (role === UILabel.Role.BodySecondaryBold) {
            result.push(UIStyle.Text.secondaryBodyBold());
        } else if (role === UILabel.Role.DescriptionTertiary) {
            result.push(UIStyle.Text.tertiaryBodyRegular());
        } else if (role === UILabel.Role.SmallMedium) { // Small - fontSize: 16, lineHeight: 20
            result.push(UIStyle.Text.primarySmallMedium());
        } else if (role === UILabel.Role.SmallBold) {
            result.push(UIStyle.Text.primarySmallBold());
        } else if (role === UILabel.Role.SmallRegular) {
            result.push(UIStyle.Text.primarySmallRegular());
        } else if (role === UILabel.Role.SmallRegularTertiary) {
            result.push(UIStyle.Text.tertiarySmallRegular());
        } else if (role === UILabel.Role.TinyRegular) {
            result.push(UIStyle.Text.primaryTinyRegular());
        } else if (role === UILabel.Role.TinyMedium) {
            result.push(UIStyle.Text.primaryTinyMedium());
        } else if (role === UILabel.Role.TinyTertiary) {
            result.push(UIStyle.Text.tertiaryTinyRegular());
        } else if (role === UILabel.Role.TinySecondary) {
            result.push(UIStyle.Text.secondaryTinyRegular());
        } else if (role === UILabel.Role.Note) {
            result.push(UIStyle.Text.secondarySmallRegular());
        } else if (role === UILabel.Role.AccentBold) { // Accent - fontSize: 20, lineHeight: 28
            result.push(UIStyle.Text.primaryAccentBold());
        } else if (role === UILabel.Role.AccentRegular) { // Accent - fontSize: 20, lineHeight: 28
            result.push(UIStyle.Text.primaryAccentRegular());
        } else if (role === UILabel.Role.Caption) { // Caption - fontSize: 14, lineHeight: 20
            result.push(UIStyle.Text.secondaryCaptionRegular());
        } else if (role === UILabel.Role.CaptionTertiary) {
            result.push(UIStyle.Text.tertiaryCaptionRegular());
        } else if (role === UILabel.Role.CaptionSuccess) {
            result.push(UIStyle.Text.successCaptionRegular());
        } else if (role === UILabel.Role.CaptionWarning) {
            result.push(UIStyle.Text.warningCaptionRegular());
        } else if (role === UILabel.Role.CaptionError) {
            result.push(UIStyle.Text.errorCaptionRegular());
        } else if (role === UILabel.Role.IconQuaternary) {
            result.push(UIStyle.Text.quaternaryIconRegular());
        } else if (role === UILabel.Role.AlertTitle) {
            result.push(UIStyle.Text.primaryBodyBold());
        }
        return result;
    }

    getDefaultSpaceStyle(): ViewStyleProp {
        if (!this.props.useDefaultSpace) {
            return null;
        }
        const role = this.getRole();
        if (role === UILabel.Role.Title) {
            return UIStyle.Margin.topMedium(); // 24
        } else if (role === UILabel.Role.Subtitle) {
            return UIStyle.Margin.topDefault(); // 16
        } else if (role === UILabel.Role.SecondaryBody) {
            return UIStyle.Margin.topSmall(); // 8
        } else if (role === UILabel.Role.Description) {
            return UIStyle.Margin.topSmall(); // 8
        } else if (role === UILabel.Role.Note) {
            return UIStyle.Margin.topDefault(); // 16
        } else if (role === UILabel.Role.AccentBold) {
            return UIStyle.Margin.topDefault(); // 16
        } else if (role === UILabel.Role.Caption) {
            return UIStyle.Margin.topSmall();
        }
        return null;
    }

    getText(): string | React$Element<any> {
        return this.props.text || '';
    }

    // Render
    renderText(textStyle: TextStyleProp[]): React$Node {
        const {
            useDefaultSpace,
            role, text, testID, externalTextStyle,
            ...props
        } = this.props;
        const textForTestID = text && text.replace ? text.replace(/[^a-zA-Z0-9]/g, '') : 'custom_component';
        return (
            <Text
                {...props}
                testID={testID || `label_text_${textForTestID}`}
                style={[textStyle, externalTextStyle]}
            >
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
                // TODO: split UILabel style into View's `containerStyle` and a regular Text `style`
                <View style={(this.props.style: any)}>
                    {this.renderText(textStyle)}
                </View>
            );
        }

        textStyle.push(this.props.style);
        return this.renderText(textStyle);
    }
}
