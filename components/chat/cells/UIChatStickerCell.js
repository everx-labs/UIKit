// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';

import UIPureComponent from '../../UIPureComponent';
import UIImage from '../../images/UIImage';
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
            <UIImage
                style={styles.sticker}
                source={image}
                key={`stickerContent${this.getID()}`}
            />
        );
    }

    render() {
        const isSending = this.props.additionalInfo?.message?.info?.sending;
        return (
            <View
                style={[
                    UIStyle.Common.flex(),
                    isSending && UIStyle.common.opacity70(),
                ]}
                key={`stickerViewContent${this.getID()}`}
            >
                {this.renderImage()}
            </View>
        );
    }
}
