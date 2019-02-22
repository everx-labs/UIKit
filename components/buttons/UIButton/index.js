import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
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
    button: {
        flex: 1,
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

export default class UIButton extends UIComponent {
    static ButtonSize = {
        Default: 'default',
        Large: 'large',
        Medium: 'medium',
        Small: 'small',
    }

    static ButtonShape = {
        Default: 'default',
        Radius: 'radius',
        Rounded: 'rounded',
        Full: 'full',
    }

    // constructor
    constructor(props) {
        super(props);

        this.state = {
            overlayColor: 'transparent',
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
        this.setOverlayColor(UIColor.overlayWithAlpha(0.32));
    }

    onPressOut() {
        this.setOverlayColor('transparent');
    }

    // Setters
    setOverlayColor(overlayColor) {
        this.setStateSafely({
            overlayColor,
        });
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

    getButtonColor() {
        return !this.isDisabled()
            ? UIColor.primary()
            : UIColor.backgroundQuarter(UIColor.Theme.Light); // force light theme
    }

    getTitleColor() {
        return !this.isDisabled() ? UIColor.white() : UIColor.light();
    }

    getOverlayColor() {
        return this.state.overlayColor;
    }

    isDisabled() {
        return this.props.disabled;
    }

    shouldShowIndicator() {
        return this.props.showIndicator;
    }

    // Actions
    setInsetIfFooter() {
        const { footer } = this.props;
        if (!footer) {
            return;
        }
        const height = this.getButtonHeight();
        this.insetKey = `UIButton~key~${new Date()}`;
        UINotice.setAdditionalInset(this.insetKey, height);
    }

    removeInsetIfFooter() {
        if (!this.props.footer) {
            return;
        }
        UINotice.removeAdditionalInset(this.insetKey);
    }

    // render
    renderBadge() {
        return (<UIBadge style={styles.badgeContainer} badge={this.props.badge} inverted />);
    }

    renderTitle() {
        if (this.shouldShowIndicator()) {
            return null;
        }
        return (
            <Text
                style={[
                    styles.title,
                    this.props.textStyle,
                    { color: this.getTitleColor() },
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
        return (
            <View
                style={[
                    styles.container,
                    { height },
                    { backgroundColor: this.getButtonColor() },
                    { borderRadius: this.getButtonRadius() },
                    style,
                ]}
            >
                <TouchableWithoutFeedback
                    testID={testID}
                    style={styles.button}
                    disabled={this.isDisabled() || this.shouldShowIndicator()}
                    onPress={() => this.onPress()}
                    onPressIn={() => this.onPressIn()}
                    onPressOut={() => this.onPressOut()}
                >
                    <View
                        style={[
                            UIStyle.centerContainer,
                            { backgroundColor: this.getOverlayColor() },
                        ]}
                    >
                        {this.renderBadge()}
                        {this.renderTitle()}
                        {this.renderIndicator()}
                    </View>
                </TouchableWithoutFeedback>
                {this.renderBottomExtension()}
            </View>
        );
    }
}

UIButton.defaultProps = {
    style: {},
    textStyle: {},
    buttonSize: UIButton.ButtonSize.Default,
    buttonShape: UIButton.ButtonShape.Default,
    title: '',
    badge: 0,
    disabled: false,
    bottomExtend: false, // useful for iPhone X (SafeArea)
    showIndicator: false,
    footer: false,
    onPress: () => {},
};

UIButton.propTypes = {
    testID: String,
    style: StylePropType,
    textStyle: StylePropType,
    buttonSize: PropTypes.string,
    buttonShape: PropTypes.string,
    title: PropTypes.string,
    badge: PropTypes.number,
    disabled: PropTypes.bool,
    bottomExtend: PropTypes.bool,
    showIndicator: PropTypes.bool,
    footer: PropTypes.bool,
    onPress: PropTypes.func,
};
