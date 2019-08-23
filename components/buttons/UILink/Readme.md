Example:

```js
const iconCam = require('../../../assets/ico-camera/ico-camera.png');

class Example extends React.Component  {
    render() {
        return (
            <React.Fragment>
            <View style={{maxWidth: 330}}>
                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Right}
                    title="Right"
                    data="Data"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    title="Left"
                    data="Data"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Center}
                    title="Center"
                    data="Data"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    title="Left"
                    count="Count"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Right}
                    title="Right"
                    count="Count"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Center}
                    title="Center"
                    count="Count"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    title="Looooooooooooooooooooooooooooooong Action"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    title="Action"
                    onPress={() => alert('Action was called')}
                />
                <UILink
                    style={{ marginTop: 16 }}
                    disabled
                    textAlign={UILink.TextAlign.Right}
                    title="DisabledR"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    hasIcon
                    title="Center"
                />
                <UILink
                    style={{ marginTop: 16 }}
                    hasIconR
                    title="Center"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    hasIcon
                    hasIconR
                    title="Center"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    title="Left"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    hasIcon
                    title="Left"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    hasIconR
                    title="Left"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    hasIcon
                    hasIconR
                    title="Left"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    textAlign={UILink.TextAlign.Left}
                    icon={iconCam}
                    iconR={iconCam}
                    title="Left"
                />

                <UILink
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UILink.Indicator.Spin}
                />
                <UILink
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UILink.Indicator.Round}
                />
                <UILink
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UILink.Indicator.Pulse}
                />
                <UILink
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UILink.Indicator.Sandglass}
                />
                <UILink
                    style={{ marginTop: 16 }}
                    showIndicator
                />
            </View>
            </React.Fragment>
        );
    }
};
<Example />
```
