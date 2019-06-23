Example:

```js
class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            seedPhrase: '',
            phraseToCheck: 'report - meadow - village - slight'
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
                    phraseToCheck={this.state.phraseToCheck}
                />
            </View>
        );
    }
};
<ExampleComponent />
```
