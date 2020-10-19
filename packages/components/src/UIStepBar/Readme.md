Example:

```js
const itemsList = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
];

class ExampleComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            activeIndex: 0,
        }
    }

    render() {
        return (
            <UIStepBar
                activeIndex={this.state.activeIndex}
                itemsList={itemsList}
                onPress={(activeIndex) => this.setState({ activeIndex })}
            />
        );
    }
};
<ExampleComponent />
```
