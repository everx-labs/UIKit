// @flow
import React from 'react';
import { StyleSheet, Text, Image, View, Platform } from 'react-native';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

import {
    UIConstant,
    UIStyle,
    UIColor,
    UIFunction,
} from '@tonlabs/uikit.core';
import { Typography, TypographyVariants, UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import { UIActionComponent } from '../UIActionComponent';
import type {
    UIActionComponentProps,
    UIActionComponentState,
} from '../UIActionComponent';
import UITooltip from '../UITooltip';

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

type Props = UIActionComponentProps & {
    align: ViewStyleProp,
    style?: ViewStyleProp,
    containerStyle?: ViewStyleProp,
    buttonStyle?: ViewStyleProp,
    details: string,
    detailsStyle?: TextStyleProp,
    disableIconColor?: boolean,
    icon: ?ImageSource,
    backIcon: ?ImageSource,
    iconColor?: string,
    iconHoverColor?: string,
    textStyle?: TextStyleProp,
    textHoverStyle?: TextStyleProp,
    textTappedStyle?: TextStyleProp,
    theme: string,
    title: string,
    titleColor?: TextStyleProp,
    titleRole?: TextStyleProp,
    tooltip?: string,
    multiLine: boolean,
};

type State = UIActionComponentState;

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
        align: UITextButton.align.left,
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

    // Render
    renderIcon(icon: ImageSource, isBack: boolean) {
        if (!icon) {
            return null;
        }

        const {
            theme, disabled, iconHoverColor, title, disableIconColor,
        } = this.props;
        const tapped = this.isTapped();
        const hover = this.isHover();

        const defaultColor = UIColor.actionTextPrimary(theme);
        const stateColorStyle = disabled || tapped || hover
            ? iconHoverColor || UIColor.stateTextPrimary(theme, disabled, tapped, hover)
            : null;
        const iconColor = !disableIconColor
            ? stateColorStyle || this.props.iconColor || defaultColor
            : null;
        const styleColor = iconColor ? UIStyle.color.getTintColorStyle(iconColor) : null;

        const iconStyle = [styleColor];
        if (title) {
            iconStyle.push(isBack ? UIStyle.margin.leftSmall() : UIStyle.margin.rightSmall());
        }

        return (<Image
            source={icon}
            style={iconStyle}
        />);
    }

    renderTitle() {
        const {
            title, titleColor, titleRole, textStyle, details, theme, disabled, multiLine,
        } = this.props;
        if (!title) {
            return null;
        }
        const tapped = this.isTapped();
        const hover = this.isHover();
        const stateColorStyle = disabled || tapped || hover
            ? UIColor.stateTextPrimaryStyle(theme, disabled, tapped, hover)
            : null;
        const stateCustomColorStyle = this.getStateCustomColorStyle();
        const flexGrow = details ? styles.flexGrow1 : styles.flexGrow0;
        const numberOfLines = multiLine ? null : { numberOfLines: 1 };

        return (
            <UILabel
                color={titleColor || UILabelColors.TextAccent}
                ellipsizeMode="middle"
                role={titleRole ||  UILabelRoles.ActionCallout}
                {...numberOfLines}
                style={[
                    stateColorStyle,
                    stateCustomColorStyle,
                    stateColorStyle,
                    textStyle,
                    flexGrow,
                ]}
            >
                {title}
            </UILabel>
        );
    }

    renderDetails() {
        const { details, detailsStyle } = this.props;
        if (!details || !details.length) {
            return null;
        }
        return (
            <UILabel
                color={UILabelColors.TextSecondary}
                role={UILabelRoles.ParagraphNote}
                style={detailsStyle}
            >
                {details}
            </UILabel>
        );
    }

    renderContent(): React$Element<any> {
        const {
            align, icon, backIcon, multiLine, containerStyle, buttonStyle,
        } = this.props;
        const commonStyle = UIFunction.combineStyles([
            this.props.style, containerStyle, buttonStyle,
        ]);
        const contStyle = multiLine
            ? []
            : [UIStyle.container.centerLeft(), UIStyle.height.buttonHeight()];
        const style = [UIStyle.common.backgroundTransparent(), ...contStyle, align];
        return (
            <View style={[UIStyle.common.flexColumn(), style, ...commonStyle]}>
                {this.renderIcon(icon, false)}
                {this.renderTitle()}
                {this.renderIcon(backIcon, true)}
                {this.renderDetails()}
            </View>
        );
    }
}
