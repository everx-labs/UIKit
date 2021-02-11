// @flow
import React from 'react';
import { Linking, Platform } from 'react-native';

import UIButton from '../UIButton';
import type { ButtonProps } from '../UIButton';
import UIComponent from '../UIComponent';

type Props = ButtonProps & {
    /** external url, starting with http...
    @default null
    */
    href?: ?string,
    target?: '_blank' | '_self',
};

type State = {};

export default class UILink extends UIComponent<Props, State> {
    static TextAlign = UIButton.TextAlign;
    static Indicator = UIButton.Indicator;
    static Size = UIButton.ButtonSize;

    goHref = () => {
        if (this.props.href) {
            if (
                Platform.OS === 'web' &&
                this.props.target === '_blank' &&
                window && window.open
            ) {
                window.open(this.props.href, '_blank');
                return;
            }
            Linking.openURL(this.props.href);
        }
    }

    render() {
        if (this.props.href) {
            return (
                <UIButton
                    {...this.props}
                    onPress={this.goHref}
                    buttonStyle={UIButton.ButtonStyle.Link}
                />
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
