Example will be here soon

```js noeditor
<View style={{ height: 300, margin: -16 }}>
    <View style={{ padding: 16 }}>
        <UITextButton
            title="Show DropdownAlert"
            onPress={() => UIDropdownAlert.showNotification(
                'Title',
                'Some message here',
                () => alert('Callback was called'),
            )}
        />
    </View>
    <UIDropdownAlert />
</View>
```