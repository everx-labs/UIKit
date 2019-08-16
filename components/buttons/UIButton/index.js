// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Image } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIBadge from '../../design/UIBadge';
import UINotice from '../../notifications/UINotice';
import UIActionComponent from '../../UIActionComponent';

import IconAnimation from './IconAnimation';

import type { ActionProps, ActionState } from '../../UIActionComponent';

const iconDefault = require('../../../assets/ico-triangle/ico-triangle.png');

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    badgeContainer: {
        marginRight: UIConstant.smallContentOffset(),
    },
    title: {
        ...UIFont.bodyMedium(),
    },
    extension: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: UIColor.overlay20(),
    },
    buttonContainerStyle: {
        flex: 1,
        paddingHorizontal: UIConstant.contentOffset(),
    },
});

type Props = ActionProps & {
    /** Number for badged button */
    badge?: number,
    /** useful for iPhone X (SafeArea) */
    bottomExtend?: boolean,
    /** One of: UIButton.ButtonSize.Large, UIButton.ButtonSize.Medium, UIButton.ButtonSize.Small, UIButton.ButtonSize.Default */
    buttonSize?: string,
    /** One of: UIButton.ButtonShape.Radius, UIButton.ButtonShape.Rounded, UIButton.ButtonShape.Full, UIButton.ButtonShape.Default */
    buttonShape?: string,
    /** One of: UIButton.ButtonStyle.Full, UIButton.ButtonStyle.Border, UIButton.ButtonStyle.Link */
    buttonStyle?: string,
    /** use it for additional data */
    count?: string,
    /** use it for additional data */
    data?: string,
    /** @ignore */
    footer?: boolean,
    /** use it for default left icon, ignore it if use icon prop */
    hasIcon?: boolean,
    /** use it for default right icon, ignore it if use iconR prop */
    hasIconR?: boolean,
    /** uri to left icon */
    icon?: ?string,
    /** uri to right icon */
    iconR?: ?string,
    /** specify in addition to showIndicator props, one of:
        UIButton.Indicator.Spin, UIButton.Indicator.Round, UIButton.ButtonStyle.Sandglass, UIButton.ButtonStyle.Pulse
     */
    indicatorAnimation?: string,
    /** button container style */
    style?: StylePropType,
    /** text align, one of: UIButton.TextAlign.Center, UIButton.TextAlign.Left */
    textAlign?: string,
    /** button title style */
    textStyle?: StylePropType,
    /** Visible button title */
    title?: string,
    /** @ignore */
    theme?: string,
};

type State = ActionState;

export default class UIButton extends UIActionComponent<Props, State> {
    static ButtonSize = {
        Default: 'default',
        Large: 'large',
        Medium: 'medium',
        Small: 'small',
    };

    static ButtonShape = {
        Default: 'default',
        Radius: 'radius',
        Rounded: 'rounded',
        Full: 'full',
    };

    static ButtonStyle = {
        Full: 'full',
        Border: 'border',
        Link: 'link',
    };

    static TextAlign = {
        Center: 'center',
        Left: 'left',
        Right: 'right',
    };

    static Indicator = {
        Spin: 'spin',
        Round: 'round',
        Sandglass: 'sandglass',
        Pulse: 'pulse',
    };

    insetKey: string;

    componentDidMount() {
        super.componentDidMount();
        this.setInsetIfFooter();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.removeInsetIfFooter();
    }

    // Events

    // Getters
    getButtonHeight() {
        switch (this.props.buttonSize) {
        case UIButton.ButtonSize.Large:
            return UIConstant.largeButtonHeight();
        case UIButton.ButtonSize.Medium:
            return UIConstant.mediumButtonHeight();
        case UIButton.ButtonSize.Small:
            return UIConstant.smallButtonHeight();
        default: // UIButton.ButtonSize.Default
            return UIConstant.buttonHeight();
        }
    }

    getButtonRadius() {
        switch (this.props.buttonShape) {
        case UIButton.ButtonShape.Radius:
            return UIConstant.smallBorderRadius();
        case UIButton.ButtonShape.Rounded:
            return this.getButtonHeight() / 2.0;
        case UIButton.ButtonShape.Full:
            return 0;
        default: // UIButton.ButtonShape.Default
            return UIConstant.tinyBorderRadius();
        }
    }

    getButtonColor() {
        let color;
        const { theme, disabled } = this.props;
        if (disabled) {
            color = UIColor.backgroundQuarter(theme);
        } else {
            const tapped = this.isTapped();
            const hover = this.isHover();
            color = UIColor.buttonBackground(theme, tapped, hover);
        }
        return color;
    }

    getButtonColorStyle() {
        return UIColor.getBackgroundColorStyle(this.getButtonColor());
    }

