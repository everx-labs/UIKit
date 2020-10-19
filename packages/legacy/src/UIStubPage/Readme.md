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
                        presetName={UIBackgroundView.PresetNames.Action}
                    />
                </View>
                <UINotice />
            </React.Fragment>
        );
    }
}
<Example />
```
