Example:

```js
const containerStyle = {
    height: 300,
    margin: -16,
    padding: 16,
    borderRadius: 4,
};

const menuItems = [
    {
        title: 'Item 1',
        onPress: () => alert('Action 1 was called'),
    },
    {
        title: 'Item 2',
        onPress: () => alert('Action 2 was called'),
    },
];

<View style={containerStyle}>
    <UILinkButton title="Show ActionSheet" onPress={() => this.actionSheet.show()} />
    <UILinkButton title="Show master ActionSheet" onPress={() => UIActionSheet.show(menuItems)} />
    <UIActionSheet
        ref={component => {
            this.actionSheet = component;
        }}
        needCancelItem
        menuItemsList={menuItems}
        masterActionSheet={false}
    />
    <UIActionSheet />
</View>;
```
