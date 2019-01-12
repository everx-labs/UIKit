DetailsInput example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            details: '',
        }
    }

    render() {
        return (
            <div>
                <UIDetailsInput
                    details={this.state.details}
                    placeholder="Details"
                    comment="Some comment here"
                    onChangeText={(newText) => this.setState({ 
                        details: newText 
                    })}
                />
            </div>
        );
    }
};
<ModalExample />
```