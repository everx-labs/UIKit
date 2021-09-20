For Web and Tablet UIMenuView renders itself and for mobile app it calls UIActionSheet

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

<UIMenuBackground>
    <View style={{ height: 200 }}>
        <UIMenuView menuItemsList={menuItems}>
            <UIDetailsView value="Menu trigger" comments="Press to show menu" />
        </UIMenuView>
    </View>
</UIMenuBackground>;
```
