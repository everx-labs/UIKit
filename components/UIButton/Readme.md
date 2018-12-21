Example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            i: 1,
        }
    }

    render() {
        return (
            <div>
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
            </div>
        );
    }
};
<ModalExample />
```