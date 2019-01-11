```js
const containerStyle = {
    margin: -16,
    padding: 16,
}

class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            autoHide: true,
        }
    }

    getAutoHide() {
        return this.state.autoHide;
    }

    toggleAutoHide() {
        this.setState({ autoHide: !this.getAutoHide() });
    }

    renderNoticeButtons() {
        const autoHide = this.getAutoHide();
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
                    title="Show notice with action and cancell callback"
                    onPress={() => UINotice.showMessage({
                        message: 'System is going down at midnight tonight. We’ll notify you when it’s back up.',
                        action: {
                            title: 'Confirm',
                            onPress: () => alert('Action was called'),
                        },
                        onCancel: () => alert('Notice was canceled'),
                        autoHide,
                    })}
                />
                <UITextButton 
                    title="Show notice with title and action"
                    onPress={() => UINotice.showMessage({
                        title: 'Hey, Eugene',
                        message: 'Please confirm your Passport to complete transactions in your wallet.',
                        action: {
                            title: 'Confirm',
                            onPress: () => alert('Action was called'),
                        },
                        autoHide,
                    })}
                />
                <UITextButton 
                    title="Show notice with subcomponent, title and action"
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
                        autoHide,
                    })}
                />  
            </View>
        )
    }

    renderToastButtons() {
        const autoHide = this.getAutoHide();
        return (
            <View>
                <UITextButton 
                    title="Show default toast with message only"
                    onPress={() => UIToastMessage.showMessage(
                        'Address copied to clipboard.'
                    )}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UITextButton 
                        title="Show default toast on left"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Address copied to clipboard.',
                            placement: UIToastMessage.Place.Left,
                            autoHide,
                        })}
                    />
                    <UITextButton 
                        title="Show default toast on center"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Address copied to clipboard.',
                            placement: UIToastMessage.Place.Center,
                            autoHide,
                        })}
                    />
                    <View/>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UITextButton 
                        title="Show action toast on left"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Account deleted.',
                            action: {
                                title: 'Action',
                                onPress: () => alert('Action was called')
                            },
                            placement: UIToastMessage.Place.Left,
                            autoHide,
                        })}
                    />
                    <UITextButton 
                        title="Show action toast on center"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Account deleted.',
                            action: {
                                title: 'Action',
                                onPress: () => alert('Action was called')
                            },
                            placement: UIToastMessage.Place.Center,
                            autoHide,
                        })}
                    />
                    <View/>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UITextButton 
                        title="Show alert toast on left"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Error deleting account.',
                            type: UIToastMessage.Type.Alert,
                            placement: UIToastMessage.Place.Left,
                            autoHide,
                        })}
                    />
                    <UITextButton 
                        title="Show alert toast on center"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Error deleting account.',
                            type: UIToastMessage.Type.Alert,
                            placement: UIToastMessage.Place.Center,
                            autoHide,
                        })}
                    />
                    <View/>
                </View>
            </View>
        );
    }

    renderToggle() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <UIDetailsView value="Auto-hide option  " />
                <UIToggle 
                    active={this.getAutoHide()}
                    onPress={() => this.toggleAutoHide()}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={containerStyle}>
                {this.renderToggle()} 
                {this.renderNoticeButtons()}        
                {this.renderToastButtons()}       
                <UINotice />
            </View>
        );
    }
};
<ModalExample />
```

For web and tablets Notice is shown on left / For mobile devices on center.