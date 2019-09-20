// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, Text, Image, View, Platform } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIActionComponent from '../../UIActionComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UITooltip from '../../notifications/UITooltip';
import UITextStyle from '../../../helpers/UITextStyle';

import type { ActionProps, ActionState } from '../../UIActionComponent';

const TOOLTIP_WIDTH = 'auto';

const styles = StyleSheet.create({
    floatingTitle: {
        marginHorizontal: UIConstant.contentOffset(),
        marginBottom: -UIConstant.smallContentOffset(),
    },
    textButton: {
        backgroundColor: 'transparent',
    },
    alignLeft: {
        justifyContent: 'flex-start',
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
    // web-only style
    tooltipContainerStyle: {
        padding: UIConstant.mediumContentOffset(),
        width: TOOLTIP_WIDTH,
    },
});

type Props = ActionProps & {
    align: StylePropType,
    containerStyle?: StylePropType,
    buttonStyle?: StylePropType,
    details: string,
    detailsStyle?: StylePropType,
    icon: ?string,
    backIcon: ?string,
    iconColor?: string,
    iconHoverColor?: string,
    textStyle?: StylePropType,
    textHoverStyle?: StylePropType,
    textTappedStyle?: StylePropType,
    theme: string,
    title: string,
    tooltip?: string,
    hideFloatingTitle?: boolean,
    floatingTitle?: string,
};

type State = ActionState;

class UITextButton extends UIActionComponent<Props, State> {
    static Align = {
        Left: styles.alignLeft,
        Center: UIStyle.Common.justifyCenter(),
    };

    // Virtual
    onEnter = () => {
        const webStyle = (
            Platform.OS === 'web' ?
                styles.tooltipContainerStyle :
                null
        );
        if (this.props.tooltip) {
            UITooltip.showOnMouseForWeb(this.props.tooltip, webStyle);
        }
    };

    onLeave = () => {
        if (this.props.tooltip) {
            UITooltip.hideOnMouseForWeb();
        }
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
    renderFloatingTitle() {
        const {
            floatingTitle, hideFloatingTitle, theme,
        } = this.props;
        if (hideFloatingTitle) {
            return null;
        }

        const colorStyle = UIColor.textTertiaryStyle(theme);
        return (
            <View style={styles.floatingTitle}>
                <Text style={[UITextStyle.tinyRegular, colorStyle]}>
                    {floatingTitle}
                </Text>
            </View>
        );
    }

    renderIcon(icon: string, isBack: boolean) {
        if (!icon) {
            return null;
        }

        const {
            theme, disabled, iconHoverColor,
        } = this.props;
        const tapped = this.isTapped();
        const hover = this.isHover();

        const defaultColor = UIColor.actionTextPrimary(theme);
        const stateColorStyle = disabled || tapped || hover
            ? iconHoverColor || UIColor.stateTextPrimary(theme, disabled, tapped, hover)
            : null;
        const iconColor = stateColorStyle || this.props.iconColor || defaultColor;
        const styleColor = iconColor ? UIStyle.Color.getTintColorStyle(iconColor) : null;

        const iconStyle = [styleColor];
        if (this.props.title) {
            iconStyle.push(isBack ?
                UIStyle.Margin.leftDefault() :
                UIStyle.Margin.rightDefault());
        }

        return (<Image
            source={icon}
            style={iconStyle}
        />);
    }

    renderTitle() {
        const {
            title, textStyle, details, theme, disabled,
        } = this.props;
        if (!title) {
            return null;
        }
        const defaultFontStyle = UIFont.smallMedium();
        const tapped = this.isTapped();
        const hover = this.isHover();
        const defaultColorStyle = UIColor.actionTextPrimaryStyle(theme);
        const stateColorStyle = disabled || tapped || hover
            ? UIColor.stateTextPrimaryStyle(theme, disabled, tapped, hover)
            : null;
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
                numberOfLines={1}
                ellipsizeMode="middle"
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
            <Text style={[UIStyle.Text.secondarySmallRegular(), detailsStyle]}>
                {details}
            </Text>
        );
    }

    renderContent(): React$Node {
        const {
            buttonStyle, align, icon, backIcon, containerStyle, multiLine,
        } = this.props;
        const contStyle = multiLine
            ? []
            : [UIStyle.Common.centerLeftContainer(), UIStyle.Height.buttonHeight()];
        const style = [styles.textButton, ...contStyle, align, containerStyle];
        if (buttonStyle instanceof Array) {
            style.push(...buttonStyle);
        } else {
            style.push(buttonStyle);
        }
        if (this.props.style instanceof Array) {
            style.push(...this.props.style);
        } else {
            style.push(this.props.style);
        }
        return (
            <View style={UIStyle.Common.flexColumn()}>
                {this.renderFloatingTitle()}
                <View style={style}>
                    {this.renderIcon(icon, false)}
                    {this.renderTitle()}
                    {this.renderIcon(backIcon, true)}
                    {this.renderDetails()}
                </View>
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
    backIcon: null,
    theme: UIColor.Theme.Light,
    title: '',
    tooltip: null,
    multiLine: false,
    floatingTitle: '',
    hideFloatingTitle: true,
};
