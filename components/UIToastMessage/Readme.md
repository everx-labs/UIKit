UIToastMessage example:

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
            <UIView>
                <UITextButton 
                        title="Show default toast with message only"
                        onPress={() => UIToastMessage.showMessage(
                            'Address copied to clipboard.'
                        )}
                    />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                    <div/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                    <div/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                    <div/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <UIDetailsView value="Auto-hide option  " />
                    <UIToggle 
                        active={this.getAutoHide()}
                        onPress={() => this.toggleAutoHide()}
                    />
                </div>
                <UIToastMessage />
            </UIView>
        );
    }
};
<ModalExample />
```