    getBorderStyle() {
        return { borderColor: this.getButtonColor(), borderWidth: 1 };
    }

    getTextColor() {
        const { theme, disabled, buttonStyle } = this.props;
        let color = UIColor.buttonTitle(theme, disabled);
        if (!disabled && buttonStyle !== UIButton.ButtonStyle.Full) {
            // Border or Link
            color = this.getButtonColor();
        }
        return color;
    }

    getTitleColorStyle() {
        return UIColor.getColorStyle(this.getTextColor());
    }

    getIconTintStyle() {
        return UIColor.getTintColorStyle(this.getTextColor());
    }

    // Actions
    setInsetIfFooter() {
        if (!this.props.footer) {
            return;
        }
        const height = this.getButtonHeight();
        this.insetKey = `UIButton~key~${new Date().toLocaleString()}`;
        UINotice.setAdditionalInset(this.insetKey, height);
    }

    removeInsetIfFooter() {
        if (!this.props.footer) {
            return;
        }
        UINotice.removeAdditionalInset(this.insetKey);
    }

    // render
    renderIcon(icon: string, position: string) {
        if (this.shouldShowIndicator()) {
            return null;
        }

        const style = [this.getIconTintStyle()];
        if (this.props.title) {
            if (position === 'left') {
                style.push(UIStyle.Margin.rightSmall());
            } else if (position === 'right') {
                style.push(UIStyle.Margin.leftSmall());
            }
        }

        return <Image source={icon || iconDefault} style={style} />;
    }

    renderIconL() {
        if (!this.props.icon && !this.props.hasIcon) return null;
        return this.renderIcon(this.props.icon, 'left');
    }

    renderIconR() {
        if (!this.props.iconR && !this.props.hasIconR) return null;
        return this.renderIcon(this.props.iconR, 'right');
    }

    renderBadge() {
        return (
            <UIBadge
                style={styles.badgeContainer}
                badge={this.props.badge}
                inverted
            />
        );
    }

    renderTitle() {
        if (this.shouldShowIndicator()) {
            return null;
        }
        const titleStyle = this.getTitleColorStyle();
        return (
            <Text
                style={[
                    styles.title,
                    this.props.textStyle,
                    titleStyle,
                ]}
            >
                {this.props.title}
            </Text>
        );
    }

    renderIndicator() {
        if (!this.shouldShowIndicator()) {
            return null;
        }
        if (!this.props.indicatorAnimation) {
            return (<MaterialIndicator color={this.getTextColor()} size={20} />);
        }

        return (<IconAnimation
            icon={this.props.iconIndicator}
            animation={this.props.indicatorAnimation}
            iconTintStyle={this.getIconTintStyle()}
        />);
    }

    renderData() {
        if (!this.props.data) return null;

        const data = (
            <Text style={[UIStyle.Text.tertiaryTinyBold(), UIStyle.Margin.leftSmall()]}>
                {this.props.data}
            </Text>);

        if (this.props.textAlign !== UIButton.TextAlign.Left) { return data; }

        return (
            <View style={[
                UIStyle.Common.flex(),
                UIStyle.Common.centerRightContainer(),
            ]}
            >
                {data}
            </View>
        );
    }

    renderCount() {
        if (!this.props.count) return null;

        const data = (
            <Text style={[UIStyle.Text.tertiaryBodyRegular(), UIStyle.Margin.leftSmall()]}>
                {this.props.count}
            </Text>);

        if (this.props.textAlign !== UIButton.TextAlign.Left) { return data; }

        return (
            <View style={[
                UIStyle.Common.flex(),
                UIStyle.Common.centerRightContainer(),
            ]}
            >
                {data}
            </View>
        );
    }

    renderBottomExtension() {
        if (!this.props.bottomExtend) {
            return null;
        }
        return (<View style={styles.extension} />);
    }

    renderLeftLayout(
        hasIconLeftOnly: boolean,
        hasIconRightOnly: boolean,
        hasIcons: boolean,
        hasNoIcons: boolean,
    ) {
        const content = hasIcons ? [
            <View style={UIStyle.Common.centerLeftContainer()}>
                {this.renderIconL()}
                {this.renderTitle()}
            </View>,
            this.renderIconR(),
        ] : [this.renderIconL(), this.renderTitle(), this.renderIconR()];

        return (
            <View
                style={[
                    styles.buttonContainerStyle,
                    hasIcons || hasIconRightOnly
                        ? UIStyle.Common.rowCenterSpaceContainer()
                        : UIStyle.Common.centerLeftContainer(),
                ]}
            >
                {this.renderBadge()}
                {content}
                {this.renderCount()}
                {this.renderData()}
            </View>
        );
    }

