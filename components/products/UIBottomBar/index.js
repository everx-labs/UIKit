// @flow
import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';

import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

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
    UIStyle.flex.alignJustifyCenter(),
    UIStyle.height.bigCell(),
];

type MenuItem = {
    href: string,
    title: string,
    onPress?: () => void,
    componentClass?: any,
}

type Props = {
    theme?: UIColorThemeNameType,
    leftText: string,
    accentText: string,
    accentEmail: string,
    textStyle: TextStyleProp,
    copyRight: string,
    copyRightIcon: ?ImageSource,
    disclaimer: string,
    menuItems: MenuItem[],
    companyName: string,
    address: string,
    location: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    info: string,
    isNarrow: boolean,
    screenWidth: number,
    containerStyle: ViewStyleProp,
    onPressCopyRight: () => void,
};

type State = {
    emailHover: boolean,
    emailTap: boolean,
};

export default class UIBottomBar extends UIComponent<Props, State> {
    static getItemProp(name: string): Object {
        return { itemProp: name };
    }

    // Getters
    textStyle() {
        const { theme, textStyle } = this.props;
        const colorStyle = UIColor.textTertiaryStyle(theme);
        return [UIStyle.text.tinyMedium(), colorStyle, textStyle];
    }

    textAccentStyle() {
        const { theme, textStyle } = this.props;
        const colorStyle = UIColor.textSecondaryStyle(theme);
        return [UIStyle.text.tinyMedium(), colorStyle, textStyle];
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

    hasNoPhoneNumber() {
        return !this.props.phoneNumber;
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
            <View style={[styles.container, UIStyle.flex.justifyCenter()]}>
                <Text>
                    <Text style={accentStyle}>
                        {accentText}
                    </Text>
                    {' '}
                    <UITextButton
                        title={accentEmail}
                        buttonStyle={UIStyle.height.tinyCell()}
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
                buttonStyle={UIStyle.height.tinyCell()}
                textStyle={this.textStyle()}
                textHoverStyle={primaryColorStyle}
                textTappedStyle={primaryColorStyle}
                onPress={() => {
                    Linking.openURL(`mailto:${email}`);
                }}
            />
        );
    }

    renderContacts(able: boolean) {
        const {
            companyName,
            address,
            phoneNumber,
            postalCode,
            location,
            info,
        } = this.props;
        const textStyle = [this.textStyle(), UIStyle.text.alignCenter()];
        if (!able || this.hasNoContacts()) {
            return null;
        }
        return (
            // $FlowExpectedError
            <View
                testID="bottomBar"
                style={bottomTextStyle}
                itemScope
                itemType="http://schema.org/Organization"
            >
                <Text style={textStyle} {...UIBottomBar.getItemProp('name')}>
                    {companyName}
                </Text>
                <Text
                    {...UIBottomBar.getItemProp('address')}
                    itemScope
                    itemType="http://schema.org/PostalAddress"
                    style={textStyle}
                >
                    <Text {...UIBottomBar.getItemProp('streetAddress')}>
                        {address}
                    </Text>
                    {', '}
                    <Text {...UIBottomBar.getItemProp('postalCode')}>
                        {postalCode}
                    </Text>
                    {', '}
                    <Text {...UIBottomBar.getItemProp('addressLocality')}>
                        {location}
                    </Text>
                </Text>
                <Text style={textStyle}>
                    {info}
                </Text>
                <Text style={textStyle}>
                    {this.renderEmail()}
                    {
                        this.hasNoPhoneNumber() ? null : (
                            <React.Fragment>
                                {'   ·  '}
                                <Text {...UIBottomBar.getItemProp('telephone')}>{phoneNumber}</Text>
                            </React.Fragment>
                        )
                    }
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
            <View style={[UIStyle.flex.x1(), UIStyle.container.centerLeft()]}>
                <Text style={[UIStyle.text.tinyMedium(), textStyle]}>
                    {leftText}
                </Text>
                {this.renderMenu()}
            </View>
        );
    }

    renderMenu() {
        const { menuItems } = this.props;
        const textStyle = this.textStyle();
        if (!menuItems.length) {
            return null;
        }
        const dot = (
            <Text style={textStyle}>
                {'  ·  '}
            </Text>
        );
        const menu = menuItems.map(({
            title, href, componentClass, onPress,
        }, index) => {
            const Component = componentClass || UITextButton;
            return (
                <React.Fragment key={`bottom-bar-menu-item-${title}`}>
                    <Component
                        href={href}
                        title={title}
                        buttonStyle={UIStyle.height.bigCell()}
                        textStyle={textStyle}
                        textHoverStyle={UIColor.textPrimaryStyle()}
                        textTappedStyle={UIColor.textPrimaryStyle()}
                        onPress={onPress}
                    />
                    {index === menuItems.length - 1 ? null : dot}
                </React.Fragment>
            );
        });

        return (
            <View style={UIStyle.container.centerLeft()}>
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
            <View style={UIStyle.flex.x1()}>
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
        const { copyRight, onPressCopyRight, copyRightIcon } = this.props;
        const textStyle = this.textStyle();
        const isShort = this.hasNoLeftPart() && this.hasNoContacts();
        const isNarrowAndNotShort = this.isNarrow() && !isShort;
        const copyRightText = isNarrowAndNotShort ? '' : copyRight;
        const align = isShort ? UIStyle.flex.alignCenter() : UIStyle.flex.alignEnd();
        const flex = isNarrowAndNotShort ? null : UIStyle.flex.x1();
        return (
            <View style={[flex, align]}>
                <Text style={textStyle}>
                    <UITextButton
                        icon={isNarrowAndNotShort && copyRightIcon}
                        iconColor={isNarrowAndNotShort && UIColor.textTertiary()}
                        iconHoverColor={isNarrowAndNotShort && UIColor.textPrimary()}
                        title={copyRightText}
                        textStyle={textStyle}
                        textHoverStyle={UIColor.textPrimaryStyle()}
                        textTappedStyle={UIColor.textPrimaryStyle()}
                        onPress={onPressCopyRight}
                    />
                    {this.renderDisclaimer()}
                </Text>
            </View>
        );
    }

    render() {
        const narrow = this.isNarrow();
        return (
            <View style={UIStyle.container.bottomScreen()}>
                <View style={this.props.containerStyle}>
                    {this.renderAccentText()}
                    <View style={styles.container}>
                        {this.renderLeft()}
                        {this.renderDesktopContacts()}
                        {this.renderCopyRight()}
                    </View>
                    {this.renderContacts(narrow)}
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
    info: '',

    copyRight: '',
    copyRightIcon: null,
    disclaimer: '',

    isNarrow: true,
    screenWidth: 0,

    onPressCopyRight: () => { Linking.openURL('https://tonlabs.io'); },
};
