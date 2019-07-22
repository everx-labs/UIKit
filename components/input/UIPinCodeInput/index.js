// @flow
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, LayoutAnimation, Animated, Vibration } from 'react-native';

import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UITextStyle from '../../../helpers/UITextStyle';
import UILabel from '../../text/UILabel';

import UILocalized from '../../../helpers/UILocalized';

type State = {
    pin: string,
    wrongPin: boolean,
    shakeMargin: number,
};

type Props = {
    pinCodeLenght: number,
    pinToConfirm?: string,
    pinTitle?: string,
    pinDescription?: string,
    pinDescriptionColor?: string,
    usePredefined?: boolean,
    disabled?: boolean,
    pinCodeEnter: (pin: string) => void,
};

const styleProperties = {
    key: {
        width: UIConstant.buttonHeight(),
        height: UIConstant.buttonHeight(),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: UIConstant.mediumContentOffset(),
        marginRight: UIConstant.mediumContentOffset(),
    },
    dotView: {
        width: UIConstant.tinyCellHeight(),
        height: UIConstant.tinyCellHeight(),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: UIConstant.smallContentOffset(),
        marginRight: UIConstant.smallContentOffset(),
    },
    dotBlue: {
        width: UIConstant.tinyCellHeight(),
        height: UIConstant.tinyCellHeight(),
        borderRadius: UIConstant.borderRadius(),
        backgroundColor: UIColor.primary(),
    },
    dotRed: {
        width: UIConstant.tinyCellHeight(),
        height: UIConstant.tinyCellHeight(),
        borderRadius: UIConstant.borderRadius(),
        backgroundColor: UIColor.error(),
    },
    dotGray: {
        width: UIConstant.tinyCellHeight() / 2,
        height: UIConstant.tinyCellHeight() / 2,
        borderRadius: UIConstant.borderRadius() / 2,
        backgroundColor: UIColor.grey3(),
    },
    animatedView: {
        height: UIConstant.mediumCellHeight(),
    },
};

const styles = StyleSheet.create(styleProperties);

export default class UIPinCodeInput extends UIComponent<Props, State> {
    static defaultProps = {
        pinTitle: '',
        pinDescription: ' \n ',
        usePredefined: false,
        disabled: false,
    };

    indicator: Array<number>;
    shakeValue: any;

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            pin: '',
            wrongPin: false,
            shakeMargin: 0,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.initiateIndicator();
        this.resetShake();
    }

    // events
    onKeyPress(key: string) {
        if (!this.props.disabled) {
            const pin = `${this.state.pin}${key}`;
            this.setPin(pin);
            if (this.props.pinToConfirm
                && pin.length === this.props.pinCodeLenght
                && pin !== this.props.pinToConfirm) {
                this.wrongPin();
            }
        }
    }

    onDeletePress = () => {
        const { length } = this.state.pin;
        const pin = this.state.pin.substr(0, length - 1);
        this.setPin(pin);
    }

    onPressPredefined = () => {
        // generate string consisted of '1' and with length = props.pinCodeLenght
        const str = Array.prototype.join.call({ length: (this.props.pinCodeLenght || -1) + 1 }, '1');
        this.setPin(str);
    }

    // setters
    setPin(pin: string) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setStateSafely({ pin }, () => {
            if (pin.length === this.props.pinCodeLenght) {
                this.props.pinCodeEnter(pin);
            }
        });
    }

    // actions
    initiateIndicator() {
        this.indicator = [];
        for (let i = 1; i <= this.props.pinCodeLenght; i += 1) {
            this.indicator.push(i);
        }
    }

    resetPin() {
        this.setStateSafely({ pin: '' }, () => {
            this.props.pinCodeEnter('');
        });
    }

    wrongPin() {
        setTimeout(() => {
            this.setStateSafely({ wrongPin: true });
            Vibration.vibrate(500);
            this.shakeIndicator();
        }, 300);
        setTimeout(() => {
            this.setStateSafely({ wrongPin: false });
            this.resetPin();
        }, 600);
    }

    resetShake() {
        this.shakeValue = new Animated.Value(0);
        const shakeMargin = this.shakeValue.interpolate({
            inputRange: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
            outputRange: [0, -10, 10, -10, 10, -10, 0],
        });
        this.setState({
            shakeMargin,
        });
    }

    shakeIndicator() {
        Animated.timing(this.shakeValue, {
            toValue: 1,
            duration: 250,
        }).start(() => this.resetShake());
    }

    // render
    renderLabel() {
        return (
            <UILabel
                style={UIStyle.Margin.bottomDefault()}
                role={UILabel.Role.SecondaryBody}
                text={this.props.pinTitle}
                numberOfLines={1}
                selectable={false}
            />
        );
    }

    renderItem(item: number) {
        let dotStyle;
        if (this.state.wrongPin) {
            dotStyle = styles.dotRed;
        } else if (item > this.state.pin.length) {
            dotStyle = styles.dotGray;
        } else {
            dotStyle = styles.dotBlue;
        }
        return (
            <View style={styles.dotView}>
                <View style={dotStyle} />
            </View>
        );
    }

    renderIndicator() {
        return (
            <Animated.View style={[styles.animatedView, { marginLeft: this.state.shakeMargin }]}>
                <FlatList
                    style={[UIStyle.Margin.topTiny(), UIStyle.Margin.bottomDefault()]}
                    horizontal
                    data={this.indicator}
                    extraData={this.state}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => `${item}`}
                />
            </Animated.View>
        );
    }

    renderDescription() {
        const descStyle = StyleSheet.create({
            descColor: {
                color: this.props.pinDescriptionColor,
                minHeight: UIConstant.mediumCellHeight(),
            },
        });
        return (
            <UILabel
                style={[UIStyle.Margin.bottomMassive(),
                    descStyle.descColor]}
                role={UILabel.Role.CaptionTertiary}
                text={this.props.pinDescription}
                numberOfLines={2}
                selectable={false}
            />
        );
    }

    renderKeyboard() {
        return (
            <View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomNormal()]}>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('1')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('2')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('3')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>3</Text>
                    </TouchableOpacity>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomNormal()]}>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('4')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('5')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('6')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>6</Text>
                    </TouchableOpacity>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomNormal()]}>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('7')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('8')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('9')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomMedium()]}>
                    <TouchableOpacity
                        style={styles.key}
                        disabled={!this.props.usePredefined}
                        onPress={this.onPressPredefined}
                    >
                        <Text style={UITextStyle.primaryCaptionMedium}>
                            {this.props.usePredefined ? 'DEV' : ''}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => this.onKeyPress('0')}
                        disabled={this.state.pin.length === this.props.pinCodeLenght}
                    >
                        <Text style={UITextStyle.primaryTitleLight}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={this.onDeletePress}
                        disabled={this.state.pin.length === 0}
                    >
                        <Text style={UITextStyle.primaryCaptionMedium}>{UILocalized.Delete}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={[UIStyle.fullWidthCenterContainer, UIStyle.flex]}>
                <View style={[UIStyle.flexJustifyCenter, UIStyle.alignCenter]}>
                    {this.renderLabel()}
                    {this.renderIndicator()}
                    {this.renderDescription()}
                </View>
                {this.renderKeyboard()}
            </View>
        );
    }
}
