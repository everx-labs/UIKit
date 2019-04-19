Example:

```js
const containerStyle = {
    margin: -16,
    padding: 16,
    height: 350,
}

class ExampleComponent extends React.Component {
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
                footer
                onPress={() => alert('Action was called')}
            />
        )
    }

    render() {
        return (
            <View style={containerStyle}>
                {this.renderToggle()} 
                {this.renderToastButtons()}
                <UINotice />
                {this.renderFooter()}
            </View>
        );
    }
};
<ExampleComponent />
```
