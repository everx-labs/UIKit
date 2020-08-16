Example:

As a standard component:
```js
<UIAlert
    masterAlert={false}
    isVisible={your_flag_for_visibility}
    content={
        {
            title: 'This is the title',
            description: 'This is the alert description',
            buttons: // Receives an array of pair of buttons (named `buttonA` and `buttonB`, B is optional)
            [
                { buttonA: { title: 'Button Left', onPress: () => {} }, buttonB: { title: 'Button Right', onPress: () => {} } },
                { buttonA: { title: 'Single Button', onPress: () => {} } },
            ],
            }
        }
/>
```

As a master alert component:
```js
// Add it to main render method
<UIAlert />

// Call it anywhere with the content to display
UIAlert.showAlert(
    {
        title: 'This is the title',
        description: 'This is the alert description',
        buttons: // Receives an array of pair of buttons (named `buttonA` and `buttonB`, B is optional)
        [
            { buttonA: { title: 'Button Left', onPress: () => {} }, buttonB: { title: 'Button Right', onPress: () => {} } },
            { buttonA: { title: 'Single Button', onPress: () => {} } },
        ],
    }
);
```