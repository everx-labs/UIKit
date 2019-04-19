Example:

```js
class ExampleComponent extends ThemeSwitcherComponent {
    constructor() {
        super();
        this.state = {
            details: '',
        }
    }

    renderContent() {
        return (
            <div>
                <UIDateInput
                    theme={this.getTheme()}
                    value={this.state.details}
                    placeholder="Date"
                    comment="Some comment here"
                    onChangeText={(newText) => this.setState({ 
                        details: newText 
                    })}
                />
            </div>
        );
    }
};
<ExampleComponent />
```
