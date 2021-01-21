// @flow
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native';
import { BorderlessButton as RNGHBorderlessButton } from 'react-native-gesture-handler';
import debounce from 'lodash/debounce';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIStyle, UIColor, UIConstant } from '@tonlabs/uikit.core';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';
import UIPinCodeDots from './UIPinCodeDots';

const BorderlessButton = Platform.select({
    web: TouchableOpacity,
    android: TouchableOpacity,
    default: RNGHBorderlessButton,
});

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
        width: 90, // 1 + 88 + 1
        height: 74, // 1 + 72 + 1
        alignItems: 'center',
        justifyContent: 'center',
    },
    space: {
        flexGrow: 1,
        width: 1,
        minHeight: 1,
        maxHeight: UIConstant.pincodeKeyboardOffset(),
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

    haveListener: boolean = false;
    addKeyboardListener() {
        if (Platform.OS === 'web' && !this.haveListener) {
            this.haveListener = true;
            // Use of 'keydown' event to support backspace key.
            document.addEventListener('keydown', this.onWebKeyPressed);
        }
    }

    removeKeyboardListener() {
        if (Platform.OS === 'web' && this.haveListener) {
            this.haveListener = false;
            document.removeEventListener('keydown', this.onWebKeyPressed);
        }
    }

    // events
    onWebKeyPressed = (pressedKey: any) => {
        if (Number.isInteger(+pressedKey.key)) {
            this.onKeyPress(Number(pressedKey.key));
        } else if (pressedKey.keyCode === 8) {
            this.onDeletePress();
        }
    };

    pressedKeysQueue = [];

    processPressed = debounce(() => {
        const values = [...this.state.values];

        while (this.pressedKeysQueue.length) {
            const key = this.pressedKeysQueue.shift();

            if (values.length === this.props.pinCodeLength) {
                break;
            }

            values.push(key);
        }

        this.setState({ values });

        const pin = values.join('');
        this.props.pinCodeEnter(pin);

        if (this.props.pinToConfirm && values.length === this.props.pinCodeLength) {
            if (pin !== this.props.pinToConfirm) {
                this.wrongPin();
            }
        }
    });

    onKeyPress(key: number) {
        if (this.props.disabled) {
            return;
        }
        this.pressedKeysQueue.push(key);
        this.processPressed();
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
        this.pressedKeysQueue = [];
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
        this.pressedKeysQueue = [];
        this.props.pinCodeEnter('');
    }

    // render
    renderLabel() {
        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                numberOfLines={1}
                role={UILabelRoles.ParagraphText}
                selectable={false}
            >
                {this.props.pinTitle}
            </UILabel>
        );
    }

    renderDescription() {
        // eslint-disable-next-line no-nested-ternary
        const color = this.state.wrongPin
            ? UIColor.textNegative()
            : this.state.rightPin
                ? UIColor.textPositive()
                : this.props.pinDescriptionColor;

        const description = this.state.description || this.props.pinDescription;

        const descStyle = StyleSheet.create({
            descColor: {
                color,
            },
        });

        return (
            <UILabel
                color={UILabelColors.TextSecondary}
                numberOfLines={1}
                role={UILabelRoles.ParagraphFootnote}
                style={descStyle.descColor}
                selectable={false}
                testID={this.props.commentTestID}
            >
                {description}
            </UILabel>
        );
    }

    renderBiometryLogin() {
        const { biometryType } = this.props;

        if (!biometryType || !this.props.getPasscodeWithBiometry) {
            return null;
        }

        const icon =
            biometryType === BiometryType.Face
                ? UIAssets.icons.security.faceId
                : UIAssets.icons.security.touchId;

        return (
            <Image source={icon} />
        );
    }

    renderKeyboard() {
        const disabled = this.state.values.length === this.props.pinCodeLength;
        const opacityStyle = this.props.disabled ? { opacity: 0.5 } : null;
        return (
            <View testID="digitKeyboard">
                <View style={[UIStyle.flexRow]}>
                    <BorderlessButton
                        testID="pincode_digit_1"
                        style={styles.key}
                        onPress={() => this.onKeyPress(1)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >1</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_2"
                        style={styles.key}
                        onPress={() => this.onKeyPress(2)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >2</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_3"
                        style={styles.key}
                        onPress={() => this.onKeyPress(3)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >3</UILabel>
                    </BorderlessButton>
                </View>
                <View style={[UIStyle.flexRow]}>
                    <BorderlessButton
                        testID="pincode_digit_4"
                        style={styles.key}
                        onPress={() => this.onKeyPress(4)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >4</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_5"
                        style={styles.key}
                        onPress={() => this.onKeyPress(5)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >5</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_6"
                        style={styles.key}
                        onPress={() => this.onKeyPress(6)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >6</UILabel>
                    </BorderlessButton>
                </View>
                <View style={[UIStyle.flexRow]}>
                    <BorderlessButton
                        testID="pincode_digit_7"
                        style={styles.key}
                        onPress={() => this.onKeyPress(7)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >7</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_8"
                        style={styles.key}
                        onPress={() => this.onKeyPress(8)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >8</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_9"
                        style={styles.key}
                        onPress={() => this.onKeyPress(9)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >9</UILabel>
                    </BorderlessButton>
                </View>
                <View style={[UIStyle.flexRow, UIStyle.Margin.bottomMedium()]}>
                    <BorderlessButton
                        testID="pincode_biometry"
                        style={styles.key}
                        onPress={
                            this.props.usePredefined ? this.onPredefinedPress : this.onBiometryPress
                        }
                    >
                        {this.props.usePredefined && (
                            <UILabel
                                color={UILabelColors.TextPrimary}
                                role={UILabelRoles.ActionFootnote}
                            >DEV</UILabel>
                        )}
                        {!this.props.usePredefined && this.renderBiometryLogin()}
                    </BorderlessButton>

                    <BorderlessButton
                        testID="pincode_digit_0"
                        style={styles.key}
                        onPress={() => this.onKeyPress(0)}
                        disabled={disabled}
                    >
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.LightHuge}
                            style={opacityStyle}
                        >0</UILabel>
                    </BorderlessButton>
                    <BorderlessButton
                        testID="pincode_digit_delete"
                        style={styles.key}
                        onPress={this.onDeletePress}
                        disabled={this.state.values.length === 0}
                    >
                        <Image source={UIAssets.icons.ui.delete} />
                    </BorderlessButton>
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
                style={[
                    UIStyle.width.fullCenterContainer(),
                    UIStyle.flex.flexJustifyEnd(),
                ]}
            >
                <View style={UIStyle.flex.alignJustifyCenter()}>
                    {this.renderLabel()}
                    <UIPinCodeDots
                        ref={this.dotsRef}
                        length={6}
                        values={this.state.values}
                    />
                    {this.renderDescription()}
                </View>
                <View style={styles.space} />
                {this.renderKeyboard()}
            </View>
        );
    }
}
