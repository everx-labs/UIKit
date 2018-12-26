Example:

```js
const containerStyle = {
    height: 300,
    margin: -16,
    padding: 16,
    borderRadius: 4,
}

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
    <UITextButton 
        title="Show default ActionSheet"
        onPress={() => UIActionSheet.show(menuItems)}
    />
    <UIActionSheet />
</View>
```