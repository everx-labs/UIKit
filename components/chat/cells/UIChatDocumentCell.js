// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIPureComponent from '../../UIPureComponent';
import UISpinnerOverlay from '../../UISpinnerOverlay';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';
import UIStyle from '../../../helpers/UIStyle';

import docBlue from '../../../assets/ico-doc-blue/ico-doc-blue.png';
import docWhite from '../../../assets/ico-doc-white/ico-doc-white.png';

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
            this.setStateSafely({ showSpinner: true }, () => {
                this.downloadDocument(onOpenPDF, document, additionalInfo);
            });
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
        // TODO:
        return '';
    }

    // Actions
    async downloadDocument(
        callback: (data: any, name: string) => void,
        downloader: any,
        info: ChatAdditionalInfo,
    ) {
        const docName = info.docName || '';
        const docData = await downloader(info.message);
        callback(docData, docName);
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
        return (
            <Text
                style={[
                    this.getMetaDataFontColor(),
                    UIFont.tinyRegular(),
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                PDF
            </Text>
        );
    }

    renderDocument() {
        const { isReceived } = this.props;
        const image = isReceived ? docBlue : docWhite;

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
