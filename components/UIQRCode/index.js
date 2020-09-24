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
};
type State = {
    // Empty
};

const defaultSize = UIConstant.majorCellHeight() * 2;

export default class UIQRCode extends UIPureComponent<Props, State> {
    render() {
        return (
            <QRCode
                size={this.props.size || defaultSize}
                quietZone={UIConstant.smallContentOffset()}
                value={this.props.value}
                getRef={Platform.OS === 'web' ? undefined : this.props.getRef}
            />
        );
    }
}
