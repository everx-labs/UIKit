// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import { View, StyleSheet, Text, TouchableWithoutFeedback, Animated } from 'react-native';

import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIDetailsView from '../UIDetailsView';

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

type State = {
    hover: boolean,
    tapped: boolean,
    spinValue: AnimatedValue,
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    loadingCard: {
        alignItems: 'center',
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

export default class UICard extends UIComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            hover: false,
            tapped: false,
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

    setHover(hover: boolean = true) {
        this.setStateSafely({ hover });
    }

    setTapped(tapped: boolean = true) {
        this.setState({ tapped });
    }

    // Getters
    getSpinValue() {
        return this.state.spinValue;
    }

    isHover() {
        return this.state.hover;
    }

    isTapped() {
        return this.state.tapped;
    }

    getCardPreset() {
        const { progress, caption } = this.props;
        if (progress) {
            return {
                card: this.renderProgressCard(),
                cardStyle: styles.defaultCard,
            };
        } else if (!caption) {
            return {
                card: this.renderStatusCard(),
                cardStyle: { width: this.props.width },
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
        }).start(() => {
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
            <View style={styles.loadingCard}>
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
        const { onPress, containerStyle, transparent } = this.props;
        const { card, cardStyle } = this.getCardPreset();
        const backgroundStyle = transparent ? styles.transparent : styles.filled;
        const shadowStyle = this.getShadowStyle();
        const reactHandlers = {
            onMouseEnter: () => this.setHover(),
            onMouseLeave: () => this.setHover(false),
        };
        return (
            <TouchableWithoutFeedback
                onPress={onPress}
                onPressIn={() => this.setTapped()}
                onPressOut={() => this.setTapped(false)}
                {...(reactHandlers: any)}
            >
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
            </TouchableWithoutFeedback>
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

