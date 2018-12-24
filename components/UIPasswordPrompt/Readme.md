Open this component on separate page to see correct example:

```js
<div>
    <UITextButton 
        title="Show password prompt"
        onPress={() => UIPasswordPrompt.showPrompt({ 
            title: 'Write password',
        })}
    />
    <UITextButton 
        title="Show password prompt with confirm"
        onPress={() => UIPasswordPrompt.showPrompt({
            title: 'Write password and confirm it',
            shouldConfirm: true,
        })}
    />
    <UIPasswordPrompt />
</div>
```