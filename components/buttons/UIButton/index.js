// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableWithoutFeedback, View, Text, Image } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIBadge from '../../design/UIBadge';
import UINotice from '../../notifications/UINotice';
import UIComponent from '../../UIComponent';

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

type Props = {
    testID?: string,
    style?: StylePropType,
    textStyle?: StylePropType,
    buttonSize: string,
    buttonShape: string,
    title: string,
    badge: number,
    disabled: boolean,
    bottomExtend: boolean,
    showIndicator: boolean,
    footer: boolean,
    onPress: () => void,
};

type State = {
    overlayColor: string
};

export default class UIButton extends UIComponent<Props, State> {
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
    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            hover: false,
            tap: false,
        };
    }

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

    onPressIn() {
        this.setTap();
    }

    onPressOut() {
        this.setTap(false);
    }

    // Setters
    setHover(hover = true) {
        this.setStateSafely({ hover });
    }

    setTap(tap = true) {
        this.setStateSafely({ tap });
    }

    // Getters
    isHover() {
        return this.state.hover;
    }

    isTap() {
        return this.state.tap;
    }

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
        if (this.props.theme === UIColor.Theme.Dark) {
            if (this.isDisabled()) {
                color = UIColor.primaryPlus();
            } else if (this.isTap()) {
                color = UIColor.primary6();
            } else if (this.isHover()) {
                color = UIColor.primary4();
            } else {
                color = UIColor.primaryPlus();
            }
        } else if (this.isDisabled()) {
            color = UIColor.backgroundQuarter(UIColor.Theme.Light);
        } else if (this.isTap()) {
            color = UIColor.primary5();
        } else if (this.isHover()) {
            color = UIColor.primary4();
        } else {
            color = UIColor.primary();
        }
        return UIColor.getBackgroundColorStyle(color);
    }

    getTitleColorStyle() {
        let color;
        if (this.props.theme === UIColor.Theme.Dark) {
            color = this.isDisabled() ? UIColor.primary() : UIColor.grey1();
        } else {
            color = this.isDisabled() ? UIColor.light() : UIColor.white();
        }
        return UIColor.getColorStyle(color);
    }

    isDisabled() {
        return this.props.disabled;
    }

    shouldShowIndicator() {
        return this.props.showIndicator;
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

    render() {
        const { testID, bottomExtend, style } = this.props;
        let height = this.getButtonHeight();
        if (bottomExtend) {
            height *= 2;
        }
        const testIDProp = testID ? { testID } : null;
        const backgroundColorStyle = this.getButtonColorStyle();
        return (
            <View
                onMouseEnter={() => this.setHover()}
                onMouseLeave={() => this.setHover(false)}
                style={[
                    styles.container,
                    backgroundColorStyle,
                    { borderRadius: this.getButtonRadius() },
                    { height },
                    style,
                ]}
            >
                <TouchableWithoutFeedback
                    {...testIDProp}
                    disabled={this.isDisabled() || this.shouldShowIndicator()}
                    onPress={() => this.onPress()}
                    onPressIn={() => this.onPressIn()}
                    onPressOut={() => this.onPressOut()}
                >
                    <View
                        style={[UIStyle.flex, UIStyle.centerContainer]}
                    >
                        {this.renderIcon()}
                        {this.renderBadge()}
                        {this.renderTitle()}
                        {this.renderIndicator()}
                    </View>
                </TouchableWithoutFeedback>
                {this.renderBottomExtension()}
            </View>
        );
    }

    static defaultProps: Props;
}

UIButton.defaultProps = {
    theme: UIColor.Theme.Light,
    buttonSize: UIButton.ButtonSize.Default,
    buttonShape: UIButton.ButtonShape.Default,
    title: '',
    badge: 0,
    icon: null,
    disabled: false,
    bottomExtend: false, // useful for iPhone X (SafeArea)
    showIndicator: false,
    footer: false,
    onPress: () => {},
};
