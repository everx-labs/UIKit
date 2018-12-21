Example:

```js
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

<UIView style={{ height: 300 }}>
    <UITextButton 
        title="Show default ActionSheet"
        onPress={() => UIActionSheet.show(menuItems)}
    />
    <UIActionSheet />
</UIView>
```