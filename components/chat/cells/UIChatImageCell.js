// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { View } from 'react-native';

import type { Layout } from 'react-native/Libraries/Types/CoreEventTypes';

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
    parentLayout: ?Layout,
}

type State = {
    data: any,
}

const IMAGE_SIZE = 1024;
export default class UIChatImageCell extends UIPureComponent<Props, State> {
    static defaultProps = {
        parentLayout: null,
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
        const url = msg?.info.image?.url || `img${Math.random()}`;

        return url;
    }

    // Setters

    // Actions
    async loadImage() {
        const { image, additionalInfo } = this.props;
        const { data } = this.state;
        if (image && !data) {
            const imgData = await image(additionalInfo?.message);
            this.setState({ data: imgData.data });
        }
    }

    renderImage() {
        const { parentLayout } = this.props;
        const image = this.getImage();

        const maxImageCellSize = 2 * UIConstant.giantCellHeight();
        const minS = UIConstant.chatCellHeight();
        const maxS = parentLayout ?
            Math.min(parentLayout.width - (2 * UIConstant.contentOffset()), maxImageCellSize)
            : 50;

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
                    borderRadius: UIConstant.borderRadius(),
                    marginTop: UIConstant.smallContentOffset(),
                    marginBottom: UIConstant.smallContentOffset(),
                    width,
                    height,
                    maxHeight: maxS,
                    maxWidth: maxS,
                }}
                source={image}
                key={`imageContent${this.getUrl()}${Math.random() * 10000}`}
            />
        );
    }

    renderSpinnerOverlay() {
        return (
            <UISpinnerOverlay
                visible={!this.state.data}
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
