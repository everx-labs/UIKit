Example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            i: 1,
            theme: UIColor.Theme.Light,
        }
    }

    render() {
        console.log('>>>', this.state.theme);
        return (
            <ThemeSwitcher
                theme={this.state.theme}
                onChangeTheme={(theme) => this.setState({ theme })}
            >
                <UIButton
                    title="Default button"
                    onPress={() => alert('Action was called')}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    title="Button with badge"
                    onPress={() => this.setState({ i: this.state.i + 1})}
                    badge={this.state.i}
                />
            </ThemeSwitcher>
        );
    }
};
<ModalExample />
```
