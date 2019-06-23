Example:

```js
class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            seedPhrase: '',
        }
    }

    render() {
        return (
            <View>
                <UISeedPhraseInput
                    testID="uiSeedPhraseInput"
                    value={this.state.seedPhrase}
                    onChangeText={(newText) => this.setState({
                        seedPhrase: newText
                    })}
                />
            </View>
        );
    }
};
<ExampleComponent />
```
