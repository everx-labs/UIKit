// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableWithoutFeedback, Text, Image, View } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';

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

type Props = {
    testID?: string,
    buttonStyle?: StylePropType,
    textStyle?: StylePropType,
    detailsStyle?: StylePropType,
    align: StylePropType,
    title: string,
    details: string,
    disabled: boolean,
    onPress: () => void,
};

type State = {};

class UITextButton extends UIComponent<Props, State> {
    static Align = {
        Left: styles.alignLeft,
        Center: styles.alignCenter,
    };

    constructor(props) {
        super(props);

        this.state = {
            tap: false,
            hover: false,
        };
    }

    // Setters
    setTap(tap = true) {
        this.setStateSafely({ tap });
    }

    setHover(hover = true) {
        this.setStateSafely({ hover });
    }

    // Getters
    isTap() {
        return this.state.tap;
    }

    isHover() {
        return this.state.hover;
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
            title, textStyle, details, disabled,
        } = this.props;
        const defaultFontStyle = UIFont.smallMedium();
        let color;
        if (disabled) {
            color = UIColor.textSecondary();
        } else if (this.isTap()) {
            color = UIColor.primary5();
        } else if (this.isHover()) {
            color = UIColor.primary4();
        } else {
            color = UIColor.primary();
        }
        const defaultColorStyle = UIColor.getColorStyle(color);
        const flexGrow = details ? styles.flexGrow1 : styles.flexGrow0;
        return (
            <Text
                style={[defaultFontStyle, defaultColorStyle, textStyle, flexGrow]}
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

    render() {
        const {
            testID, buttonStyle, onPress, disabled, align,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <TouchableWithoutFeedback
                {...testIDProp}
                disabled={disabled}
                onPress={() => onPress()}
                onMouseEnter={() => this.setHover()}
                onMouseLeave={() => this.setHover(false)}
                onPressIn={() => this.setTap()}
                onPressOut={() => this.setTap(false)}
            >
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
            </TouchableWithoutFeedback>
        );
    }

    static defaultProps: Props;
}

export default UITextButton;

UITextButton.defaultProps = {
    title: '',
    details: '',
    icon: null,
    disabled: false,
    align: UITextButton.Align.Left,
    onPress: () => {},
};
