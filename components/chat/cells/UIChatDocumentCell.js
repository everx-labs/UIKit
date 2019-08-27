// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import UIPureComponent from '../../UIPureComponent';
import UISpinnerOverlay from '../../UISpinnerOverlay';
import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';
import UIStyle from '../../../helpers/UIStyle';

import docBlue from '../../../assets/ico-doc-blue/ico-doc-blue.png';
import docWhite from '../../../assets/ico-doc-white/ico-doc-white.png';

type Props = {
    document: any,
    isReceived: boolean,
    onOpenPDF?: (msg: any) => void,
}

type State = {
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

    onTouchDocument() {
        const { onOpenPDF, document } = this.props;
        if (onOpenPDF) {
            onOpenPDF(document);
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

    }

    // Actions
    renderDocumentName() {
        const doc = this.props.document;
        const docName = doc.info.metadata?.docName || '';
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
