Example:

```js
class ExampleComponent extends ThemeSwitcher {
    constructor() {
        super();
        this.state = {
            details: '',
        };
    }

    renderContent() {
        return (
            <UIAmountInput
                theme={this.getTheme()}
                value={this.state.details}
                placeholder="Amount"
                comment="Some comment here"
                onChangeText={newText =>
                    this.setState({
                        details: newText,
                    })
                }
            />
        );
    }
}
<ExampleComponent />;
```
