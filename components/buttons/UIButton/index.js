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

import type { ActionProps, ActionState } from '../../UIActionComponent';

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
    badge: number,
    bottomExtend: boolean,
    buttonSize: string,
    buttonShape: string,
    disabled: boolean,
    footer: boolean,
    icon: ?string,
    onPress: () => void,
    showIndicator: boolean,
    style?: StylePropType,
    textStyle?: StylePropType,
    title: string,
    theme: string,
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
    onPress() {
        this.props.onPress();
    }

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

    getButtonColorStyle() {
        let color;
        const { theme, disabled } = this.props;
        if (disabled) {
            color = UIColor.backgroundQuarter(theme);
        } else {
            const tapped = this.isTapped();
            const hover = this.isHover();
            color = UIColor.buttonBackground(theme, tapped, hover);
        }
        return UIColor.getBackgroundColorStyle(color);
    }

    getTitleColorStyle() {
        const { theme, disabled } = this.props;
        const color = UIColor.buttonTitle(theme, disabled);
        return UIColor.getColorStyle(color);
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
    renderIcon() {
        const { icon } = this.props;
        if (!icon) {
            return null;
        }
        return <Image source={icon} style={UIStyle.marginRightSmall} />;
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
        return (<MaterialIndicator color={UIColor.white()} size={20} />);
    }

    renderBottomExtension() {
        if (!this.props.bottomExtend) {
            return null;
        }
        return (<View style={styles.extension} />);
    }

    renderContent() {
        const { bottomExtend, style } = this.props;
        let height = this.getButtonHeight();
        if (bottomExtend) {
            height *= 2;
        }
        const backgroundColorStyle = this.getButtonColorStyle();
        return (
            <View
                style={[
                    styles.container,
                    backgroundColorStyle,
                    { borderRadius: this.getButtonRadius() },
                    { height },
                    style,
                ]}
            >
                <View style={[UIStyle.flex, UIStyle.centerContainer]}>
                    {this.renderIcon()}
                    {this.renderBadge()}
                    {this.renderTitle()}
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
    footer: false,
    icon: null,
    theme: UIColor.Theme.Light,
    title: '',
};
