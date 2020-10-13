Example:

```js
const itemsList = [
    {
        title: 'Card 1',
        details: 'details',
    },
    {
        title: 'Card 2',
        details: 'details',
    },
    {
        title: 'Card 3',
        details: 'details',
    },
    {
        title: 'Card 4',
        details: 'details',
    },
    {
        title: 'Card 5',
        details: 'details',
    }
]

class Example extends BackgroundContainer {
    renderContent() {
        return (
            <View style={{ overflow: 'hidden', padding: 16 }}>
                <UIBackgroundView 
                    presetName={UIBackgroundView.PresetNames.Secondary}
                />
                <UISlider
                     itemsList={itemsList}
                     itemRenderer={({title, details}) => (
                         <UICard
                         	key={`slider-item-${title}-${details}`}
                             containerStyle={UIStyle.marginRightDefault}
                             width={240}
                             title={title}
                             details={details}
                         />
                     )}
                     itemWidth={256}
                />
            </View>
        );
    }
}
<Example />
```
