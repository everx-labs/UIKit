// @flow
import React from 'react';
import { View } from 'react-native';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIStyle } from '@tonlabs/uikit.core';
import { UIActionComponent } from '@tonlabs/uikit.components';
import { TypographyVariants, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import type {
    UIActionComponentProps,
    UIActionComponentState,
} from '@tonlabs/uikit.components';

export type MenuItemType = UIActionComponentProps & {
    style?: ViewStyleProp,
    title: string,
    titleStyle?: TextStyleProp,
    titleRole?: TypographyVariants,
    details?: string,
    detailsStyle?: TextStyleProp,
    chosen?: boolean,
    reversedColors?: boolean,
};

export default class MenuItem extends UIActionComponent<
    MenuItemType,
    UIActionComponentState
> {
    static defaultProps: MenuItemType = {
        ...UIActionComponent.defaultProps,
        reversedColors: false,
        chosen: false,
        titleStyle: null,
        details: '',
        detailsStyle: null,
    };

    static testIDs = {
        menuItem: (value: string) => `menuItem_${value}`,
    };

    renderContent() {
        const {
            title, details, titleStyle, titleRole, detailsStyle, chosen, disabled, reversedColors, style,
        } = this.props;

        const contentStyle = details
            ? UIStyle.common.justifySpaceBetween()
            : UIStyle.common.justifyCenter();
        const marginRight = details ? UIStyle.margin.rightDefault() : null;

        const chosenStraight = reversedColors ? !chosen : chosen;
        const defaultTitleStyle = chosenStraight
            // TODO: ex UIStyle.color.stateTextPrimary(UIColor.Theme.Light, disabled, this.isTapped(), this.isHover())
            ? UILabelColors.TextPrimary
            : UILabelColors.TextAccent;
        const defaultDetailsStyle = chosenStraight
            ? UILabelColors.TextPrimary
            : UILabelColors.TextTertiary;

        const containerStyle = [
            UIStyle.common.centerLeftContainer(),
            UIStyle.height.buttonHeight(),
            contentStyle,
            style,
        ];

        const content = (
            <React.Fragment>
                <UILabel
                    color={disabled ? UILabelColors.TextTertiary : (titleStyle || defaultTitleStyle)}
                    numberOfLines={1}
                    role={titleRole || UILabelRoles.ActionCallout}
                    style={marginRight}
                    testID={MenuItem.testIDs.menuItem(title)}
                >
                    {title}
                </UILabel>
                <UILabel
                    color={detailsStyle || defaultDetailsStyle}
                    numberOfLines={1}
                    role={UILabelRoles.ParagraphNote}
                >
                    {details}
                </UILabel>
            </React.Fragment>
        );

        return (
            <View style={containerStyle}>
                {content}
            </View>
        );
    }
}
