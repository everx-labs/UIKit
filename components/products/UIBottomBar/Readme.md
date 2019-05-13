Example:

```js
class Example extends ThemeSwitcher {
    renderContent() {
        return (
            <View style={{ height: 120 }}>
                <UIBottomBar
                    theme={this.getTheme()}
                    accentText={UILocalized.Contact}
                    accentEmail={UILocalized.PressEmail}
                    copyRight={UILocalized.CopyRight}
                />
            </View>
        );
    }
}
<Example />
```

```js
class Example extends React.Component {
    render() {
        return (
            <View style={{ height: 180 }}>
                <UIBottomBar
                    containerStyle={UIStyle.marginBottomHuge}
                    leftText="Feedback"
                    companyName="Wallet solutions OÜ"
                    address="Jõe 2"
                    postalCode="10151"
                    location="Tallinn, Estonia"
                    email="os@ton.space"
                    phoneNumber="+372 7124030"
                    copyRight="2018-2019 © TON Labs"
                />
            </View>
        );
    }
}
<Example />
```

```js
class Example extends React.Component {
    render() {
        return (
            <View style={{ height: 180 }}>
                <UIBottomBar
                    isNarrow={false}
                    containerStyle={UIStyle.marginBottomHuge}
                    leftText="Feedback"
                    companyName="Wallet solutions OÜ"
                    address="Jõe 2"
                    postalCode="10151"
                    location="Tallinn, Estonia"
                    email="os@ton.space"
                    phoneNumber="+372 7124030"
                    copyRight="2018-2019 © TON Labs"
                />
            </View>
        );
    }
}
<Example />
```
