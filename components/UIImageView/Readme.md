Left image in example is editable, you can press it and load anyone from your computer for both components.
Right image isn't editable you can press and expand it in lightbox full-size.

```js
const image = require('../../assets/ico-checkbox-square-active/ico-checkbox-square-active@3x.png');

class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            source: image,
        }
    }

    render() {
        return (
            <UIView style={{ flexDirection: 'row' }}>
                <UIView style={{ marginRight: 16 }}>
                    <UIImageView
                        photoStyle={{ width: 100, height: 100 }}
                        editable
                        source={this.state.source}
                        onUploadPhoto={(newSource) => this.setState({ 
                            source: newSource
                        })}
                    />
                </UIView>
                <UIImageView
                    photoStyle={{ width: 100, height: 100 }}
                    source={this.state.source}
                />
            </UIView>
        );
    }
};
<ModalExample />
```