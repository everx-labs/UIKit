// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, Linking } from 'react-native';

import UIButton from '../UIButton';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';

import type { ButtonProps } from '../UIButton';

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});

type Props = ButtonProps & {
    /** external url, starting with http...
    @default null
    */
    href?: ?string,
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
    ...UIButton.defaultProps,
    href: null,
};
