Example:

```js
<UIView style={{ height: 300, padding: 0 }}>
    <UIView style={{ margin: 0 }}>
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
    </UIView>
    <UIAlertView />
</UIView>
```