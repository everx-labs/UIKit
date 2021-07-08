// @flow
import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import type {
    ViewStyleProp,
    TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIComponent, UITooltip } from '@tonlabs/uikit.components';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    UILinkButton,
    UILinkButtonIconPosition,
    UILinkButtonSize,
} from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

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
};

type Props = {
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
    isNarrow() {
        const { screenWidth, isNarrow } = this.props;
        if (!screenWidth) {
            return isNarrow;
        }
        return screenWidth < UIConstant.elasticWidthWide();
    }

    hasNoContacts() {
        const {
            companyName,
            address,
            phoneNumber,
            postalCode,
            location,
        } = this.props;
        return (
            !companyName && !address && !phoneNumber && !postalCode && !location
        );
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
        return (
            <View style={[styles.container, UIStyle.flex.justifyCenter()]}>
                <UILabel>
                    <UILabel
                        color={UILabelColors.TextSecondary}
                        role={UILabelRoles.ActionFootnote}
                    >
                        {accentText}
                    </UILabel>
                    <UILinkButton
                        title={accentEmail}
                        size={UILinkButtonSize.Small}
                        onPress={() => {
                            Linking.openURL(`mailto:${accentEmail}`);
                        }}
                    />
                </UILabel>
            </View>
        );
    }

    renderEmail() {
        const { email } = this.props;
        if (!email) {
            return null;
        }
        return (
            <UILinkButton
                title={email}
                size={UILinkButtonSize.Small}
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
            textStyle: style,
        } = this.props;
        const textStyle = [style, UIStyle.text.alignCenter()];
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
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.ActionFootnote}
                    style={textStyle}
                    {...UIBottomBar.getItemProp('name')}
                >
                    {companyName}
                </UILabel>
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.ActionFootnote}
                    style={textStyle}
                    itemScope
                    itemType="http://schema.org/PostalAddress"
                    {...UIBottomBar.getItemProp('address')}
                >
                    <UILabel
                        color={UILabelColors.TextTertiary}
                        role={UILabelRoles.ActionFootnote}
                        {...UIBottomBar.getItemProp('streetAddress')}
                    >
                        {address}
                    </UILabel>
                    {', '}
                    <UILabel
                        color={UILabelColors.TextTertiary}
                        role={UILabelRoles.ActionFootnote}
                        {...UIBottomBar.getItemProp('postalCode')}
                    >
                        {postalCode}
                    </UILabel>
                    {', '}
                    <UILabel
                        color={UILabelColors.TextTertiary}
                        role={UILabelRoles.ActionFootnote}
                        {...UIBottomBar.getItemProp('addressLocality')}
                    >
                        {location}
                    </UILabel>
                </UILabel>
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.ActionFootnote}
                    style={textStyle}
                >
                    {info}
                </UILabel>
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.ActionFootnote}
                    style={textStyle}
                >
                    {this.renderEmail()}
                    {this.hasNoPhoneNumber() ? null : (
                        <React.Fragment>
                            {'   ·  '}
                            <UILabel
                                color={UILabelColors.TextTertiary}
                                role={UILabelRoles.ActionFootnote}
                                {...UIBottomBar.getItemProp('telephone')}
                            >
                                {phoneNumber}
                            </UILabel>
                        </React.Fragment>
                    )}
                </UILabel>
            </View>
        );
    }

    renderLeft() {
        const { leftText, textStyle } = this.props;
        if (this.hasNoLeftPart()) {
            return null;
        }
        return (
            <View style={[UIStyle.flex.x1(), UIStyle.container.centerLeft()]}>
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.ActionFootnote}
                    style={textStyle}
                >
                    {leftText}
                </UILabel>
                {this.renderMenu()}
            </View>
        );
    }

    renderMenu() {
        const { menuItems, textStyle } = this.props;
        if (!menuItems.length) {
            return null;
        }
        const dot = <UILabel
            color={UILabelColors.TextTertiary}
            role={UILabelRoles.ActionFootnote}
            style={textStyle}
        >{'  ·  '}</UILabel>;
        const menu = menuItems.map(
            ({ title, href, componentClass, onPress }, index) => {
                const Component = componentClass || UILinkButton;
                return (
                    <React.Fragment key={`bottom-bar-menu-item-${title}`}>
                        <Component
                            href={href}
                            title={title}
                            onPress={onPress}
                        />
                        {index === menuItems.length - 1 ? null : dot}
                    </React.Fragment>
                );
            }
        );

        return <View style={UIStyle.container.centerLeft()}>{menu}</View>;
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
                <UILabel style={textStyle}>
                    {'. '}
                    {uiLocalized.Disclaimer}
                </UILabel>
            </UITooltip>
        );
    }

    renderCopyRight() {
        const { copyRight, onPressCopyRight, copyRightIcon, textStyle } = this.props;
        const isShort = this.hasNoLeftPart() && this.hasNoContacts();
        const isNarrowAndNotShort = this.isNarrow() && !isShort;
        const copyRightText = isNarrowAndNotShort ? '' : copyRight;
        const align = isShort
            ? UIStyle.flex.alignCenter()
            : UIStyle.flex.alignEnd();
        const flex = isNarrowAndNotShort ? null : UIStyle.flex.x1();
        return (
            <View style={[flex, align]}>
                <UILabel
                    color={UILabelColors.TextTertiary}
                    role={UILabelRoles.ActionFootnote}
                    style={textStyle}
                >
                    <UILinkButton
                        title={copyRightText}
                        icon={isNarrowAndNotShort && copyRightIcon}
                        iconPosition={UILinkButtonIconPosition.Middle}
                        onPress={onPressCopyRight}
                    />
                    {this.renderDisclaimer()}
                </UILabel>
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

    onPressCopyRight: () => {
        Linking.openURL('https://tonlabs.io');
    },
};
