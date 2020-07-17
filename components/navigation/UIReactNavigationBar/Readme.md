Example:

```js static
static navigationOptions: 
	CreateNavigationOptions = ({ 
		navigation 
	}) => {
	const { 
		navigationOptions
	} = UINavigationBar;
	return navigationOptions(
		navigation, {
		title: "Title",
		headerRight: (
			<View>
				<Text>
					Right component
				</Text>
			</View>
		),
	});
};
```
