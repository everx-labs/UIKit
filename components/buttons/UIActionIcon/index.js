// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text, Image, Animated, Easing } from 'react-native';

import UIButton from '../UIButton';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});

type Props = {
    /** One of:
    UIActionIcon.Size.Large,
    UIActionIcon.Size.Medium,
    UIActionIcon.Size.Small,
    UIActionIcon.Size.Default
    @default UIActionIcon.Size.Default
    */
    buttonSize?: string,
    /** One of:
    UIActionIcon.Shape.Radius,
    UIButton.Shape.Rounded,
    UIButton.Shape.Full,
    UIButton.Shape.Default
    @default UIButton.Shape.Default
    */
    buttonShape?: string,
    /** One of:
    UIActionIcon.Style.Full,
    UIActionIcon.Style.Border,
    UIActionIcon.Style.Link
    @default UIActionIcon.Style.Full
    */
    buttonStyle?: string,
    /** uri to left icon
    @default null
    */
    icon?: ?string,
    /** button container style
    @default null
    */
    style?: StylePropType,
    /** @ignore */
    theme?: string,

    /** set true if button disabled
    @default false
    */
    disabled?: boolean,
    /** Your action here */
    onPress?: () => void,
    /** Your action here */
    onMouseEnter?: () => void,
    /** Your action here */
    onMouseLeave?: () => void,
};

type State = {};

export default class UIActionIcon extends UIComponent<Props, State> {
    static Size = UIButton.ButtonSize;
    static Shape = UIButton.ButtonShape;
    static Style = UIButton.ButtonStyle;

    constructor(props: Props) {
        super(props);
    }

    getButtonWidth() {
        switch (this.props.buttonSize) {
        case UIActionIcon.Size.Large:
            return UIConstant.largeButtonHeight();
        case UIActionIcon.Size.Medium:
            return UIConstant.mediumButtonHeight();
        case UIActionIcon.Size.Small:
            return UIConstant.smallButtonHeight();
        default: // UIActionIcon.Size.Default
            return UIConstant.buttonHeight();
        }
    }

    render() {
        let style = this.props.style;
        const widthStyle = { width: this.getButtonWidth() };
        if (style && style.push) {
            style.push(widthStyle);
        } else {
            style = [style, widthStyle];
        }
        return (
            <UIButton {...this.props} style={style} hasIcon />
        );
    }

    static defaultProps: Props;
}

UIActionIcon.defaultProps = {
    buttonSize: UIActionIcon.Size.Medium,
    buttonShape: UIActionIcon.Shape.Default,
    buttonStyle: UIActionIcon.Style.Full,
    icon: null,
    theme: UIColor.Theme.Light,
    style: null,
    disabled: false,
};
