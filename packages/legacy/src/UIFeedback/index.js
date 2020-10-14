// @flow
import React from 'react';
import { Text, View } from 'react-native';

import {
    UIFunction,
    UIStyle,
    UILocalized,
} from '@uikit/core';
import {
    UICustomSheet,
    UIButton,
    UIComponent,
    UIDetailsInput,
    UIToastMessage,
    UIEmailInput,
} from '@uikit/components';
import type { DetailsProps } from '@uikit/components/UIDetailsInput';
import type { ActionState } from '@uikit/components/UIActionComponent';

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
        UIToastMessage.showMessage(UILocalized.ThanksForYourFeedback);
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
                        {UILocalized.SendFeedback}
                    </Text>
                </View>
                <UIEmailInput
                    ref={(component) => { this.emailInput = component; }}
                    containerStyle={UIStyle.Height.greatCell()}
                    value={this.getEmail()}
                    placeholder={UILocalized.YourEmail}
                    onChangeText={this.onChangeEmail}
                    onSubmitEditing={this.onSubmitEmail}
                />
                <UIDetailsInput
                    ref={(component) => { this.feedbackInput = component; }}
                    containerStyle={[UIStyle.Height.greatCell(), UIStyle.Margin.topDefault()]}
                    value={this.getFeedback()}
                    placeholder={UILocalized.DescribeYourIssueOrIdea}
                    maxLines={this.props.numberOfLines}
                    onChangeText={this.onChangeFeedback}
                    onSubmitEditing={this.onSubmitFeedBack}
                />
                <UIButton
                    disabled={this.isSubmitDisabled()}
                    title={UILocalized.Send}
                    style={UIStyle.Margin.topDefault()}
                    onPress={this.onSubmitFeedBack}
                />
            </View>
        );
    }
}

export default UIFeedback;
