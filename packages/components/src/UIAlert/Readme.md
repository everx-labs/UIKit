Note: To show the alert, it has to contain at least one button, and title or description
Example:

As a standard component:
```js
<UIAlert
    shared={false}
    isVisible={your_flag_for_visibility}
    content={
        {
            title: 'This is the title',
            description: 'This is the alert description',
            buttons: // Receives an array of button arrays
            [
                [{ title: 'Button Left', onPress: () => {} }, { title: 'Button Right', onPress: () => {} }],
                [{ title: 'Single Button', onPress: () => {} }],
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
        buttons: // Receives an array of button arrays
        [
            [{ title: 'Button Left', onPress: () => {} }, { title: 'Button Right', onPress: () => {} }],
            [{ title: 'Single Button', onPress: () => {} }],
        ],
    }
);
```