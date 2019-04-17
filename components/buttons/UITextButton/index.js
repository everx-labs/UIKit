// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, Text, Image, View } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIActionComponent from '../../UIActionComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import type { ActionProps, ActionState } from '../../UIActionComponent';

const styles = StyleSheet.create({
    textButton: {
        height: UIConstant.buttonHeight(),
        backgroundColor: 'transparent',
        alignItems: 'center',
        flexDirection: 'row',
    },
    alignLeft: {
        justifyContent: 'flex-start',
    },
    alignCenter: {
        justifyContent: 'center',
    },
    detailsText: {
        marginRight: UIConstant.contentOffset(),
    },
    flexGrow1: {
        flexGrow: 1,
    },
    flexGrow0: {
        flexGrow: 0,
    },
});

type Props = ActionProps & {
    align: StylePropType,
    buttonStyle?: StylePropType,
    details: string,
    detailsStyle?: StylePropType,
    icon: ?string,
    textStyle?: StylePropType,
    textHoverStyle?: StylePropType,
    textTappedStyle?: StylePropType,
    theme: string,
    title: string,
};

class UITextButton extends UIActionComponent<Props, ActionState> {
    static Align = {
        Left: styles.alignLeft,
        Center: styles.alignCenter,
    };

    getStateCustomColorStyle() {
        if (this.isTapped()) {
            return this.props.textTappedStyle;
        }
        if (this.isHover()) {
            return this.props.textHoverStyle;
        }
        return null;
    }

    // Render
    renderIcon() {
        const { icon } = this.props;
        if (!icon) {
            return null;
        }
        return <Image source={icon} style={UIStyle.marginRightDefault} />;
    }

    renderTitle() {
        const {
            title, textStyle, details, theme, disabled,
        } = this.props;
        const defaultFontStyle = UIFont.smallMedium();
        const tapped = this.isTapped();
        const hover = this.isHover();
        const defaultColorStyle = UIColor.actionTextPrimaryStyle(theme);
        const stateColorStyle = UIColor.stateTextPrimaryStyle(theme, disabled, tapped, hover);
        const stateCustomColorStyle = this.getStateCustomColorStyle();
        const flexGrow = details ? styles.flexGrow1 : styles.flexGrow0;
        return (
            <Text
                style={[
                    defaultFontStyle,
                    defaultColorStyle,
                    textStyle,
                    stateColorStyle,
                    stateCustomColorStyle,
                    flexGrow,
                ]}
            >
                {title}
            </Text>
        );
    }

    renderDetails() {
        const { details, detailsStyle } = this.props;
        if (!details || !details.length) {
            return null;
        }
        return (
            <Text style={[UITextStyle.secondarySmallRegular, detailsStyle]}>
                {details}
            </Text>
        );
    }

    renderContent(): React$Node {
        const { buttonStyle, align } = this.props;
        return (
            <View style={[
                styles.textButton,
                align,
                buttonStyle,
            ]}
            >
                {this.renderIcon()}
                {this.renderTitle()}
                {this.renderDetails()}
            </View>
        );
    }

    static defaultProps: Props;
}

export default UITextButton;

UITextButton.defaultProps = {
    ...UIActionComponent.defaultProps,
    align: UITextButton.Align.Left,
    details: '',
    icon: null,
    theme: UIColor.Theme.Light,
    title: '',
};
