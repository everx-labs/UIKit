// @flow
import React from 'react';
import { Platform, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { UIConstant } from '@uikit/core';

import UIPureComponent from '../UIPureComponent';

type Props = {
    value: string,
    getPng?: () => void; // returns base64
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
    getSize(): number {
        return (this.props.size || defaultSize) + (quietZone * 2);
    }

    getRef = (svg: any) => {
        if (!this.props.getPng) {
            // no need to process if `getPng` not defined
            return;
        }
        // QRCode lib returns non-valid svg object in web, so use custom method
        if (Platform.OS === 'web') {
            const element = document.getElementById(`uri-qr-${this.props.value}`)?.children[0];
            if (!element) {
                return;
            }
            const s = new XMLSerializer().serializeToString(element);
            const encodedData = window.btoa(s);
            const svgUrl = `data:image/svg+xml;base64,${encodedData}`;
            const canvas = document.createElement('canvas');
            // get canvas context for drawing on canvas
            const context = canvas.getContext('2d');
            // set canvas size
            const size = this.getSize();
            canvas.width = size;
            canvas.height = size;
            // create image in memory(not in DOM)
            const image = new Image();
            const logo = new Image();
            // save function
            const download = canv => {
                // snapshot canvas as png
                const pngBase64 = canv.toDataURL('image/png').split(';base64,')[1];
                if (this.props.getPng) {
                    this.props.getPng(pngBase64);
                }

            };
            // later when image loads run this
            image.onload = () => {
                // clear canvas
                context.clearRect(0, 0, size, size);
                // draw image with SVG data to canvas
                context.drawImage(image, 0, 0, size, size);
                const logoSource = this.props.logo;
                if (logoSource) { // logo image
                    // $FlowExpectedError
                    logo.src = logoSource;
                } else {
                    download(canvas);
                }
            };
            logo.onload = () => {
                const logoSize = this.props.logoSize || defaultLogoSize;
                const logoStart = (size / 2) - (logoSize / 2);
                context.drawImage(logo, logoStart, logoStart, logoSize, logoSize);
                download(canvas);
            };
            // start loading SVG data into in memory image
            image.src = svgUrl;
            return;
        }

        if (!svg) {
            return;
        }
        // hack to wait while library process logo to return it inside ref
        const timeHack = this.props.logo ? 100 : 0;
        setTimeout(()=> {
            svg.toDataURL(async base64 => {
                if (this.props.getPng) {
                    this.props.getPng(base64);
                }
            });
        }, timeHack);
    }

    render() {
        return (
            <View
                nativeID={`uri-qr-${this.props.value}`}
            >
                <QRCode
                    size={this.getSize()}
                    quietZone={quietZone}
                    value={this.props.value}
                    getRef={this.getRef}
                    logo={this.props.logo}
                    logoSize={this.props.logoSize || defaultLogoSize}
                    logoMargin={this.props.logoMargin} // 2px by default
                    logoBackgroundColor={this.props.logoBackgroundColor || 'white'}
                />
            </View>
        );
    }
}
