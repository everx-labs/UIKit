// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIDetailsView from '../../text/UIDetailsView';

import icoProgress from '../../../assets/ico-progress/progress.png';

type Props = {
    width: number,
    containerStyle: StylePropType,
    progress: boolean,
    transparent: boolean,
    title: string,
    caption: string,
    details: string,
    onPress: () => void,
};

type State = {};

const styles = StyleSheet.create({
    container: {
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
    defaultCard: {
        height: UIConstant.largeCellHeight(),
    },
    statusContentContainer: {
        margin: 0,
    },
});

export default class UICard extends UIComponent<Props, State> {
    // Getters

    // Render
    renderProgressCard() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Image source={icoProgress} />
            </View>
        );
    }

    renderStatusCard() {
        const { title, details } = this.props;
        return (
            <UIDetailsView
                value={title}
                comments={details}
                containerStyle={styles.statusContentContainer}
                textStyle={UITextStyle.primaryTitleLight}
                commentsStyle={UITextStyle.secondaryCaptionRegular}
            />
        );
    }

    renderContentCard() {
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
        const {
            progress, caption, onPress, containerStyle,
        } = this.props;
        let card;
        let cardStyle;
        if (progress) {
            card = this.renderProgressCard();
            cardStyle = styles.defaultCard;
        } else if (!caption) {
            card = this.renderStatusCard();
            cardStyle = { width: this.props.width };
        } else {
            card = this.renderContentCard();
            cardStyle = styles.defaultCard;
        }
        return (
            <TouchableOpacity
                onPress={onPress}
            >
                <View style={[styles.container, cardStyle, containerStyle]}>
                    {card}
                </View>
            </TouchableOpacity>
        );
    }

    static defaultProps: Props;
}

UICard.defaultProps = {
    width: 0,
    containerStyle: {},
    progress: false,
    transparent: false,
    title: '',
    caption: '',
    details: '',
    onPress: () => {},
};

