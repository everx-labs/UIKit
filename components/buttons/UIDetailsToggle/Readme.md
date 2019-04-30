Example:

```js
class Example extends React.Component {
    constructor() {
        super();
        this.state = {
            active: false,
        }
    }

    render() {
        const { active } = this.state;
        return (
            <UIDetailsToggle
                details="Details"
                comments="Some comment here"
                active={active}
                onPress={() => this.setState({ active: !active })}
            />
        );
    }
};
<Example />
```
