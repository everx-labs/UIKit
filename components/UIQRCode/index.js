// @flow
import React from 'react';
import { Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import UIConstant from '../../helpers/UIConstant';
import UIPureComponent from '../UIPureComponent';

type Props = {
    value: string,
    getRef?: () => void; // doesn't work in web
    size?: number,
    logo?: number,
    logoSize?: number,
    logoMargin?: number,
    logoBackgroundColor?: string,
};
type State = {
    // Empty
};

const defaultSize = UIConstant.majorCellHeight() * 2; // 160px
const defaultLogoSize = UIConstant.majorCellHeight() / 2; // 40px
const quietZone = UIConstant.smallContentOffset(); // 8px

export default class UIQRCode extends UIPureComponent<Props, State> {
    render() {
        return (
            <QRCode
                size={this.props.size || (defaultSize + (quietZone * 2))}
                quietZone={quietZone}
                value={this.props.value}
                getRef={Platform.OS === 'web' ? undefined : this.props.getRef}
                logo={this.props.logo}
                logoSize={this.props.logoSize || defaultLogoSize}
                logoMargin={this.props.logoMargin} // 2px by default
                logoBackgroundColor={this.props.logoBackgroundColor || 'white'}
            />
        );
    }
}
