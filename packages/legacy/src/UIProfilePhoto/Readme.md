Left profile photo in example is editable, you can press it and load anyone from your computer for both components.
Right profile photo isn't editable you can press and expand it in lightbox full-size.

```js
const image = require('../../../assets/ico-checkbox-square-active/ico-checkbox-square-active@3x.png');
console.log(image);

class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            source: image,
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <UIProfilePhoto
                    editable
                    style={{ marginRight: 16 }}
                    source={this.state.source}
                    onUploadPhoto={(newSource) => this.setState({ 
                        source: newSource
                    })}
                />
                <UIProfilePhoto
                    source={this.state.source}
                />
            </View>
        );
    }
};
<ModalExample />
```