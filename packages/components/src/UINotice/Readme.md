Example:

```js
const containerStyle = {
    margin: -16,
    padding: 16,
    height: 550,
};

class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            footer: true,
        };
    }

    toggleFooter() {
        this.setState({ footer: !this.state.footer });
    }

    // Render
    renderToggle() {
        const { footer } = this.state;
        return (
            <View style={UIStyle.centerLeftContainer}>
                <UIDetailsView value="Show footer  " />
                <UIToggle active={footer} onPress={() => this.toggleFooter()} />
            </View>
        );
    }

    renderNoticeButtons() {
        return (
            <View>
                <UILinkButton
                    title="Show default notice with message only"
                    onPress={() =>
                        UINotice.showMessage(
                            'System is going down at midnight tonight. We’ll notify you when it’s back up.',
                        )
                    }
                />
                <UILinkButton
                    title="Show default notice on top"
                    onPress={() =>
                        UINotice.showMessage({
                            message:
                                'System is going down at midnight tonight. We’ll notify you when it’s back up.',
                            placement: UINotice.Place.Top,
                        })
                    }
                />
                <UILinkButton
                    title="Show notice with subcomponent"
                    onPress={() =>
                        UINotice.showMessage({
                            title: 'Hey, Eugene',
                            subComponent: (
                                <UIProfileInitials
                                    id="1"
                                    initials="AA"
                                    avatarSize={UIConstant.iconSize()}
                                    textStyle={{ ...UIFont.iconRegular() }}
                                />
                            ),
                            message:
                                'Please confirm your Passport to complete transactions in your wallet.',
                            action: {
                                title: 'Confirm',
                                onPress: () => alert('Action was called'),
                            },
                            onCancel: () => alert('Notice was canceled'),
                            autoHide: false,
                        })
                    }
                />
            </View>
        );
    }

    renderFooter() {
        if (!this.state.footer) {
            return null;
        }
        return (
            <View style={UIStyle.bottomScreenContainer}>
                <UIBoxButton title="Footer button" onPress={() => alert('Action was called')} />
            </View>
        );
    }

    render() {
        return (
            <View style={containerStyle}>
                {this.renderToggle()}
                {this.renderNoticeButtons()}
                <UINotice />
                {this.renderFooter()}
            </View>
        );
    }
}
<ExampleComponent />;
```

For web and tablets Notice is shown on left / For mobile devices on center.
