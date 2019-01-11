Example:

```js static
static navigationOptions: CreateNavigationOptions = ({ navigation }) => {
        return UINavigationBar.navigationOptions(navigation, {
            title: "Title",
            headerRight: (<View>
                <Text>Right component</Text>
            </View>),
        });
    };
```