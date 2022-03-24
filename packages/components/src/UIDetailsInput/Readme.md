Example:

```js
class ExampleComponent extends ThemeSwitcher {
    constructor() {
        super();
        this.state = {
            details: '',
            arrowDetails: '',
            multilineDetails: '',
        };
    }

    renderContent() {
        return (
            <View>
                <UIDetailsInput
                    value={this.state.details}
                    placeholder="Details"
                    comment="Some comment here"
                    onChangeText={newText =>
                        this.setState({
                            details: newText,
                        })
                    }
                />
                <UIDetailsInput
                    value={this.state.multilineDetails}
                    placeholder="Multiline details"
                    comment="Some comment here"
                    maxLines={3}
                    containerStyle={{ marginTop: 16 }}
                    onChangeText={newText =>
                        this.setState({
                            multilineDetails: newText,
                        })
                    }
                />
            </View>
        );
    }
}
<ExampleComponent />;
```
