// @flow
import React from 'react';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { Animated, StyleSheet, Text, View } from 'react-native';

import type { ActionProps, ActionState } from '../../UIActionComponent';
import UIActionComponent from '../../UIActionComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIColorPalette from '../../../helpers/UIColor/UIColorPalette';

import icoProgress from '../../../assets/ico-progress/progress.png';

type Props = ActionProps & {
    containerStyle: ViewStyleProp,
    progress: boolean,
    transparent: boolean,
    title: number | string,
    truncTitle: boolean,
    caption: string,
    truncCaption: boolean,
    details: string,
};

type State = ActionState & {
    spinValue: AnimatedValue,
};

const styles = StyleSheet.create({
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hoverOffset: {
        left: -UIConstant.contentOffset(),
        right: -UIConstant.contentOffset(),
        top: 0,
        bottom: 0,
    },
});

export default class UIDetailsButton extends UIActionComponent<Props, State> {
    static defaultProps: Props = {
        ...UIActionComponent.defaultProps,
        narrow: false,
        containerStyle: {},
        progress: false,
        title: '',
        truncTitle: false,
        caption: '',
        truncCaption: false,
        fixedCaption: '',
        details: '',
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.state,
            spinValue: new Animated.Value(0),
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.progress) {
            this.animateRotation();
        }
    }

    // Setters
    setSpinValue(spinValue: AnimatedValue) {
        this.setStateSafely({ spinValue });
    }

    // Getters
    getSpinValue() {
        return this.state.spinValue;
    }

    getBackgroundStyle() {
        if (this.props.disabled || this.props.disableHighlight) {
            return null;
        }

        if (this.isHover() || this.isTapped()) {
            const color = UIColor.whiteLight();
            return [
                UIColor.getBackgroundColorStyle(color),
                styles.hoverOffset,
            ];
        }
        return null;
    }

    getTitleColorStyle() {
        if (this.props.disabled || this.props.titleIsText) {
            return UIColor.getColorStyle(UIColorPalette.text.lightSecondary);
        }

        if (this.isHover() || this.isTapped()) {
            const color = UIColor.primary4();
            return UIColor.getColorStyle(color);
        }
        return null;
    }

    getFormattedText(str: string) {
        const signs = this.props.narrow ? 5 : 9;
        if (str.length <= signs * 2) {
            return str;
        }
        const dots = '.'.repeat(signs);
        return `${str.substr(0, signs)} ${dots} ${str.substr(str.length - signs)}`;
    }

    // Actions
    animateRotation() {
        Animated.timing(this.state.spinValue, {
            toValue: 1,
            duration: 2000,
        })
            .start(() => {
                if (this.mounted) {
                    this.setSpinValue(new Animated.Value(0));
                    this.animateRotation();
                }
            });
    }

    // Render
    renderProgressCard() {
        const spinValue = this.getSpinValue();
        const spin = spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        return (
            <View style={UIStyle.Common.alignCenter()}>
                <Animated.Image
                    source={icoProgress}
                    style={{
                        transform: [{ rotate: spin }],
                    }}
                />
            </View>
        );
    }

    renderContentCard() {
        const {
            title, caption, details, secondDetails, captionComponent,
        } = this.props;
        const formattedCaption = this.props.truncCaption ? this.getFormattedText(caption) : caption;
        const captionTextComponent = caption ? (
            <Text
                ellipsizeMode="middle"
                numberOfLines={1}
                style={UIStyle.Text.primarySmallRegular()}
            >
                {formattedCaption}
            </Text>
        ) : null;
        const formattedTitle = this.props.truncTitle ? this.getFormattedText(title) : title;
        return (
            <React.Fragment>
                <View style={styles.rowContainer}>
                    <Text
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={[
                            UIStyle.Text.smallMedium(),
                            UIStyle.Common.flex(),
                            UIStyle.Margin.rightDefault(),
                            this.getTitleColorStyle(),
                        ]}
                    >
                        {formattedTitle}
                    </Text>
                    {captionTextComponent}
                    {captionComponent}
                </View>
                <View style={[styles.rowContainer, UIStyle.Margin.topTiny()]}>
                    <Text style={[
                        UIStyle.Text.secondaryCaptionRegular(),
                        UIStyle.Common.flex(),
                    ]}
                    >
                        {details}
                    </Text>
                    <Text style={UIStyle.Text.secondaryCaptionRegular()}>
                        {secondDetails}
                    </Text>
                </View>
            </React.Fragment>
        );
    }

    renderCard() {
        if (this.props.progress) {
            return this.renderProgressCard();
        }
        return this.renderContentCard();
    }

    renderContent() {
        const { containerStyle } = this.props;
        const backgroundStyle = this.getBackgroundStyle();
        return (
            <View style={[
                UIStyle.Common.justifyCenter(),
                UIStyle.Height.majorCell(),
                containerStyle,
            ]}
            >
                <View style={[UIStyle.Common.positionAbsolute(), backgroundStyle]} />
                {this.renderCard()}
            </View>
        );
    }
}
