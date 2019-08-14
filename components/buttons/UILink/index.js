// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet } from 'react-native';

import UIButton from '../UIButton';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});

type Props = {
    /** One of: UIButton.ButtonSize.Large, UIButton.ButtonSize.Medium, UIButton.ButtonSize.Small, UIButton.ButtonSize.Default */
    buttonSize?: string,
    /** use it for additional data */
    count?: string,
    /** use it for additional data */
    data?: string,
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

    /** set true if button disabled */
    disabled?: boolean,
    /** set true for indicating wait state */
    showIndicator?: boolean,
    /** Your action here */
    onPress?: () => void,
    /** Your action here */
    onMouseEnter?: () => void,
    /** Your action here */
    onMouseLeave?: () => void,
};

type State = {};

export default class UILink extends UIComponent<Props, State> {
    render() {
        return (
            <UIButton {...this.props} buttonStyle={UIButton.ButtonStyle.Link} />
        );
    }

    static defaultProps: Props;
}

UILink.defaultProps = {
    buttonSize: UIButton.ButtonSize.Medium,
    count: '',
    data: '',
    hasIcon: false,
    hasIconR: false,
    icon: null,
    theme: UIColor.Theme.Light,
    title: '',
    iconR: null,
    style: null,
    textAlign: UIButton.TextAlign.Center,
    textStyle: null,
    indicatorAnimation: '',

    disabled: false,
    showIndicator: false,
};
