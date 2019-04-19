Example:

```js
class FeedbackForm extends UIComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            feedback: '',
        };
    }

    // Events
    onSubmitFeedBack() {
        const email = this.getEmail();
        const feedback = this.getFeedback();
        if (!email || !feedback) {
            return;
        }
        UICustomSheet.hide();
        UIToastMessage.showMessage('Thanks for your feedback');
    }

    // Setters
    setEmail(email) {
        this.setStateSafely({ email });
    }

    setFeedback(feedback) {
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
            <View style={UIStyle.flex}>
                <View style={[UIStyle.greatCellHeight, UIStyle.centerLeftContainer]}>
                    <Text style={UITextStyle.primaryAccentBold}>
                        Send feedback
                    </Text>
                </View>
                <UIEmailInput
                    ref={(component) => { this.emailInput = component; }}
                    containerStyle={UIStyle.greatCellHeight}
                    value={this.getEmail()}
                    onChangeText={value => this.setEmail(value)}
                    onSubmitEditing={() => this.feedbackInput.focus()}
                />
                <UIDetailsInput
                    ref={(component) => { this.feedbackInput = component; }}
                    containerStyle={UIStyle.greatCellHeight}
                    value={this.getFeedback()}
                    placeholder="Describe your idea"
                    onChangeText={value => this.setFeedback(value)}
                    onSubmitEditing={() => this.onSubmitFeedBack()}
                />
                <UIButton
                    disabled={this.isSubmitDisabled()}
                    title="Send"
                    style={UIStyle.marginTopDefault}
                    onPress={() => this.onSubmitFeedBack()}
                />
            </View>
        );
    }
}

const containerStyle = {
    height: 300,
    margin: -16,
    padding: 16,
    borderRadius: 4,
};
let sheetRef = null;

<View style={containerStyle}>
    <UITextButton 
        title="Show feedback form"
        onPress={() => sheetRef.show()}
    />
    <UITextButton 
        title="Show master feedback form"
        onPress={() => UICustomSheet.show(<FeedbackForm />)}
    />
    <UICustomSheet
        ref={(component) => { sheetRef = component; }}
        component={<FeedbackForm />}
        masterActionSheet={false}
    />
    <UICustomSheet />
</View>
```