    renderRightLayout(
        hasIconLeftOnly: boolean,
        hasIconRightOnly: boolean,
        hasIcons: boolean,
        hasNoIcons: boolean,
    ) {
        const content = hasIcons ? [
            this.renderIconL(),
            <View style={UIStyle.Common.centerLeftContainer()}>
                {this.renderTitle()}
                {this.renderIconR()}
            </View>,
        ] : [this.renderIconL(), this.renderTitle(), this.renderIconR()];

        return (
            <View
                style={[
                    styles.buttonContainerStyle,
                    hasIcons || hasIconLeftOnly
                        ? UIStyle.Common.rowCenterSpaceContainer()
                        : UIStyle.Common.centerRightContainer(),
                ]}
            >
                {this.renderBadge()}
                {content}
                {this.renderCount()}
                {this.renderData()}
            </View>
        );
    }

    renderCenterLayout(
        hasIconLeftOnly: boolean,
        hasIconRightOnly: boolean,
        hasIcons: boolean,
        hasNoIcons: boolean,
    ) {
        const content = [
            this.renderIconL(),
            this.renderTitle(),
            this.renderIconR(),
        ];
        return (
            <View
                style={[
                    styles.buttonContainerStyle,
                    hasIcons
                        ? UIStyle.Common.rowCenterSpaceContainer()
                        : UIStyle.Common.centerContainer(),
                ]}
            >
                {this.renderBadge()}
                {content}
                {this.renderCount()}
                {this.renderData()}
            </View>
        );
    }

    renderContent() {
        const {
            bottomExtend, style, buttonStyle, textAlign,
            icon, iconR, title,
            hasIcon,
            hasIconR,
            showIndicator,
        } = this.props;
        let height = this.getButtonHeight();
        if (bottomExtend) {
            height *= 2;
        }
        const backgroundColorStyle = (buttonStyle === UIButton.ButtonStyle.Full)
            ? this.getButtonColorStyle()
            : null;
        const borderStyle = (buttonStyle === UIButton.ButtonStyle.Border)
            ? this.getBorderStyle()
            : null;

        const hasIconLeftOnly = (icon || hasIcon) && !iconR && !hasIconR;
        const hasIconRightOnly = (iconR || hasIconR) && !icon && !hasIcon;
        const hasIcons = (icon || hasIcon) && (iconR || hasIconR);
        const hasNoIcons = !hasIcons && !hasIconLeftOnly && !hasIconRightOnly;
        const hasTitle = !!title;

        let content = null;
        if (showIndicator || !hasTitle && hasIconLeftOnly) {
            const alignContainerStyle = [
                styles.buttonContainerStyle,
                textAlign === UIButton.TextAlign.Left
                    ? UIStyle.Common.centerLeftContainer()
                    : textAlign === UIButton.TextAlign.Right
                        ? UIStyle.Common.centerRightContainer()
                        : UIStyle.Common.centerContainer(),
            ];
            content = (
                <View style={alignContainerStyle}>
                    {showIndicator ? this.renderIndicator() : this.renderIconL()}
                </View>
            );
        } else if (textAlign === UIButton.TextAlign.Left) {
            content
                = this.renderLeftLayout(hasIconLeftOnly, hasIconRightOnly, hasIcons, hasNoIcons);
        } else if (textAlign === UIButton.TextAlign.Center) {
            content
                = this.renderCenterLayout(hasIconLeftOnly, hasIconRightOnly, hasIcons, hasNoIcons);
        } else if (textAlign === UIButton.TextAlign.Right) {
            content
                = this.renderRightLayout(hasIconLeftOnly, hasIconRightOnly, hasIcons, hasNoIcons);
        }

        return (
            <View
                style={[
                    styles.container,
                    backgroundColorStyle,
                    borderStyle,
                    { borderRadius: this.getButtonRadius() },
                    { height },
                    style,
                ]}
            >
                {content}
                {this.renderBottomExtension()}
            </View>
        );
    }

    static defaultProps: Props;
    spinValue: any;
    scaleValue: any;
}

UIButton.defaultProps = {
    ...UIActionComponent.defaultProps,
    badge: 0,
    bottomExtend: false, // useful for iPhone X (SafeArea)
    buttonSize: UIButton.ButtonSize.Default,
    buttonShape: UIButton.ButtonShape.Default,
    buttonStyle: UIButton.ButtonStyle.Full,
    count: '',
    data: '',
    footer: false,
    hasIcon: false,
    hasIconR: false,
    icon: null,
    theme: UIColor.Theme.Light,
    title: '',
    iconR: null,
    style: null,
    textAlign: UIButton.TextAlign.Center,
    textStyle: null,
    indicatorAnimation: null,
};
