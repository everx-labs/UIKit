Example:

```js
class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            details: '',
        }
    }

    render() {
        return (
            <View style={UIStyle.greatCellHeight}>
                <UIDateInput
                    value={this.state.details}
                    placeholder="Date"
                    comment="Some comment here"
                    onChangeText={(newText) => this.setState({ 
                        details: newText 
                    })}
                />
            </View>
        );
    }
};
<ExampleComponent />
```
