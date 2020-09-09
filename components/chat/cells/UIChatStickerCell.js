// @flow
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import UIPureComponent from '../../UIPureComponent';
import UISpinnerOverlay from '../../UISpinnerOverlay';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

import type { ChatAdditionalInfo } from '../extras';

type Props = {
    sticker: string,
    additionalInfo?: ?ChatAdditionalInfo,
};

type State = {};

const styles = StyleSheet.create({
    sticker: {
        width: UIConstant.giantCellHeight(),
        height: UIConstant.giantCellHeight(),
    },
});

export default class UIChatStickerCell extends UIPureComponent<Props, State> {
    getID(): string {
        const msg = this.props.additionalInfo?.message;
        const id = msg?.mid || this.props.sticker || `sticker${Math.random()}`;

        return id;
    }

    renderImage() {
        const image = { uri: `${this.props.sticker}` };

        return (
            <Image
                resizeMode="contain"
                resizeMethod="auto"
                style={styles.sticker}
                source={image}
                key={`stickerContent${this.getID()}`}
            />
        );
    }

    renderSpinnerOverlay() {
        const sending = this.props.additionalInfo?.message?.info?.sending;
        return (
            <UISpinnerOverlay
                containerStyle={{
                    top: UIConstant.tinyContentOffset() / 2,
                    borderRadius: UIConstant.borderRadius(),
                }}
                visible={sending}
            />
        );
    }

    render() {
        return (
            <View
                style={UIStyle.Common.flex()}
                key={`stickerViewContent${this.getID()}`}
            >
                {this.renderImage()}
                {this.renderSpinnerOverlay()}
            </View>
        );
    }
}
