Example:

```js
const buttonContainer = {
    height: 200,
    width: 280,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'grey',
};

class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
        };
    }

    showSpinner() {
        this.setState({ visible: true });
        setTimeout(() => {
            this.setState({ visible: false });
        }, 2000);
    }

    showMasterSpinner() {
        UISpinnerOverlay.show();
        setTimeout(() => {
            UISpinnerOverlay.hide();
        }, 2000);
    }

    render() {
        const { visible, modalMode } = this.state;
        return (
            <View style={{ margin: -16, padding: 16 }}>
                <View style={buttonContainer}>
                    <UILinkButton title="Show spinner overlay" onPress={() => this.showSpinner()} />
                    <UILinkButton
                        title="Show master spinner overlay"
                        onPress={() => this.showMasterSpinner()}
                    />
                    <UISpinnerOverlay visible={visible} />
                </View>
                <UISpinnerOverlay masterSpinner />
            </View>
        );
    }
}
<ModalExample />;
```
