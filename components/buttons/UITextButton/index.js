// @flow
import React from 'react';
import { StyleSheet, Text, Image, View, Platform } from 'react-native';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIConstant from '../../../helpers/UIConstant';
import UIActionComponent from '../../UIActionComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UITooltip from '../../notifications/UITooltip';

import type { ActionProps, ActionState } from '../../UIActionComponent';

const TOOLTIP_WIDTH = 'auto';

const styles = StyleSheet.create({
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
    align: ViewStyleProp,
    style?: ViewStyleProp,
    containerStyle?: ViewStyleProp,
    buttonStyle?: ViewStyleProp,
    style?: ViewStyleProp,
    details: string,
    detailsStyle?: TextStyleProp,
    icon: ?string,
    backIcon: ?string,
    iconColor?: string,
    iconHoverColor?: string,
    textStyle?: TextStyleProp,
    textHoverStyle?: TextStyleProp,
    textTappedStyle?: TextStyleProp,
    theme: string,
    title: string,
    tooltip?: string,
};

type State = ActionState;

export default class UITextButton extends UIActionComponent<Props, State> {
    static align = {
        left: UIStyle.common.justifyStart(),
        center: UIStyle.common.justifyCenter(),
        between: UIStyle.common.justifySpaceBetween(),
    };

    // Deprecated
    static Align = {
        Left: UIStyle.common.justifyStart(),
        Center: UIStyle.common.justifyCenter(),
        Between: UIStyle.common.justifySpaceBetween(),
    };

    static defaultProps: Props = {
        ...UIActionComponent.defaultProps,
        align: UITextButton.Align.Left,
        details: '',
        icon: null,
        backIcon: null,
        theme: UIColor.Theme.Light,
        title: '',
        tooltip: null,
        multiLine: false,
    };

    static pushStyle(styleArray: ViewStyleProp[], newStyle: ViewStyleProp | ViewStyleProp[]) {
        if (newStyle instanceof Array) {
            styleArray.push(...newStyle);
        } else {
            styleArray.push(newStyle);
        }
    }

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

    getCommonStyle() {
        const result = [];
        UITextButton.pushStyle(result, this.props.containerStyle);
        UITextButton.pushStyle(result, this.props.buttonStyle);
        UITextButton.pushStyle(result, this.props.style);
        return result;
    }

    // Render
    renderIcon(icon: string, isBack: boolean) {
        if (!icon) {
            return null;
        }

        const {
            theme, disabled, iconHoverColor, title,
        } = this.props;
        const tapped = this.isTapped();
        const hover = this.isHover();

        const defaultColor = UIColor.actionTextPrimary(theme);
        const stateColorStyle = disabled || tapped || hover
            ? iconHoverColor || UIColor.stateTextPrimary(theme, disabled, tapped, hover)
            : null;
        const iconColor = stateColorStyle || this.props.iconColor || defaultColor;
        const styleColor = iconColor ? UIStyle.color.getTintColorStyle(iconColor) : null;

        const iconStyle = [styleColor];
        if (title) {
            iconStyle.push(isBack ? UIStyle.margin.leftDefault() : UIStyle.margin.rightDefault());
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
            <Text style={[UIStyle.text.secondarySmallRegular(), detailsStyle]}>
                {details}
            </Text>
        );
    }

    renderContent(): React$Node {
        const {
            align, icon, backIcon, multiLine,
        } = this.props;
        const commonStyle = this.getCommonStyle();
        const contStyle = multiLine
            ? []
            : [UIStyle.container.centerLeft(), UIStyle.height.buttonHeight()];
        const style = [UIStyle.common.backgroundTransparent(), ...contStyle, align];
        return (
            <View style={[UIStyle.common.flexColumn(), style, ...commonStyle]}>
                {this.renderIcon(icon, false)}
                {this.renderTitle()}
                {/*{this.renderIcon(backIcon, true)}*/}
                {this.renderDetails()}
            </View>
        );
    }
}
