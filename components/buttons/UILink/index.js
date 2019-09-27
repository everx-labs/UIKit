// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, Linking } from 'react-native';

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
    /** One of:
    UIButton.ButtonSize.Large,
    UIButton.ButtonSize.Medium,
    UIButton.ButtonSize.Small,
    UIButton.ButtonSize.Default
    @default UIButton.ButtonSize.Medium
    */
    buttonSize?: string,
    /** use it for additional data
    @default ''
    */
    count?: string,
    /** use it for additional data
    @default ''
    */
    data?: string,
    /** use it for default left icon, ignore it if use icon prop
    @default false
    */
    hasIcon?: boolean,
    /** use it for default right icon, ignore it if use iconR prop
    @default false
    */
    hasIconR?: boolean,
    /** external url, starting with http...
    @default null
    */
    href?: ?string,
    /** uri to left icon
    @default null
    */
    icon?: ?string,
    /** uri to right icon
    @default null
    */
    iconR?: ?string,
    /** specify in addition to showIndicator props, one of:
        UIButton.Indicator.Spin,
        UIButton.Indicator.Round,
        UIButton.ButtonStyle.Sandglass,
        UIButton.ButtonStyle.Pulse
        @default null
     */
    indicatorAnimation?: string,
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
    /** Visible button title
    @default ''
    */
    title?: string,
    /** @ignore */
    theme?: string,

    /** set true if button disabled
    @default false
    */
    disabled?: boolean,
    /** set true for indicating wait state
    @default false
    */
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
    static TextAlign = UIButton.TextAlign;
    static Indicator = UIButton.Indicator;

    goHref = () => {
        if (this.props.href) { Linking.openURL(this.props.href); }
    }

    render() {
        if (this.props.href) {
            return (
                <UIButton {...this.props} onPress={this.goHref} buttonStyle={UIButton.ButtonStyle.Link} />
            );
        }
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
    href: null,
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
