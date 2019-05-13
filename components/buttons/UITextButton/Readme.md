Example:

```js
class Example extends ThemeSwitcher {
    renderContent() {
        return (
            <React.Fragment>
                <UITextButton
                    theme={this.getTheme()}
                    title="Text button"
                />
                <UITextButton
                    theme={this.getTheme()}
                    title="Text button with details"
                    details="Some details"
                />
                <UITextButton
                    theme={this.getTheme()}
                    disabled
                    title="Disabled text button"
                />
            </React.Fragment>
        );
    }
}
<Example />
```
