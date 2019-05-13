// @flow
import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import StylePropType from 'react-style-proptype';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UITextButton from '../../buttons/UITextButton';
import UITooltip from '../../notifications/UITooltip';
import UILocalized from '../../../helpers/UILocalized';

import type { UIColorThemeNameType } from '../../../helpers/UIColor/UIColorTypes';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
        paddingHorizontal: UIConstant.contentOffset(),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

const bottomTextStyle = [
    UIStyle.Common.alignJustifyCenter(),
    UIStyle.Height.bigCell(),
    UIStyle.Common.pageSlimContainer(),
];

type MenuItem = {
    title: string,
    onPress?: () => void,
}

type Props = {
    theme?: UIColorThemeNameType,
    leftText: string,
    accentText: string,
    accentEmail: string,
    textStyle: StylePropType,
    copyRight: string,
    disclaimer: string,
    menuItems: MenuItem[],
    companyName: string,
    address: string,
    location: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    isNarrow: boolean,
    screenWidth: number,
    containerStyle: StylePropType,
};

type State = {
    emailHover: boolean,
    emailTap: boolean,
};

export default class UIBottomBar extends UIComponent<Props, State> {
    // Getters
    textStyle() {
        const { theme, textStyle } = this.props;
        const colorStyle = UIColor.textTertiaryStyle(theme);
        return [UIStyle.Text.tinyMedium(), colorStyle, textStyle];
    }

    textAccentStyle() {
        const { theme, textStyle } = this.props;
        const colorStyle = UIColor.textSecondaryStyle(theme);
        return [UIStyle.Text.tinyMedium(), colorStyle, textStyle];
    }

    isNarrow() {
        const { screenWidth, isNarrow } = this.props;
        if (!screenWidth) {
            return isNarrow;
        }
        return screenWidth < UIConstant.elasticWidthWide();
    }

    hasNoContacts() {
        const {
            companyName, address, phoneNumber, postalCode, location,
        } = this.props;
        return !companyName && !address && !phoneNumber && !postalCode && !location;
    }

    hasNoLeftPart() {
        const { leftText, menuItems } = this.props;
        return !leftText && menuItems.length === 0;
    }

    // Render
    renderAccentText() {
        const { accentText, accentEmail } = this.props;
        if (!accentText && !accentEmail) {
            return null;
        }
        const accentStyle = this.textAccentStyle();
        return (
            <View style={[styles.container, UIStyle.Common.justifyCenter()]}>
                <Text>
                    <Text style={accentStyle}>
                        {accentText}
                    </Text>
                    {' '}
                    <UITextButton
                        title={accentEmail}
                        buttonStyle={UIStyle.Height.tinyCell()}
                        textStyle={accentStyle}
                        textHoverStyle={accentStyle}
                        textTappedStyle={accentStyle}
                        onPress={() => { Linking.openURL(`mailto:${accentEmail}`); }}
                    />
                </Text>
            </View>
        );
    }

    renderEmail() {
        const { email } = this.props;
        if (!email) {
            return null;
        }
        const primaryColorStyle = UIColor.textPrimaryStyle();
        return (
            <UITextButton
                title={email}
                buttonStyle={UIStyle.Height.tinyCell()}
                textStyle={this.textStyle()}
                textHoverStyle={primaryColorStyle}
                textTappedStyle={primaryColorStyle}
                onPress={() => { Linking.openURL(`mailto:${email}`); }}
            />
        );
    }

    renderContacts(able: boolean) {
        const {
            companyName, address, phoneNumber, postalCode, location,
        } = this.props;
        const textStyle = this.textStyle();
        if (!able || this.hasNoContacts()) {
            return null;
        }
        const itemProps: {} = {
            itemScope: true,
            itemType: 'http://schema.org/Organization',
        };
        return (
            <View
                testID="bottomBar"
                style={bottomTextStyle}
                {...itemProps}
            >
                <Text style={[textStyle, UIStyle.Text.alignCenter()]}>
                    <Text itemProp="name">{companyName}</Text>
                    {', '}
                    <Text
                        itemProp="address"
                        itemScope
                        itemType="http://schema.org/PostalAddress"
                    >
                        <Text itemProp="streetAddress">
                            {address}
                        </Text>
                        {', '}
                        <Text itemProp="postalCode">
                            {postalCode}
                        </Text>
                        {', '}
                        <Text itemProp="addressLocality">
                            {location}
                        </Text>
                        {' '}
                        {this.renderEmail()}
                        {'  ·  '}
                    </Text>
                    <Text itemProp="telephone">{phoneNumber}</Text>
                </Text>
            </View>
        );
    }

