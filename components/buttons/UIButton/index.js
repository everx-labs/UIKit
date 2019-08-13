// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Image, Animated, Easing } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIBadge from '../../design/UIBadge';
import UINotice from '../../notifications/UINotice';
import UIActionComponent from '../../UIActionComponent';

import type { ActionProps, ActionState } from '../../UIActionComponent';

const indicatorDefault = require('../../../assets/ico-triangle/ico-triangle.png');
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
    };

    static Indicator = {
        Spin: 'spin',
        Round: 'round',
        Sandglass: 'sandglass',
        Pulse: 'pulse',
    };

    insetKey: string;

    constructor(props: Props) {
        super(props);
        this.spinValue = new Animated.Value(0);
        this.scaleValue = new Animated.Value(0);
    }
    componentDidMount() {
        super.componentDidMount();
        this.setInsetIfFooter();
        this.spin();
        this.scale();
    }

    spin() {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
            },
        ).start(() => this.spin());
    }

    scale() {
        this.scaleValue.setValue(0);
        Animated.timing(
            this.scaleValue,
            {
                toValue: 1,
                duration: 600,
                easing: Easing.easeOutBack,
            },
        ).start(() => this.scale());
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
    renderIcon(icon, position) {
        if (this.shouldShowIndicator()) {
            return null;
        }

        const style = [this.getIconTintStyle()];
        if (position === 'left') {
            style.push(UIStyle.Margin.rightSmall());
        } else if (position === 'right') {
            style.push(UIStyle.Margin.leftSmall());
        }

        return <Image source={icon || iconDefault} style={style} />;
    }

    renderIconL() {
        return this.renderIcon(this.props.icon, 'left');
    }

    renderIconR() {
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

        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        const round = this.spinValue.interpolate({
            inputRange: [0, 0.08, 0.32, 0.4, 0.64, 0.72, 0.96, 1],
            outputRange: ['0deg', '60deg', '80deg', '180deg', '200deg', '300deg', '320deg', '360deg'],
        });

        const scale = this.scaleValue.interpolate({
            inputRange: [0, 0.3, 0.6, 1],
            outputRange: [1, 0.9, 1.1, 1],
        });

        const transform = [];
        if (this.props.indicatorAnimation === UIButton.Indicator.Spin) {
            transform.push({ rotateY: spin });
        } else if (this.props.indicatorAnimation === UIButton.Indicator.Round) {
            transform.push({ rotate: round });
        } else if (this.props.indicatorAnimation === UIButton.Indicator.Sandglass) {
            const scaleX = this.spinValue.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [1, 0, 1, 0, 1],
            });
            const scaleY = this.spinValue.interpolate({
                inputRange: [0, 0.25, 0.25, 0.75, 0.75, 1],
                outputRange: [1, 1, -1, -1, 1, 1],
            });
            transform.push({ scaleX });
            transform.push({ scaleY });
        } else if (this.props.indicatorAnimation === UIButton.Indicator.Pulse) {
            transform.push({ scale });
        }
        return (<Animated.Image
            style={[{ transform }, this.getIconTintStyle()]}
            source={this.props.icon || indicatorDefault}
        />);
    }

    renderBottomExtension() {
        if (!this.props.bottomExtend) {
            return null;
        }
        return (<View style={styles.extension} />);
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
        const backgroundColorStyle = (buttonStyle === UIButton.ButtonStyle.Full) ? this.getButtonColorStyle() : null;
        const borderStyle = (buttonStyle === UIButton.ButtonStyle.Border) ? this.getBorderStyle() : null;

        const buttonContainerStyle = [
            UIStyle.Common.flexRow(),
            UIStyle.Common.flexAlignCenter(),
            UIStyle.Padding.default(),
        ];
        const hasIconLeftOnly = (icon || hasIcon) && !iconR && !hasIconR;
        const hasIconRightOnly = (iconR || hasIconR) && !icon && !hasIcon;
        const hasIcons = (icon || hasIcon) && (iconR || hasIconR);
        const hasNoIcons = !hasIcons && !hasIconLeftOnly && !hasIconRightOnly;
        const hasTitle = !!title;
        let content = null;

        if (!hasTitle && (icon || hasIcon) || showIndicator) {
            buttonContainerStyle.push(UIStyle.Common.centerContainer());
            content = this.renderIconL();
        } else if (textAlign === UIButton.TextAlign.Left) {
            if (hasTitle && (hasNoIcons || hasIconLeftOnly)) {
                buttonContainerStyle.push(UIStyle.Common.centerLeftContainer());
                content = [this.renderIconL(), this.renderTitle()];
            } else if (hasTitle && hasIconRightOnly) {
                buttonContainerStyle.push(UIStyle.Common.rowSpaceContainer());
                content = [this.renderTitle(), this.renderIconR()];
            } else if (hasTitle && hasIcons) {
                buttonContainerStyle.push(UIStyle.Common.rowSpaceContainer());
                content = [
                    <View style={UIStyle.Common.centerLeftContainer()}>
                        {this.renderIconL()}
                        {this.renderTitle()}
                    </View>,
                    this.renderIconR(),
                ];
            }
        } else {
            // Center
            if (hasTitle && (hasNoIcons || hasIconLeftOnly || hasIconRightOnly)) {
                buttonContainerStyle.push(UIStyle.Common.centerContainer());
                content = [
                    hasIconLeftOnly && this.renderIconL(),
                    this.renderTitle(),
                    hasIconRightOnly && this.renderIconR(),
                ];
            } else if (hasTitle && hasIcons) {
                buttonContainerStyle.push(UIStyle.Common.rowSpaceContainer());
                content = [this.renderIconL(), this.renderTitle(), this.renderIconR()];
            }
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
                <View style={buttonContainerStyle}>
                    {this.renderBadge()}
                    {content}
                    {this.renderIndicator()}
                </View>
                {this.renderBottomExtension()}
            </View>
        );
    }

    static defaultProps: Props;
}

UIButton.defaultProps = {
    ...UIActionComponent.defaultProps,
    badge: 0,
    bottomExtend: false, // useful for iPhone X (SafeArea)
    buttonSize: UIButton.ButtonSize.Default,
    buttonShape: UIButton.ButtonShape.Default,
    buttonStyle: UIButton.ButtonStyle.Full,
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
    title: '',
    theme: UIColor.Theme.Light,
    indicatorAnimation: null,
};
