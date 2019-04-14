Example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            expression: '',
        }
    }

    render() {
        const { expression } = this.state;
        return (
            <UISearchBar
                value={expression}
                placeholder="Your expression"
                onChangeExpression={(newExpression) => this.setState({ 
                    expression: newExpression 
                })}
            />
        );
    }
};
<ModalExample />
```