    renderLeft() {
        const { leftText } = this.props;
        const textStyle = this.textStyle();
        if (this.hasNoLeftPart()) {
            return null;
        }
        return (
            <View style={[UIStyle.Common.flex(), UIStyle.Common.centerLeftContainer()]}>
                <Text style={[UIStyle.Text.tinyMedium(), textStyle]}>
                    {leftText}
                </Text>
                {this.renderMenu()}
            </View>
        );
    }

    renderMenu() {
        const { menuItems } = this.props;
        const textStyle = this.textStyle();
        if (menuItems.length === 0) {
            return null;
        }
        const dot = (
            <Text style={textStyle}>
                {'  ·  '}
            </Text>
        );
        const menu = menuItems.map((item, index) => (
            <React.Fragment key={`bottom-bar-menu-item-${item.title}`}>
                <UITextButton
                    title={item.title}
                    buttonStyle={UIStyle.Height.tinyCell()}
                    textStyle={textStyle}
                    textHoverStyle={UIColor.textPrimaryStyle()}
                    textTappedStyle={UIColor.textPrimaryStyle()}
                    onPress={item.onPress}
                />
                {index === menuItems.length - 1 ? null : dot}
            </React.Fragment>
        ));

        return (
            <View style={UIStyle.Common.flexRow()}>
                {menu}
            </View>
        );
    }

    renderDesktopContacts() {
        if (this.hasNoContacts()) {
            return null;
        }
        const mobile = this.isNarrow();
        return (
            <View style={UIStyle.Common.flex()}>
                {this.renderContacts(!mobile)}
            </View>
        );
    }

    renderDisclaimer() {
        const { disclaimer, textStyle } = this.props;
        if (!disclaimer) {
            return null;
        }
        return (
            <UITooltip message={disclaimer}>
                <Text style={textStyle}>
                    {'. '}
                    {UILocalized.Disclaimer}
                </Text>
            </UITooltip>
        );
    }

    renderCopyRight() {
        const { copyRight } = this.props;
        const textStyle = this.textStyle();
        const isShort = this.hasNoLeftPart() && this.hasNoContacts();
        const copyRightText = this.isNarrow() && !isShort ? '©' : copyRight;
        const align = isShort ? UIStyle.Common.alignCenter() : UIStyle.Common.alignEnd();
        return (
            <View style={[UIStyle.Common.flex(), align]}>
                <Text style={textStyle}>
                    {copyRightText}
                    {this.renderDisclaimer()}
                </Text>
            </View>
        );
    }

    render() {
        const mobile = this.isNarrow();
        return (
            <View style={UIStyle.Common.bottomScreenContainer()}>
                <View style={this.props.containerStyle}>
                    {this.renderAccentText()}
                    <View style={styles.container}>
                        {this.renderLeft()}
                        {this.renderDesktopContacts()}
                        {this.renderCopyRight()}
                    </View>
                    {this.renderContacts(mobile)}
                </View>
            </View>
        );
    }

    static defaultProps: Props;
}

UIBottomBar.defaultProps = {
    theme: UIColor.Theme.Light,
    textStyle: {},
    containerStyle: {},

    menuItems: [],
    leftText: '',
    accentText: '',
    accentEmail: '',

    companyName: '',
    address: '',
    location: '',
    postalCode: '',
    phoneNumber: '',
    email: '',

    copyRight: '',
    disclaimer: '',

    isNarrow: true,
    screenWidth: 0,
};
