// @flow
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native';

import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UITextStyle from '../../../helpers/UITextStyle';
import UILabel from '../../text/UILabel';
import UILocalized from '../../../helpers/UILocalized';

import UIPinCodeDots from './UIPinCodeDots';
import UIAssets from '../../../assets/UIAssets';

const BiometryType = Object.freeze({
    Fingerprint: 'Fingerprint',
    Face: 'Face',
});

type State = {
    values: Array<number>,
    wrongPin: boolean,
    rightPin: boolean,
    description: string,
};

type Props = {
    pinCodeLength: number,
    pinToConfirm?: string,
    pinTitle?: string,
    pinDescription?: string,
    pinDescriptionColor?: string,
    usePredefined?: boolean,
    disabled?: boolean,
    pinCodeEnter: (pin: string) => void,
    testID?: string,
    commentTestID?: string,
    biometryType?: ?$Values<typeof BiometryType>,
    getPasscodeWithBiometry?: () => Promise<string>,
};

const styles = StyleSheet.create({
    key: {
        // Coefficient 1.01 need for ios version because
        // new font symbols interval bigger than default font.
        width: UIConstant.largeButtonHeight() * 1.01,
        height: UIConstant.largeButtonHeight(),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: UIConstant.contentOffset(),
    },
});

export default class UIPinCodeInput extends UIComponent<Props, State> {
    static defaultProps = {
        pinTitle: '',
        pinDescription: ' \n ',
        usePredefined: false,
        disabled: false,
        biometryType: null,
        onBiometryLogin: null,
    };

