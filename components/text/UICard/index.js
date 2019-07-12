// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import { Animated, StyleSheet, Text, View } from 'react-native';

import type { ActionProps, ActionState } from '../../UIActionComponent';
import UIActionComponent from '../../UIActionComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIDetailsView from '../UIDetailsView';

import icoProgress from '../../../assets/ico-progress/progress.png';

type Props = ActionProps & {
    width: number,
    containerStyle: StylePropType,
    progress: boolean,
    transparent: boolean,
    title: number | string,
    caption: string,
    details: string,
};

type State = ActionState & {
    spinValue: AnimatedValue,
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    filled: {
        paddingHorizontal: UIConstant.contentOffset(),
        backgroundColor: UIColor.backgroundPrimary(),
        borderRadius: UIConstant.smallBorderRadius(),
    },
    transparent: {
        backgroundColor: 'transparent',
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

export default class UICard extends UIActionComponent<Props, State> {
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

    getCardPreset() {
        const { progress, caption, width } = this.props;
        if (progress) {
            return {
                card: this.renderProgressCard(),
                cardStyle: styles.defaultCard,
            };
        } else if (!caption && width) {
            return {
                card: this.renderStatusCard(),
                cardStyle: { width },
            };
        }
        return {
            card: this.renderContentCard(),
            cardStyle: styles.defaultCard,
        };
    }

    getShadowStyle() {
        if (!this.props.transparent && !this.isTapped()) {
            if (this.isHover()) {
                return UIStyle.shadow40;
            }
            return UIStyle.commonShadow;
        }
        return null;
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

    renderStatusCard() {
        const { title, details } = this.props;
        return (
            <UIDetailsView
                value={title}
                comments={details}
                containerStyle={styles.statusContentContainer}
                textStyle={UIStyle.Text.primaryTitleLight()}
                commentsStyle={UIStyle.Text.secondaryCaptionRegular()}
            />
        );
    }

    renderContentCard() {
        const {
            title, caption, fixedCaption, details,
        } = this.props;
        return (
            <React.Fragment>
                <View style={styles.rowContainer}>
                    <Text
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={[
                            UIStyle.Text.primarySmallMedium(),
                            UIStyle.Common.flex(),
                            UIStyle.Margin.rightDefault(),
                        ]}
                    >
                        {title}
                    </Text>
                    <Text
                        ellipsizeMode="clip"
                        numberOfLines={1}
                        style={[
                            UIStyle.Text.primarySmallRegular(),
                            UIStyle.Common.flex(),
                            UIStyle.Text.alignRight(),
                        ]}
                    >
                        {caption}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            UIStyle.Text.primarySmallRegular(),
                            UIStyle.Margin.leftSmall(),
                        ]}
                    >
                        {fixedCaption}
                    </Text>
                </View>
                <Text style={[UIStyle.Margin.topTiny(), UIStyle.Text.secondaryCaptionRegular()]}>
                    {details}
                </Text>
            </React.Fragment>
        );
    }

    renderContent() {
        const { containerStyle, transparent } = this.props;
        const { card, cardStyle } = this.getCardPreset();
        const backgroundStyle = transparent ? styles.transparent : styles.filled;
        const shadowStyle = this.getShadowStyle();
        return (
            <View style={[
                styles.container,
                cardStyle,
                containerStyle,
                backgroundStyle,
                shadowStyle,
            ]}
            >
                {card}
            </View>
        );
    }

    static defaultProps: Props;
}

UICard.defaultProps = {
    ...UIActionComponent.defaultProps,
    width: 0,
    containerStyle: {},
    progress: false,
    transparent: false,
    title: '',
    caption: '',
    fixedCaption: '',
    details: '',
};

