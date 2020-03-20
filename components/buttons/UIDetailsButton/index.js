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
import UIFunction from '../../../helpers/UIFunction';
import UIColorPalette from '../../../helpers/UIColor/UIColorPalette';

import icoProgress from '../../../assets/ico-progress/progress.png';

type Props = ActionProps & {
    style: ViewStyleProp,
    containerStyle: ViewStyleProp,
    progress: boolean,
    transparent: boolean,
    title: number | string,
    truncTitle: boolean,
    caption: string,
    truncCaption: boolean,
    details: string,
    titleComponent?: React$Node,
    captionComponent?: React$Node,
    customComponent?: React$Node,
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
        style: {},
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
        return UIFunction.truncText(str, this.props.narrow);
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
            <View style={UIStyle.common.alignCenter()}>
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
            title, caption, details, secondDetails,
            titleComponent, captionComponent, customComponent,
        } = this.props;
        const formattedCaption = this.props.truncCaption ? this.getFormattedText(caption) : caption;
        const captionText = caption ? (
            <Text
                ellipsizeMode="middle"
                numberOfLines={1}
                style={UIStyle.text.primarySmallRegular()}
            >
                {formattedCaption}
            </Text>
        ) : null;
        const formattedTitle = this.props.truncTitle ? this.getFormattedText(title) : title;
        return (
            <React.Fragment>
                {customComponent}
                <View style={styles.rowContainer}>
                    {!!formattedTitle && (
                        <Text
                            ellipsizeMode="middle"
                            numberOfLines={1}
                            style={[
                                UIStyle.text.smallMedium(),
                                UIStyle.common.flex(),
                                UIStyle.margin.rightDefault(),
                                this.getTitleColorStyle(),
                            ]}
                        >
                            {formattedTitle}
                        </Text>
                    )}
                    {titleComponent}
                    {!formattedTitle && !titleComponent && <View style={UIStyle.common.flex()} />}
                    {captionText}
                    {captionComponent}
                </View>
                {!!(details || secondDetails) && (
                    <View style={[styles.rowContainer, UIStyle.margin.topTiny()]}>
                        <Text style={[
                            UIStyle.text.secondaryCaptionRegular(),
                            UIStyle.common.flex(),
                        ]}
                        >
                            {details}
                        </Text>
                        <Text style={UIStyle.text.secondaryCaptionRegular()}>
                            {secondDetails}
                        </Text>
                    </View>
                )}
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
        const { containerStyle, style } = this.props;
        const backgroundStyle = this.getBackgroundStyle();
        return (
            <View style={[
                UIStyle.common.justifyCenter(),
                UIStyle.height.majorCell(),
                containerStyle,
                style,
            ]}
            >
                <View style={[UIStyle.common.positionAbsolute(), backgroundStyle]} />
                {this.renderCard()}
            </View>
        );
    }
}
