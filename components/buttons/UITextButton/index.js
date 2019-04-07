// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableWithoutFeedback, Text, Image, View } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIActionComponent from '../../UIActionComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';

import type EventProps from '../../../types';

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
    align: StylePropType,
    buttonStyle?: StylePropType,
    details: string,
    detailsStyle?: StylePropType,
    disabled: boolean,
    icon: ?string,
    onPress: () => void,
    testID?: string,
    textStyle?: StylePropType,
    theme: string,
    title: string,
};

type State = {
    tap: boolean,
    hover: boolean,
};

class UITextButton extends UIActionComponent<Props, State> {
    static Align = {
        Left: styles.alignLeft,
        Center: styles.alignCenter,
    };

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
            title, textStyle, details, theme, disabled,
        } = this.props;
        const defaultFontStyle = UIFont.smallMedium();
        const tapped = this.isTapped();
        const hover = this.isHover();
        const defaultColorStyle = UIColor.actionTextPrimaryStyle(theme);
        const stateColorStyle = UIColor.stateTextPrimaryStyle(theme, disabled, tapped, hover);
        const flexGrow = details ? styles.flexGrow1 : styles.flexGrow0;
        return (
            <Text
                style={[defaultFontStyle, defaultColorStyle, textStyle, stateColorStyle, flexGrow]}
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

    render(): React$Node {
        const {
            testID, buttonStyle, onPress, disabled, align,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        const onMouseEvents: EventProps = {
            onMouseEnter: () => this.setHover(),
            onMouseLeave: () => this.setHover(false),
        };
        return (
            <TouchableWithoutFeedback
                {...testIDProp}
                disabled={disabled}
                onPress={() => onPress()}
                {...onMouseEvents}
                onPressIn={() => this.setTapped()}
                onPressOut={() => this.setTapped(false)}
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
    align: UITextButton.Align.Left,
    details: '',
    disabled: false,
    icon: null,
    onPress: () => {},
    theme: UIColor.Theme.Light,
    title: '',
};