    static BiometryType = BiometryType;

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            values: [],
            wrongPin: false,
            rightPin: false,
            description: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.addKeyboardListener();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.removeKeyboardListener();
    }

    addKeyboardListener() {
        if (Platform.OS === 'web') {
            // Use of 'keydown' event to support backspace key.
            document.addEventListener('keydown', this.onWebKeyPressed);
        }
    }

    removeKeyboardListener() {
        if (Platform.OS === 'web') {
            document.removeEventListener('keydown', this.onWebKeyPressed);
        }
    }

    // events
    onWebKeyPressed = (pressedKey: any) => {
        if (pressedKey.keyCode > 47 && pressedKey.keyCode < 58) {
            this.onKeyPress(pressedKey.key);
        } else if (pressedKey.keyCode === 8) {
            this.onDeletePress();
        }
    };

    onKeyPress(key: number) {
        if (this.props.disabled) {
            return;
        }
        const values = [...this.state.values, key];

        if (values.length > this.props.pinCodeLength) {
            return;
        }

        this.setState({ values });

        const pin = values.join('');
        this.props.pinCodeEnter(pin);

        if (
            this.props.pinToConfirm &&
            values.length === this.props.pinCodeLength
        ) {
            if (pin !== this.props.pinToConfirm) {
                this.wrongPin();
            }
        }
    }

    onDeletePress = () => {
        const values = [...this.state.values];
        values.pop();
        this.setState({ values });
    };

    onBiometryPress = async () => {
        if (!this.props.getPasscodeWithBiometry) {
            return;
        }

        const pin = await this.props.getPasscodeWithBiometry();

        if (pin) {
            this.setState({ values: pin.split('').map(n => +n) });
            this.props.pinCodeEnter(pin);
        }
    }

    onPredefinedPress = () => {
        if (this.props.disabled) {
            return;
        }

        // generate string consisted of '1' and with length = props.pinCodeLength
        const str = Array.prototype.join.call(
            { length: (this.props.pinCodeLength || -1) + 1 },
            '1',
        );
        this.setState({ values: str.split('').map(n => +n) });
        this.props.pinCodeEnter(str);
    };

    // actions
    resetPin() {
        this.setState({
            values: [],
        });
        this.props.pinCodeEnter('');
    }

    async wrongPin(description?: string) {
        this.setState({
            wrongPin: true,
            description,
        });
        await (this.dotsRef.current && this.dotsRef.current.showWrongPin());
        this.setState({
            wrongPin: false,
            description: '',
            values: [],
        });
        this.props.pinCodeEnter('');
    }

    async rightPin(description?: string) {
        this.setState({
            rightPin: true,
            description,
        });
        await (this.dotsRef.current && this.dotsRef.current.showRightPin());
        this.setState({
            rightPin: false,
            description: '',
            values: [],
        });
        this.props.pinCodeEnter('');
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

    renderDescription() {
        // eslint-disable-next-line no-nested-ternary
        const color = this.state.wrongPin
            ? UIColor.error()
            : this.state.rightPin
                ? UIColor.success()
                : this.props.pinDescriptionColor;

        const description = this.state.description || this.props.pinDescription;

        const descStyle = StyleSheet.create({
            descColor: {
                color,
                minHeight: UIConstant.mediumCellHeight(),
            },
        });

        return (
            <UILabel
                testID={this.props.commentTestID}
                style={[UIStyle.Margin.bottomMassive(), descStyle.descColor]}
                role={UILabel.Role.CaptionTertiary}
                text={description}
                numberOfLines={2}
                selectable={false}
            />
        );
    }

    renderBiometryLogin() {
        const { biometryType } = this.props;

        if (!biometryType || !this.props.getPasscodeWithBiometry) {
            return null;
        }

        const icon = biometryType === BiometryType.Face ? UIAssets.faceId : UIAssets.touchId;

        return (
            <Image source={icon} />
        );
    }

    renderKeyboard() {
        const disabled = this.state.values.length === this.props.pinCodeLength;
        const opacityStyle = this.props.disabled ? { opacity: 0.5 } : null;
        return (
            <View testID="digitKeyboard">
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomTiny()]}>
                    <TouchableOpacity
                        testID="pincode_digit_1"
                        style={styles.key}
                        onPress={() => this.onKeyPress(1)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            1
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_2"
                        style={styles.key}
                        onPress={() => this.onKeyPress(2)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            2
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_3"
                        style={styles.key}
                        onPress={() => this.onKeyPress(3)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            3
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomTiny()]}>
                    <TouchableOpacity
                        testID="pincode_digit_4"
                        style={styles.key}
                        onPress={() => this.onKeyPress(4)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            4
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_5"
                        style={styles.key}
                        onPress={() => this.onKeyPress(5)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            5
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_6"
                        style={styles.key}
                        onPress={() => this.onKeyPress(6)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            6
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomTiny()]}>
                    <TouchableOpacity
                        testID="pincode_digit_7"
                        style={styles.key}
                        onPress={() => this.onKeyPress(7)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            7
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_8"
                        style={styles.key}
                        onPress={() => this.onKeyPress(8)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            8
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_9"
                        style={styles.key}
                        onPress={() => this.onKeyPress(9)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            9
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomMedium()]}>
                    <TouchableOpacity
                        testID="pincode_digit_delete"
                        style={styles.key}
                        onPress={this.onDeletePress}
                        disabled={this.state.values.length === 0}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryCaptionMedium,
                                this.state.values.length === 0 && {
                                    opacity: 0.5,
                                },
                            ]}
                        >
                            {UILocalized.Delete}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_digit_0"
                        style={styles.key}
                        onPress={() => this.onKeyPress(0)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                UITextStyle.primaryTitleLight,
                                opacityStyle,
                            ]}
                        >
                            0
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        testID="pincode_biometry"
                        style={styles.key}
                        onPress={this.props.usePredefined
                            ? this.onPredefinedPress
                            : this.onBiometryPress
                        }
                    >
                        {this.props.usePredefined && (
                            <Text style={UITextStyle.primaryCaptionMedium}>
                                DEV
                            </Text>
                        )}
                        {!this.props.usePredefined && (
                            this.renderBiometryLogin()
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    dotsRef = React.createRef<UIPinCodeDots>();

    render() {
        const { testID } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <View
                {...testIDProp}
                style={[UIStyle.fullWidthCenterContainer, UIStyle.flex]}
            >
                <View style={[UIStyle.flexJustifyCenter, UIStyle.alignCenter]}>
                    {this.renderLabel()}
                    <UIPinCodeDots
                        ref={this.dotsRef}
                        length={6}
                        values={this.state.values}
                    />
                    {this.renderDescription()}
                </View>
                {this.renderKeyboard()}
            </View>
        );
    }
}
