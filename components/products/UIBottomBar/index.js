// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StylePropType from 'react-style-proptype';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIColor from '../../../helpers/UIColor';

import type { ClassNameProp } from '../../../types';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
        paddingHorizontal: UIConstant.contentOffset(),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

const bottomTextStyle = [
    UIStyle.alignJustifyCenter,
    UIStyle.bigCellHeight,
    UIStyle.pageSlimContainer,
];

type Props = {
    text: string,
    textStyle: StylePropType,
    companyName: string,
    address: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    mobile: boolean,
    screenWidth: number,
};

type State = {
    emailHover: boolean,
    emailTap: boolean,
};

export default class UIBottomBar extends UIComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            emailHover: false,
            emailTap: false,
        };
    }

    // Setters
    setEmailHover(emailHover: boolean = true) {
        this.setStateSafely({ emailHover });
    }

    setEmailTap(emailTap: boolean = true) {
        this.setStateSafely({ emailTap });
    }

    // Getters
    isEmailHover() {
        return this.state.emailHover;
    }

    isEmailTap() {
        return this.state.emailTap;
    }

    isMobile() {
        const { screenWidth, mobile } = this.props;
        if (!screenWidth) {
            return mobile;
        }
        return screenWidth < UIConstant.elasticWidthWide();
    }

    renderEmail() {
        const { email } = this.props;
        const primatyColorStyle = UIColor.getColorStyle(UIColor.textPrimary());
        const colorStyle = this.isEmailHover() || this.isEmailTap() ? primatyColorStyle : null;
        return (
            <Text
                accessibilityRole="link"
                href={`mailto:${email}`}
                onPressIn={() => this.setEmailTap()}
                onPressOut={() => this.setEmailTap(false)}
                onMouseEnter={() => this.setEmailHover()}
                onMouseLeave={() => this.setEmailHover(false)}
                style={colorStyle}
            >
                {email}
            </Text>
        );
    }


    renderCenterTextComponent() {
        const {
            companyName, address, phoneNumber, postalCode, textStyle,
        } = this.props;
        const classNameProp: ClassNameProp = { className: 'contacts' };
        return (
            <View
                style={bottomTextStyle}
                itemScope
                itemType="http://schema.org/Organization"
                {...classNameProp}
            >
                <Text style={[textStyle, UIStyle.textAlignCenter]}>
                    <Text itemProp="name" className="company">{companyName}</Text>
                    {', '}
                    <Text
                        itemProp="address"
                        itemScope
                        itemType="http://schema.org/PostalAddress"
                        className="address"
                    >
                        <Text itemProp="streetAddress" className="street">
                            {address}
                        </Text>
                        {', '}
                        <Text itemProp="postalCode">
                            {postalCode}
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

    renderCenterText() {
        const {
            address, phoneNumber, email, companyName, postalCode,
        } = this.props;
        if (!address && !phoneNumber && !email && !companyName && !postalCode) {
            return null;
        }
        const textComponent = this.renderCenterTextComponent();
        return this.isMobile()
            ? textComponent
            : (
                <View style={UIStyle.absoluteFillObject}>
                    {textComponent}
                </View>
            );
    }

    render() {
        const { text, textStyle } = this.props;
        const copyRight = this.isMobile() ? '©' : '2018–2019 © TON Labs';
        return (
            <View style={UIStyle.bottomScreenContainer}>
                <View style={UIStyle.marginBottomHuge}>
                    <View style={styles.container}>
                        <Text style={textStyle}>
                            {text}
                        </Text>
                        <Text style={textStyle}>
                            {copyRight}
                        </Text>
                    </View>
                    {this.renderCenterText()}
                </View>
            </View>
        );
    }

    static defaultProps: Props;
}

UIBottomBar.defaultProps = {
    textStyle: UITextStyle.tertiaryTinyRegular,
    text: '',
    companyName: '',
    address: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    mobile: true,
    screenWidth: 0,
};
