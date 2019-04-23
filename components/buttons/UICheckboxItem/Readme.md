Example:

```js
class Example extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedSquare: true,
            selectedCircle: true,
        }
    }

    render() {
        const { selectedSquare, selectedCircle } = this.state;
        return (
            <View style={UIStyle.flexRow}>
                <UICheckboxItem
                    selected={selectedSquare}
                    onPress={() => this.setState({ 
                        selectedSquare: !selectedSquare
                    })}
                />
                <UICheckboxItem
                    selected={selectedCircle}
                    type={UICheckboxItem.Type.Circle}
                    onPress={() => this.setState({ 
                        selectedCircle: !selectedCircle
                    })}
                />
            </View>
        );
    }
};
<Example />
```
