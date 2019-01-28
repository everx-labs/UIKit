DetailsInput example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            details: '',
            multilineDetails: '',
        }
    }

    render() {
        return (
            <div>
                <UIDetailsInput
                    value={this.state.details}
                    placeholder="Details"
                    comment="Some comment here"
                    onChangeText={(newText) => this.setState({ 
                        details: newText 
                    })}
                />
                <UIDetailsInput
                    value={this.state.multilineDetails}
                    placeholder="Multiline details"
                    comment="Some comment here"
                    maxLines={3}
                    containerStyle={{ marginTop: 16 }}
                    onChangeText={(newText) => this.setState({ 
                        multilineDetails: newText 
                    })}
                />
            </div>
        );
    }
};
<ModalExample />
```