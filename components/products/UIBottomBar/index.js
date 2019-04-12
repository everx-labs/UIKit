// @flow
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import StylePropType from 'react-style-proptype';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIColor from '../../../helpers/UIColor';
import UITextButton from '../../buttons/UITextButton';

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
    UIStyle.alignJustifyCenter,
    UIStyle.bigCellHeight,
    UIStyle.pageSlimContainer,
];

type MenuItem = {
    title: string,
    onPress?: () => void,
}

type Props = {
    text: string,
    textStyle: StylePropType,
    copyRight: string,
    menuItems: MenuItem[],
    companyName: string,
    address: string,
    location: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    mobile: boolean,
    screenWidth: number,
    containerStyle: StylePropType,
};

type State = {
    emailHover: boolean,
    emailTap: boolean,
};

export default class UIBottomBar extends UIComponent<Props, State> {
    isNarrow() {
        const { screenWidth, mobile } = this.props;
        if (!screenWidth) {
            return mobile;
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
        const { text, menuItems } = this.props;
        return !text && menuItems.length === 0;
    }

    renderEmail() {
        const { email } = this.props;
        if (!email) {
            return null;
        }
        // const primaryColorStyle = UIColor.getColorStyle(UIColor.textPrimary());
        // hoverTextStyle={primaryColorStyle}
        // tappedTextStyle={primaryColorStyle}
        return (
            <UITextButton
                value={email}
                onPress={() => Linking.openURL(`mailto:${email}`)}
            />
        );
    }

    renderCenterTextComponent(able: boolean) {
        const {
            companyName, address, phoneNumber, postalCode, textStyle, location,
        } = this.props;
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
                <Text style={[textStyle, UIStyle.textAlignCenter]}>
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
        const { text, textStyle } = this.props;
        if (this.hasNoLeftPart()) {
            return null;
        }
        return (
            <View style={UIStyle.flex} testID="left text >>">
                <Text style={textStyle}>
                    {text}
                </Text>
                {this.renderMenu()}
            </View>
        );
    }

    renderMenu() {
        const { menuItems, textStyle } = this.props;
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
                <TouchableOpacity
                    onPress={item.onPress}
                >
                    <Text style={textStyle}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
                {index === menuItems.length - 1 ? null : dot}
            </React.Fragment>
        ));

        return (
            <View style={UIStyle.flexRow}>
                {menu}
            </View>
        );
    }

    renderDesktopCenterText() {
        if (this.hasNoContacts()) {
            return null;
        }
        const mobile = this.isNarrow();
        return (
            <View style={UIStyle.flex} testID="center text >>">
                {this.renderCenterTextComponent(!mobile)}
            </View>
        );
    }

    renderCopyRight() {
        const { textStyle, copyRight } = this.props;
        const isShort = this.hasNoLeftPart() && this.hasNoContacts();
        const copyRightText = this.isNarrow() && !isShort ? '©' : copyRight;
        const align = isShort ? UIStyle.alignCenter : UIStyle.alignEnd;
        return (
            <View style={[UIStyle.flex, align]}>
                <Text style={textStyle}>
                    {copyRightText}
                </Text>
            </View>
        );
    }

    render() {
        const mobile = this.isNarrow();
        return (
            <View style={UIStyle.bottomScreenContainer}>
                <View style={this.props.containerStyle}>
                    <View style={styles.container}>

                        {this.renderLeft()}
                        {this.renderDesktopCenterText()}
                        {this.renderCopyRight()}

                    </View>
                    {this.renderCenterTextComponent(mobile)}
                </View>
            </View>
        );
    }

    static defaultProps: Props;
}

UIBottomBar.defaultProps = {
    textStyle: UITextStyle.tertiaryTinyRegular,
    containerStyle: {},
    menuItems: [],
    text: '',
    companyName: '',
    address: '',
    location: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    copyRight: '',
    mobile: true,
    screenWidth: 0,
};
