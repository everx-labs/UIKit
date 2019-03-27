// @flow
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

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

type Props = {
    text: string,
    screenWidth: number,
};

type State = {};

export default class UIBottomBar extends UIComponent<Props, State> {
    isMobile() {
        const { screenWidth, mobile } = this.props;
        if (!screenWidth) {
            return mobile;
        }
        return screenWidth < UIConstant.elasticWidthWide();
    }

    renderCenterText() {
        const { bottomText, textStyle } = this.props;
        if (!bottomText) {
            return null;
        }
        const textComponent = (
            <View style={[
                UIStyle.alignJustifyCenter,
                UIStyle.bigCellHeight,
                UIStyle.marginHorizontalOffset,
                UIStyle.pageSlimContainer,
            ]}
            >
                <Text style={[textStyle, UIStyle.textAlignCenter]}>
                    {bottomText}
                </Text>
            </View>
        );
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
        );
    }

    static defaultProps: Props;
}

UIBottomBar.defaultProps = {
    textStyle: UITextStyle.tertiaryTinyRegular,
    text: '',
    bottomText: '',
    mobile: true,
    screenWidth: 0,
};

