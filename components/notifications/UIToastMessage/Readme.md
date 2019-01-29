```js
const containerStyle = {
    margin: -16,
    padding: 16,
    height: 550,
}

class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            footer: true,
        }
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
                <UIToggle 
                    active={footer}
                    onPress={() => this.toggleFooter()}
                />
            </View>
        )
    }

    renderNoticeButtons() {
        return (
            <View>
                <UITextButton 
                    title="Show default notice with message only"
                    onPress={() => UINotice.showMessage(
                        'System is going down at midnight tonight. We’ll notify you when it’s back up.'
                    )}
                />
                <UITextButton 
                    title="Show default notice on top"
                    onPress={() => UINotice.showMessage({
                        message: 'System is going down at midnight tonight. We’ll notify you when it’s back up.',
                        placement: UINotice.Place.Top,
                    })}
                />
                <UITextButton 
                    title="Show notice with subcomponent, title, action, cancel callback without autohide"
                    onPress={() => UINotice.showMessage({
                        title: 'Hey, Eugene',
                        subComponent: (
                            <UIProfileInitials
                                id="1"
                                initials="AA"
                                avatarSize={UIConstant.iconSize()}
                                textStyle={{...UIFont.iconRegular()}}
                            />
                        ),
                        message: 'Please confirm your Passport to complete transactions in your wallet.',
                        action: {
                            title: 'Confirm',
                            onPress: () => alert('Action was called'),
                        },
                        onCancel: () => alert('Notice was canceled'),
                        autoHide: false,
                    })}
                />  
            </View>
        )
    }

    renderToastButtons() {
        return (
            <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UITextButton 
                        title="Show default toast on left"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Address copied to clipboard.',
                            placement: UIToastMessage.Place.Left,
                        })}
                    />
                    <UITextButton 
                        title="Show default toast with message only"
                        onPress={() => UIToastMessage.showMessage(
                            'Address copied to clipboard.'
                        )}
                    />
                    <View/>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UITextButton 
                        title="Show action toast on left without autohide"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Account deleted.',
                            action: {
                                title: 'Action',
                                onPress: () => alert('Action was called')
                            },
                            placement: UIToastMessage.Place.Left,
                            autoHide: false,
                        })}
                    />
                    <UITextButton 
                        title="Show alert toast on center without autohide"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Error deleting account.',
                            type: UIToastMessage.Type.Alert,
                            placement: UIToastMessage.Place.Center,
                        })}
                    />
                    <View/>
                </View>
            </View>
        );
    }

    renderFooter() {
        if (!this.state.footer) {
            return null;
        }
        return (
            <UIButton
                title="Footer button"
                style={UIStyle.bottomScreenContainer}
                buttonSize={UIButton.ButtonSize.Large}
                footer
                onPress={() => alert('Action was called')}
            />
        )
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
};
<ModalExample />
```

For web and tablets Notice is shown on left / For mobile devices on center.