// @flow
import React from 'react';
import { Text, View } from 'react-native';

import {
    UIFunction,
    UIStyle,
} from '@uikit/core';
import {
    UIButton,
    UIComponent,
    UIDetailsInput,
    UIToastMessage,
    UIEmailInput,
} from '@uikit/components';
import type { DetailsProps } from '@uikit/components/UIDetailsInput';
import type { ActionState } from '@uikit/components/UIActionComponent';
import { UICustomSheet } from '@uikit/navigation';

import { uiLocalized } from '@tonlabs/uikit.localization';

export type UIFeedbackSubmitFunc = ({ email: string, feedback: string }) => void;

type Props = {
    onSubmitFeedBack: UIFeedbackSubmitFunc,
    numberOfLines?: number,
};

type State = {
    email: string,
    feedback: string,
};

class UIFeedback extends UIComponent<Props, State> {
    emailInput: ?UIEmailInput;
    feedbackInput: ?UIDetailsInput<DetailsProps, ActionState>;

    static defaultProps: Props = {
        onSubmitFeedBack: () => {},
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            feedback: '',
        };
    }

    // Events
    onSubmitFeedBack = () => {
        const email = this.getEmail().trim();
        const feedback = this.getFeedback().trim();
        if (!email || !feedback) {
            return;
        }
        UICustomSheet.hide();
        UIToastMessage.showMessage(uiLocalized.ThanksForYourFeedback);
        this.props.onSubmitFeedBack({ email, feedback });
    };

    onChangeEmail = (newValue: string) => {
        this.setEmail(newValue);
    };

    onChangeFeedback = (newValue: string) => {
        this.setFeedback(newValue);
    };

    onShow = () => {
        if (this.emailInput) {
            this.emailInput.focus();
        }
    };

    onSubmitEmail = () => {
        if (this.feedbackInput) {
            this.feedbackInput.focus();
        }
    };

    // Setters
    setEmail(email: string) {
        this.setStateSafely({ email });
    }

    setFeedback(feedback: string) {
        this.setStateSafely({ feedback });
    }

    // Getters
    getEmail() {
        return this.state.email;
    }

    getFeedback() {
        return this.state.feedback;
    }

    isSubmitDisabled() {
        const email = this.getEmail();
        const feedback = this.getFeedback();
        return !(email && feedback && UIFunction.isEmail(email));
    }

    // Render
    render() {
        return (
            <View style={UIStyle.Common.flex()}>
                <View style={[UIStyle.Height.greatCell(), UIStyle.Common.centerLeftContainer()]}>
                    <Text style={UIStyle.Text.primaryAccentBold()}>
                        {uiLocalized.SendFeedback}
                    </Text>
                </View>
                <UIEmailInput
                    ref={(component) => { this.emailInput = component; }}
                    containerStyle={UIStyle.Height.greatCell()}
                    value={this.getEmail()}
                    placeholder={uiLocalized.YourEmail}
                    onChangeText={this.onChangeEmail}
                    onSubmitEditing={this.onSubmitEmail}
                />
                <UIDetailsInput
                    ref={(component) => { this.feedbackInput = component; }}
                    containerStyle={[UIStyle.Height.greatCell(), UIStyle.Margin.topDefault()]}
                    value={this.getFeedback()}
                    placeholder={uiLocalized.DescribeYourIssueOrIdea}
                    maxLines={this.props.numberOfLines}
                    onChangeText={this.onChangeFeedback}
                    onSubmitEditing={this.onSubmitFeedBack}
                />
                <UIButton
                    disabled={this.isSubmitDisabled()}
                    title={uiLocalized.Send}
                    style={UIStyle.Margin.topDefault()}
                    onPress={this.onSubmitFeedBack}
                />
            </View>
        );
    }
}

export default UIFeedback;
