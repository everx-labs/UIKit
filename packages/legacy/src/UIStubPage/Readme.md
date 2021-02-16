Example:

```js
class Example extends BackgroundContainer {
    renderContent() {
        return (
            <React.Fragment>
                <View style={{ height: 620 }}>
                    <UIStubPage
                        title="labs."
                        needBottomIcon={false}
                    />
                </View>
                <UINotice />
            </React.Fragment>
        );
    }
}
<Example />
```
