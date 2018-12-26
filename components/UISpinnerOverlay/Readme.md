Example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
        }
    }

    showSpinner() {
        this.setState({ visible: true });
        setTimeout(() => {
            this.setState({ visible: false })
        }, 2000);
    }

    render() {
        const { visible, modalMode } = this.state;
        return (
            <View style={{ height: 200, justifyContent: 'flex-end' }}>
                <UIButton 
                    title="Show spinner overlay"
                    onPress={() => this.showSpinner()}
                />
                <UISpinnerOverlay
                    visible={visible}
                />
            </View>
        );
    }
};
<ModalExample />
```