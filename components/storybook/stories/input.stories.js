import React from 'react';
import { View, Text } from 'react-native';
import CenterView from '../CenterView';
import FullWidthView from '../FullWidthView';

import { storiesOf } from '../helpers/storiesOf';
import Constants from '../helpers/constants';
import { getUri } from '../helpers/getUri';

import {
    UITextButton,
    UIStyle,
    UIColor,
    UIComponent,
    UIButtonGroup,
    UIDateInput,
    UIDetailsInput,
    UIEmailInput,
    UILinkInput,
    UINumberInput,
    UIPhoneInput,
    UIPinCodeInput,
    UITextInput,
} from '../../../UIKit';


const iconDefault = getUri(require('../../../assets/ico-triangle/ico-triangle.png'));

class InputTester extends UIComponent {
    constructor(props) {
        super(props);

        const values = [];
        const childrenCount = this.props.children?.length || 1;
        const children = childrenCount > 1 ?
            this.props.children :
            [this.props.children];

        children.forEach((ch, rank) => {
            values[rank] = ch.props.value;
        });

        this.state = { values, children };
    }

    render() {
        return (
            <UIButtonGroup direction="column" gutter={32}>
                {this.state.children.map((child, rank) => {
                    return React.cloneElement(
                        child,
                        {
                            onChangeText: (newText) => {
                                const values = this.state.values;
                                values[rank] = newText;
                                this.setStateSafely({ values });
                            },
                            value: this.state.values[rank],
                        },
                    );
                })}
            </UIButtonGroup>
        );
    }
}

storiesOf(Constants.CategoryInput, module)
    .addDecorator(getStory => <CenterView><InputTester>{getStory()}</InputTester></CenterView>)
    .add('DetailsInput', () => (
        <InputTester>
            <UIDetailsInput
                placeholder="TextArea maxHeight=150"
                forceMultiLine
                maxLines={3}
                maxHeight={150}
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input"
                button={{
                    title: 'Action',
                    icon: iconDefault,
                    textStyle: { color: UIColor.primary() },
                    onPress: () => { alert('right button pressed'); },
                }}
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input"
                button={{
                    title: 'Action',
                    textStyle: { color: UIColor.primary() },
                    onPress: () => { alert('right button pressed'); },
                }}
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input Autofocus"
                autoFocus
            />
            <UIDetailsInput
                placeholder="Action Theme"
                theme={UIColor.Theme.Action}
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input"
                button={{
                    title: 'Secondary',
                    disabled: true,
                }}
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input"
                button={{
                    title: 'Secondary',
                    onPress: () => { alert('button pressed'); },
                }}
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input"
                rightComponent={
                    <UITextButton
                        iconColor={UIColor.black()}
                        icon={iconDefault}
                        onPress={() => { alert('right component pressed'); }}
                    />
                }
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value=""
                required
            />
            <UIDetailsInput
                placeholder="Placeholder"
                value="Input"
                prefixIcon={iconDefault}
                prefixIconColor={UIColor.black()}
            />
        </InputTester>
    ))
    .add('DateInput', () => (
        <InputTester><UIDateInput placeholder="Date" required /></InputTester>
    ))
    .add('EmailInput', () => (
        <InputTester><UIEmailInput placeholder="Enter your email" /></InputTester>
    ))
    .add('LinkInput', () => (
        <InputTester><UILinkInput placeholder="Your url here" /></InputTester>
    ))
    .add('NumberInput', () => (
        <InputTester><UINumberInput /></InputTester>
    ))
    .add('PhoneInput', () => (
        <InputTester><UIPhoneInput /></InputTester>
    ))
    .add('PinCodeInput', () => (
        <InputTester>
            <UIPinCodeInput
                pinTitle="pinTitle"
                pinCodeLength={4}
                pinToConfirm="1234"
                pinDescription="pinDescription"
                pinCodeEnter={(pin) => { }}
            />
        </InputTester>
    ));
