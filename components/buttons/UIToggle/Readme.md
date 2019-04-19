Example:

```js
class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            active: true,
            coloredActive: true,
        }
    }

    render() {
        const { active, coloredActive } = this.state;
        return (
            <View style={{ flexDirection: 'row' }}>
                <UIToggle
                    active={active}
                    onPress={() => this.setState({ active: !active })}
                />
                <UIToggle
                    colored
                    containerStyle={{ marginLeft: 16 }}
                    active={coloredActive}
                    onPress={() => this.setState({ 
                        coloredActive: !coloredActive
                    })}
                />
            </View>
        );
    }
};
<ExampleComponent />
```
