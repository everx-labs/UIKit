// @flow
import React from 'react';
import { Linking, Platform } from 'react-native';

import {
    UILinkButton,
    UILinkButtonProps,
    UILinkButtonSize,
    UILinkButtonType,
    UILinkButtonVariant,
} from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

type Props = UILinkButtonProps & {
    /** external url, starting with http...
    @default null
    */
    href?: ?string,
    target?: '_blank' | '_self',
};

type State = {
    //
};

export default class UILink extends UIComponent<Props, State> {
    static Size = UILinkButtonSize;
    static Type = UILinkButtonType;
    static Variant = UILinkButtonVariant;

    static defaultProps: Props = {
        href: null,
    };

    goHref = () => {
        if (this.props.href) {
            if (Platform.OS === 'web' && this.props.target === '_blank' && window && window.open) {
                window.open(this.props.href, '_blank');
                return;
            }
            Linking.openURL(this.props.href);
        }
    };

    render() {
        if (this.props.href) {
            return <UILinkButton {...this.props} onPress={this.goHref} />;
        }
        return <UILinkButton {...this.props} />;
    }
}
