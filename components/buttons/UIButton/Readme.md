Example:

```js
const icon = require('../../../assets/ico-camera/ico-camera.png');

class ExampleComponent extends ThemeSwitcherComponent {
    constructor() {
        super();
        this.state = {
            i: 1,
        }
    }

    renderContent() {
        return (
            <React.Fragment>
                <UIButton
                    theme={this.getTheme()}
                    title="Default button"
                    onPress={() => alert('Action was called')}
                />
                <UIButton
                    theme={this.getTheme()}
                    style={{ marginTop: 16 }}
                    buttonShape={UIButton.ButtonShape.Radius}
                    title="Radius badge button"
                    onPress={() => this.setState({ i: this.state.i + 1})}
                    badge={this.state.i}
                />
                <UIButton
                    theme={this.getTheme()}
                    style={{ marginTop: 16 }}
                    buttonShape={UIButton.ButtonShape.Rounded}
                    icon={icon} 
                    title="Rounded icon button"
                />
                <UIButton
                    disabled
                    theme={this.getTheme()}
                    style={{ marginTop: 16 }}
                    buttonSize={UIButton.ButtonSize.Small}
                    title="Disabled tiny button"
                />
            </React.Fragment>
        );
    }
};
<ExampleComponent />
```
