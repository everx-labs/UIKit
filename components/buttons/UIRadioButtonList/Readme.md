Example:

```js
const radiobuttonList = [
    { title: 'Option 1' },
    { title: 'Option 2' },
    { title: 'Option 3' },
];

class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            selected: 0,
        }
    }

    render() {
        const { selected } = this.state;
        return (
            <UIRadioButtonList
                state={{ selected, radiobuttonList }}
                onSelect={(newIndex) => this.setState({ 
                    selected: newIndex 
                })}
            />
        );
    }
};
<ExampleComponent />
```
