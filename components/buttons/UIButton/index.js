// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Image } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
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
        paddingHorizontal: UIConstant.contentOffset(),
    },
    badgeContainer: {
        marginRight: UIConstant.smallContentOffset(),
    },
    titleL: {
        ...UIFont.bodyMedium(),
    },
    titleM: {
        ...UIFont.smallMedium(),
    },
    titleS: {
        ...UIFont.captionMedium(),
    },
    extension: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: UIColor.overlay20(),
    },
    buttonContainerStyle: {
        flex: 1,
    },
});

export type ButtonProps = ActionProps & {
    /** Number for badged button
    @default 0
    */
    badge?: number,
    /** useful for iPhone X (SafeArea)
    @default false
    */
    bottomExtend?: boolean,
    /** One of:
    UIButton.ButtonSize.Large,
    UIButton.ButtonSize.Medium,
    UIButton.ButtonSize.Small,
    UIButton.ButtonSize.Default
    @default UIButton.ButtonSize.Default
    */
    buttonSize?: string,
    /** One of:
    UIButton.ButtonShape.Radius,
    UIButton.ButtonShape.Rounded,
    UIButton.ButtonShape.Full,
    UIButton.ButtonShape.Default
    @default UIButton.ButtonShape.Radius
    */
    buttonShape?: string,
    /** One of:
    UIButton.ButtonStyle.Full,
    UIButton.ButtonStyle.Border,
    UIButton.ButtonStyle.Link
    @default UIButton.ButtonStyle.Full
    */
    buttonStyle?: string,
    /** use it for additional data
    @default ''
    */
    count?: string,
    /** use it for additional data
    @default ''
    */
    data?: string,
    /** @ignore */
    footer?: boolean,
    /** use it for default left icon, ignore it if use icon prop
    @default false
    */
    hasIcon?: boolean,
    /** use it for default right icon, ignore it if use iconR prop
    @default false
    */
    hasIconR?: boolean,
    /** uri to left icon
    @default null
    */
    icon?: ImageSource,
    /** uri to right icon
    @default null
    */
    iconR?: ?string,
    /** uri to left hover icon
    @default null
    */
    iconHover?: ImageSource,
    /** uri to right hover icon
    @default null
    */
    iconRHover?: ?string,
    /** Custom style for left icon
    @default null
    */
    iconStyle?: ?StylePropType,
    /** Custom style for right icon
    @default null
    */
    iconRStyle?: ?StylePropType,
    /** Custom style for left icon
    @default null
    */
    iconHoverStyle?: ?StylePropType,
    /** Custom style for right icon
    @default null
    */
    iconRHoverStyle?: ?StylePropType,
    /** specify in addition to showIndicator props, one of:
        UIButton.Indicator.Spin,
        UIButton.Indicator.Round,
        UIButton.ButtonStyle.Sandglass,
        UIButton.ButtonStyle.Pulse,
        UIButton.ButtonStyle.Forward
        @default null
     */
    indicatorAnimation?: string,
    /**
    Custom icon for indicator
    @default null
    */
    iconIndicator?: ?string,
    /**
    Custom style for indicator
    @default null
    */
    iconIndicatorStyle?: ?StylePropType,
    /** button container style
    @default null
    */
    style?: StylePropType,
    /** text align, one of:
    UIButton.TextAlign.Center,
    UIButton.TextAlign.Left,
    UIButton.TextAlign.Right,
    @default UIButton.TextAlign.Center
    */
    textAlign?: string,
    /** button title style
    @default null
    */
    textStyle?: StylePropType,
    /** button title style
    @default null
    */
    textHoverStyle?: StylePropType,
    /** Visible button title
    @default ''
    */
    title?: string,
    /** @ignore */
    theme?: string,
    /** @default 'uiButton' */
    testID?: string,
};

type State = ActionState;

export default class UIButton extends UIActionComponent<ButtonProps, State> {
    static buttonSize = {
        default: 'default',
        large: 'l',
        medium: 'm',
        small: 's',
    };

    static buttonShape = {
        default: 'default',
        radius: 'radius',
        mediumRadius: 'medium-radius',
        rounded: 'rounded',
        full: 'full',
    };

    static buttonStyle = {
        full: 'full',
        border: 'border',
        link: 'link',
    };

    static textAlign = {
        center: 'center',
        left: 'left',
        right: 'right',
    };

    // Deprecated
    static ButtonSize = {
        Default: 'default',
        Large: 'l',
        Medium: 'm',
        Small: 's',
    };

