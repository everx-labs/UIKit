// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UILocalized,
    UIConstant,
    UIColor,
    UIFont,
    UIStyle,
} from '@uikit/core';
import {
    UIPureComponent,
    UIToastMessage,
    UISpinnerOverlay,
} from '@uikit/components';
import fileBlue from '@uikit/assets/ico-file-income-blue/fileBlue.png';
import fileWhite from '@uikit/assets/ico-file-income-white/fileWhite.png';
import cloudBlack from '@uikit/assets/ico-cloud-black/cloudBlack.png';
import cloudWhite from '@uikit/assets/ico-cloud-white/cloudWhite.png';

import type { ChatAdditionalInfo } from '../extras';

type Props = {
    document: any,
    isReceived: boolean,
    additionalInfo: ?ChatAdditionalInfo,
    onOpenPDF?: (pfdData: any, pdfName: string) => void,
}

type State = {
    data: any,
    showSpinner: boolean,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: '100%',
    },
    infoSection: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    metadata: {
        marginHorizontal: UIConstant.contentOffset(),
        marginLeft: UIConstant.smallContentOffset(),
    },
});

export default class UIChatDocumentCell extends UIPureComponent<Props, State> {
    static defaultProps = {
        document: null,
        additionalInfo: null,
        isReceived: true,
        onOpenPDF: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            data: null,
            showSpinner: false,
        };
    }

    onTouchDocument() {
        const { onOpenPDF, document, additionalInfo } = this.props;
        if (onOpenPDF && document && additionalInfo) {
            this.downloadDocument(onOpenPDF, document, additionalInfo);
        }
    }

    // Getters
    getDocument(): any {
        return this.props.document;
    }

    getFontColor(): TextStyleProp {
        return this.props.isReceived
            ? UIStyle.Color.getColorStyle(UIColor.primary())
            : UIStyle.Color.getColorStyle(UIColor.grey1());
    }

    getMetaDataFontColor(): TextStyleProp {
        return this.props.isReceived
            ? UIStyle.Color.getColorStyle(UIColor.textPrimary())
            : UIStyle.Color.getColorStyle(UIColor.grey1());
    }

    getUrl(): string {
        // TODO: get url
        return '';
    }

    getFileSize(): string {
        const { additionalInfo } = this.props;
        const fileSize = additionalInfo?.fileSize;

        if (fileSize) {
            const size = fileSize / 1000000;
            return `, ${size.toFixed(1)} M`;
        }

        return '';
    }

    // Actions
    async downloadDocument(
        callback: (data: any, name: string) => void,
        downloader: any,
        info: ChatAdditionalInfo,
    ) {
        this.showSpinner();
        try {
            const docName = info.docName || '';
            const docData = await downloader(info.message);
            callback(docData, docName);
        } catch (error) {
            UIToastMessage.showMessage(UILocalized.FailedToLoadDocument);
        } finally {
            this.hideSpinner();
        }
    }

    showSpinner() {
        this.setStateSafely({ showSpinner: true });
    }

    hideSpinner() {
        this.setStateSafely({ showSpinner: false });
    }

    // Render
    renderDocumentName() {
        const { additionalInfo } = this.props;
        const docName = additionalInfo?.docName || '';
        return (
            <Text
                style={[
                    this.getFontColor(),
                    UIFont.smallMedium(),
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {docName}
            </Text>
        );
    }

    renderDocumentMetadata() {
        const { isReceived } = this.props;
        const imgCloud = isReceived ? cloudBlack : cloudWhite;

        return (
            <View style={UIStyle.flexRow}>
                <Text
                    style={[
                        this.getMetaDataFontColor(),
                        UIFont.tinyRegular(),
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                PDF {this.getFileSize()}
                </Text>
                <Image style={UIStyle.marginHorizontalOffset} source={imgCloud} />
            </View>
        );
    }

    renderDocument() {
        const { isReceived } = this.props;
        const image = isReceived ? fileBlue : fileWhite;

        return (
            <View style={[styles.infoSection]}>
                <Image source={image} />
                <View style={[styles.metadata, UIStyle.flexColumn]}>
                    {this.renderDocumentName()}
                    {this.renderDocumentMetadata()}
                </View>
            </View>
        );
    }

    renderSpinnerOverlay() {
        return (
            <UISpinnerOverlay
                visible={this.state.showSpinner}
            />
        );
    }

    render() {
        return (
            <View
                style={styles.container}
                key={`documentViewContent${this.getUrl()}`}
            >
                <TouchableOpacity onPress={() => this.onTouchDocument()}>
                    {this.renderDocument()}
                </TouchableOpacity>
                {this.renderSpinnerOverlay()}
            </View>
        );
    }
}
