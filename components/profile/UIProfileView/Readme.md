Left profile photo in example is editable, you can press it and load anyone from your computer for both components.
Right profile photo isn't editable you can press and expand it in lightbox full-size.

```js
const image = require('../../../assets/ico-checkbox-square-active/ico-checkbox-square-active@3x.png');

class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            photo: image,
            name: 'Editable',
            secondName: 'Profile',
        }
    }

    render() {
        const { name, secondName } = this.state;
        return (
            <View style={{ flexDirection: 'row' }}>
                <UIProfileView
                    editable
                    containerStyle={{ marginRight: 16 }}
                    photo={this.state.photo}
                    hasSecondName
                    name={name}
                    secondName={secondName}
                    namePlaceholder="Name"
                    secondNamePlaceholder="Second name"
                    details="Details"
                    autoCapitalize="words"
                    onChangeName={(newName) => this.setState({ 
                        name: newName
                    })}
                    onChangeSecondName={(newSecondName) => this.setState({ 
                        secondName: newSecondName
                    })}
                    onUploadPhoto={(newPhoto) => this.setState({ 
                        photo: newPhoto
                    })}
                />
                <UIProfileView
                    containerStyle={{ marginRight: 16 }}
                    photo={this.state.photo}
                    hasSecondName
                    name="Fixed"
                    secondName="Profile"
                    details="Details"
                    onUploadPhoto={(newPhoto) => this.setState({ 
                        photo: newPhoto
                    })}
                />
                <UIProfileView
                    id="1"
                    initials="AB"
                    containerStyle={{ marginRight: 16 }}
                    hasSecondName
                    name="Initials"
                    secondName="Profile"
                    details="Details"
                    onUploadPhoto={(newPhoto) => this.setState({ 
                        photo: newPhoto
                    })}
                />
            </View>
        );
    }
};
<ModalExample />
```