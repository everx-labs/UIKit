// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

import icoProgress from '../../../assets/ico-progress/progress.png';

type Props = {
    containerStyle: StylePropType,
    progress: boolean,
    title: string,
    caption: string,
    details: string,
};

type State = {};

const styles = StyleSheet.create({
    container: {
        height: UIConstant.largeCellHeight(),
        backgroundColor: UIColor.backgroundPrimary(),
        borderRadius: UIConstant.smallBorderRadius(),
        paddingHorizontal: UIConstant.contentOffset(),
        justifyContent: 'center',
        ...UIConstant.commonShadow(),
    },
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default class UICard extends UIComponent<Props, State> {
    renderProgressCard() {
        if (!this.props.progress) {
            return null;
        }
        return (
            <View style={{ alignItems: 'center' }}>
                <Image source={icoProgress} />
            </View>
        );
    }

    renderContentCard() {
        if (this.props.progress) {
            return null;
        }
        const { title, caption, details } = this.props;
        return (
            <React.Fragment>
                <View style={styles.rowContainer}>
                    <Text style={UITextStyle.primarySmallMedium}>
                        {title}
                    </Text>
                    <Text style={UITextStyle.primarySmallRegular}>
                        {caption}
                    </Text>
                </View>
                <Text style={[UIStyle.marginTopTiny, UITextStyle.secondaryCaptionRegular]}>
                    {details}
                </Text>
            </React.Fragment>
        );
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                {this.renderProgressCard()}
                {this.renderContentCard()}
            </View>
        );
    }

    static defaultProps: Props;
}

UICard.defaultProps = {
    containerStyle: {},
    progress: false,
    title: '',
    caption: '',
    details: '',
};