    static ButtonShape = {
        Default: 'default',
        Radius: 'radius',
        MediumRadius: 'medium-radius',
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

    static Indicator = IconAnimation.Animation;

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
        case UIButton.buttonSize.large:
            return UIConstant.largeButtonHeight(); // 56
        case UIButton.buttonSize.medium:
            return UIConstant.mediumButtonHeight(); // 40
        case UIButton.buttonSize.small:
            return UIConstant.smallButtonHeight(); // 32
        default: // UIButton.buttonSize.default
            return UIConstant.buttonHeight(); // 48
        }
    }

    getTitleFontStyle() {
        switch (this.props.buttonSize) {
        case UIButton.buttonSize.large:
            return styles.titleL;
        case UIButton.buttonSize.medium:
            return styles.titleM;
        case UIButton.buttonSize.small:
            return styles.titleS;
        default:
            return styles.titleM;
        }
    }

    getButtonRadius() {
        switch (this.props.buttonShape) {
        case UIButton.buttonShape.radius:
            return UIConstant.smallBorderRadius();
        case UIButton.buttonShape.mediumRadius:
            return UIConstant.borderRadius();
        case UIButton.buttonShape.rounded:
            return this.getButtonHeight() / 2.0;
        case UIButton.buttonShape.full:
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
    renderIcon(icon: ImageSource, position: string) {
        if (this.shouldShowIndicator()) {
            return null;
        }

        const style = [];
        const hovered = this.isHover() || this.isTapped();
        let propStyle = null;
        let iconHovered = null;

        if (position === 'left') {
            if (this.props.title) style.push(UIStyle.margin.rightSmall());
            propStyle = hovered ? this.props.iconHoverStyle : this.props.iconStyle;
            iconHovered = hovered ? this.props.iconHover : null;
        } else if (position === 'right') {
            if (this.props.title) style.push(UIStyle.margin.leftSmall());
            propStyle = hovered ? this.props.iconRHoverStyle : this.props.iconRStyle;
            iconHovered = hovered ? this.props.iconRHover : null;
        }

        style.push(propStyle || this.getIconTintStyle());

        const iconResult = iconHovered || icon || iconDefault;
        style.push({ minWidth: UIConstant.mediumContentOffset() });

        return <Image source={iconResult} style={style} key={`buttonIcon~${position}`} />;
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
        const hovered = this.isHover() || this.isTapped();
        return (
            <Text
                key="buttonTitle"
                style={[
                    this.getTitleFontStyle(),
                    titleStyle,
                    hovered ? this.props.textHoverStyle : this.props.textStyle,
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
            iconTintStyle={this.props.iconIndicatorStyle || this.getIconTintStyle()}
        />);
    }

    renderData() {
        if (!this.props.data) return null;

        const data = (
            <Text style={[UIStyle.text.tertiaryTinyBold(), UIStyle.margin.leftSmall()]}>
                {this.props.data}
            </Text>);

        if (this.props.textAlign !== UIButton.TextAlign.Left) { return data; }

        return (
            <View style={[
                UIStyle.common.flex(),
                UIStyle.container.centerRight(),
            ]}
            >
                {data}
            </View>
        );
    }

    renderCount() {
        if (!this.props.count) return null;

        const data = (
            <Text style={[UIStyle.text.tertiaryBodyRegular(), UIStyle.margin.leftSmall()]}>
                {this.props.count}
            </Text>);

        if (this.props.textAlign !== UIButton.TextAlign.Left) { return data; }

        return (
            <View style={[
                UIStyle.common.flex(),
                UIStyle.container.centerRight(),
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
            <View style={UIStyle.container.centerLeft()}>
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
                        ? UIStyle.container.rowCenterSpace()
                        : UIStyle.container.centerLeft(),
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
            <View style={UIStyle.container.centerLeft()}>
                {this.renderTitle()}
                {this.renderIconR()}
            </View>,
        ] : [this.renderIconL(), this.renderTitle(), this.renderIconR()];

        return (
            <View
                style={[
                    styles.buttonContainerStyle,
                    hasIcons || hasIconLeftOnly
                        ? UIStyle.container.rowCenterSpace()
                        : UIStyle.container.centerRight(),
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
                        ? UIStyle.container.rowCenterSpace()
                        : UIStyle.container.center(),
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
        const backgroundColorStyle = (buttonStyle === UIButton.buttonStyle.full)
            ? this.getButtonColorStyle()
            : null;
        const borderStyle = (buttonStyle === UIButton.buttonStyle.border)
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
                textAlign === UIButton.textAlign.left
                    ? UIStyle.container.centerLeft()
                    : textAlign === UIButton.textAlign.right
                        ? UIStyle.container.centerRight()
                        : UIStyle.container.center(),
            ];
            content = (
                <View style={alignContainerStyle}>
                    {showIndicator ? this.renderIndicator() : this.renderIconL()}
                </View>
            );
        } else if (textAlign === UIButton.textAlign.left) {
            content
                = this.renderLeftLayout(hasIconLeftOnly, hasIconRightOnly, hasIcons, hasNoIcons);
        } else if (textAlign === UIButton.textAlign.center) {
            content
                = this.renderCenterLayout(hasIconLeftOnly, hasIconRightOnly, hasIcons, hasNoIcons);
        } else if (textAlign === UIButton.textAlign.right) {
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

    render() {
        return super.render();
    }

    static defaultProps: ButtonProps;
}

UIButton.defaultProps = {
    ...UIActionComponent.defaultProps,
    badge: 0,
    bottomExtend: false, // useful for iPhone X (SafeArea)
    buttonSize: UIButton.buttonSize.default,
    buttonShape: UIButton.buttonShape.radius,
    buttonStyle: UIButton.buttonStyle.full,
    count: '',
    data: '',
    footer: false,
    hasIcon: false,
    hasIconR: false,
    icon: null,
    iconHover: null,
    theme: UIColor.Theme.Light,
    title: '',
    iconR: null,
    iconRHover: null,
    iconStyle: null,
    iconHoverStyle: null,
    iconRStyle: null,
    iconRHoverStyle: null,
    style: null,
    textAlign: UIButton.textAlign.center,
    textStyle: null,
    textHoverStyle: null,
    indicatorAnimation: null,
    iconIndicator: undefined,
    iconIndicatorStyle: null,
    testID: 'uiButton',
};
