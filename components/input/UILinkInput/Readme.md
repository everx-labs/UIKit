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
                <UILinkInput
                    theme={this.getTheme()}
                    value={this.state.details}
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
