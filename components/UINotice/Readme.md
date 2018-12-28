For web and tablets Notice is shown on left / For mobile devices on center
Open this component in full window mode to see an example:
 
Example:

```js
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

    render() {
        const autoHide = this.getAutoHide();
        return (
            <View style={{ margin: -16 }}>
                <View style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                        <View />
                    </View>
                    
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIDetailsView value="Auto-hide option  " />
                        <UIToggle 
                            active={this.getAutoHide()}
                            onPress={() => this.toggleAutoHide()}
                        />
                    </View>
                </View>
                <UINotice />
            </View>
        );
    }
};
<ModalExample />
```