Example:

```js
class Example extends BackgroundContainer {
    renderContent() {
        return (
            <View style={UIStyle.Height.greatCell()}>
                <UIBackgroundView 
                    presetName={UIBackgroundView.PresetNames.Primary}
                />
            </View>
        );
    }
}
<Example />
```

```js
class Example extends BackgroundContainer {
    renderContent() {
        return (
            <View style={UIStyle.Height.greatCell()}>
                <UIBackgroundView 
                    presetName={UIBackgroundView.PresetNames.Secondary}
                />
            </View>
        );
    }
}
<Example />
```

```js
class Example extends BackgroundContainer {
    renderContent() {
        return (
            <View style={UIStyle.Height.greatCell()}>
                <UIBackgroundView 
                    presetName={UIBackgroundView.PresetNames.Action}
                />
            </View>
        );
    }
}
<Example />
```
