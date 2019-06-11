Example:

```js
class Example extends BackgroundContainer {
    renderContent() {
        return (
            <React.Fragment>
                <UIBackgroundView 
                    presetName={UIBackgroundView.PresetNames.Secondary}
                />
                <View style={UIStyle.paddingDefault}>
                    <UICard
                        progress
                        transparent
                    />
                    <UICard
                        containerStyle={UIStyle.marginTopHuge}
                        progress
                    />
                    <UICard
                        containerStyle={UIStyle.marginTopHuge}
                        transparent
                        title="Title"
                        caption="100.000000000"
                        details="details"
                    />
                    <UICard
                        containerStyle={UIStyle.marginTopHuge}
                        title="Title"
                        caption="100.000000000"
                        details="details"
                    />
                    <UICard 
                        width={240}
                        containerStyle={UIStyle.marginTopHuge}
                        transparent
                        title="Title"
                        details="details"
                    />
                    <UICard 
                        width={240}
                        containerStyle={UIStyle.marginTopHuge}
                        title="Title"
                        details="details"
                    />
                </View>
            </React.Fragment>  
        );
    }
}
<Example />
```
