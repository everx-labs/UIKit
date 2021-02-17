Example:

```js
class Example extends BackgroundContainer {
    renderContent() {
        return (
            <React.Fragment>
                <View style={UIStyle.paddingDefault}>
                    <UIDetailsButton
                        progress
                        transparent
                    />
                    <UIDetailsButton
                        containerStyle={UIStyle.marginTopHuge}
                        progress
                    />
                    <UIDetailsButton
                        containerStyle={UIStyle.marginTopHuge}
                        transparent
                        title="Title"
                        caption="100.000000000"
                        details="details"
                    />
                    <UIDetailsButton
                        containerStyle={UIStyle.marginTopHuge}
                        title="Title"
                        caption="100.000000000"
                        details="details"
                    />
                    <UIDetailsButton 
                        width={240}
                        containerStyle={UIStyle.marginTopHuge}
                        transparent
                        title="Title"
                        details="details"
                    />
                    <UIDetailsButton 
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
