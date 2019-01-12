Example:

```js
<View style={{ height: 300, margin: -16 }}>
    <View style={{ padding: 16 }}>
        <UITextButton
            title="Show default AlertView"
            onPress={() => UIAlertView.showAlert(
                'Title',
                'Some message here',
                [
                    { title: 'Ok' }
                ]
            )}
        />
    </View>
    <UIAlertView />
</View>
```