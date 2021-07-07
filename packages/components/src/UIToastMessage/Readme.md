Example:

```js
const containerStyle = {
    margin: -16,
    padding: 16,
    height: 350,
}

const rowStyle = { 
    flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'
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
                <View style={rowStyle}>
                    <UILinkButton 
                        title="Show default on left"
                        onPress={() => UIToastMessage.showMessage({
                            message: 'Address copied to clipboard.',
                            placement: UIToastMessage.Place.Left,
                        })}
                    />
                    <UILinkButton 
                        title="Show default with message only"
                        onPress={() => UIToastMessage.showMessage(
                            'Address copied to clipboard.'
                        )}
                    />
                    <View/>
                </View>
                <View style={[{ display: 'flex' }, rowStyle]}>
                    <UILinkButton 
                        title="Show action on left, no autohide"
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
                    <UILinkButton 
                        title="Show alert on center, no autohide"
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
            <View style={UIStyle.bottomScreenContainer}>
                <UIBoxButton
                    title="Footer button"
                    onPress={() => alert('Action was called')}
                />
            </View>
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
