Use this component inside navigationOptions for React Navigation
```js static
static navigationOptions(navigation: ReactNavigation, options: UINavigationBarOptions)

<UINavigationBackButton navigation={navigation} />
```

Example:
```js noeditor
<UINavigationBackButton 
    navigation={{ 
        state: {},
        goBack: () => {},
    }}
/>
```