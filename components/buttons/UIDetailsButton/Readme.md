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
                    <UICardView
                        progress
                        transparent
                    />
                    <UICardView
                        containerStyle={UIStyle.marginTopHuge}
                        progress
                    />
                    <UICardView
                        containerStyle={UIStyle.marginTopHuge}
                        transparent
                        title="Title"
                        caption="100.000000000"
                        details="details"
                    />
                    <UICardView
                        containerStyle={UIStyle.marginTopHuge}
                        title="Title"
                        caption="100.000000000"
                        details="details"
                    />
                    <UICardView 
                        width={240}
                        containerStyle={UIStyle.marginTopHuge}
                        transparent
                        title="Title"
                        details="details"
                    />
                    <UICardView 
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
