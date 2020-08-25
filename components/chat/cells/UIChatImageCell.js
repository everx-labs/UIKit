// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { View } from 'react-native';

import UIPureComponent from '../../UIPureComponent';
import UIImageView from '../../images/UIImageView';
import UISpinnerOverlay from '../../UISpinnerOverlay';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';

import type { ChatAdditionalInfo, UIChatImageSize } from '../extras';

type Props = {
    image: ?any,
    imageSize: ?UIChatImageSize,
    additionalInfo: ?ChatAdditionalInfo,
}

type State = {
    data: any,
}

const IMAGE_SIZE = 1024;
export default class UIChatImageCell extends UIPureComponent<Props, State> {
    static defaultProps = {
        imageSize: { width: IMAGE_SIZE, height: IMAGE_SIZE },
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            data: null,
        };
    }

    componentDidMount() {
        this.loadImage();
    }

    // Getters
    getImage(): any {
        return this.state.data;
    }

    getSize(): UIChatImageSize {
        return this.props.additionalInfo?.imageSize || this.props.imageSize;
    }

    getUrl(): string {
        const msg = this.props.additionalInfo?.message;
        const url = msg?.mid || msg?.info.image?.url || `img${Math.random()}`;

        return url;
    }

    // Setters

    // Actions
    async loadImage() {
        const { image, additionalInfo } = this.props;
        const { data } = this.state;
        if (image && !data) {
            const msg = additionalInfo?.message;
            const imgData = msg?.info.sending ? { data: msg?.info.image } : await image(msg);
            this.setState({ data: imgData.data }, () => this.forceUpdate());
        }
    }

    renderImage() {
        const image = this.getImage();

        const maxS = 2 * UIConstant.giantCellHeight();
        const minS = UIConstant.chatCellHeight();

        let { width, height } = this.getSize();
        const p = width < height ? width / height : height / width;

        if (width > height) {
            width = Math.max(width > maxS ? maxS : width, minS);
            height = width * p;
        } else {
            height = Math.max(height > maxS ? maxS : height, minS);
            width = height * p;
        }

        return (
            <UIImageView
                resizeMode="contain"
                resizeMethod="auto"
                photoStyle={{
                    marginTop: UIConstant.tinyContentOffset() / 2,
                    borderRadius: UIConstant.borderRadius(),
                    width,
                    height,
                    maxHeight: maxS,
                    maxWidth: maxS,
                }}
                source={image}
                key={`imageContent${this.getUrl()}`}
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
                visible={!this.state.data || sending}
            />
        );
    }

    render() {
        return (
            <View
                style={UIStyle.Common.flex()}
                key={`imageViewContent${this.getUrl()}`}
            >
                {this.renderImage()}
                {this.renderSpinnerOverlay()}
            </View>
        );
    }
}
